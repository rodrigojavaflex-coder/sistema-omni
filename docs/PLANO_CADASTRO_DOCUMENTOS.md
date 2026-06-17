# Plano de Desenvolvimento — Cadastro de Documentos

## Objetivo

Permitir cadastrar, consultar, atualizar e compartilhar documentos organizacionais com metadados (tipo, nome, departamento, responsável, status) e arquivo anexo, com opção controlada de link público sem login.

## Escopo

- CRUD **Tipo de Documento** (cadastro auxiliar vinculado por FK).
- CRUD **Documento** (metadados + upload/download de arquivo).
- Vínculo com **Departamento** (`departamentos.id`).
- **Responsável** vinculado ao usuário cadastrado (`usuarios.id`).
- **Status** enum: Ativo, Em Revisão, Obsoleto, Arquivado.
- **Arquivo** armazenado no PostgreSQL (`bytea`), limite **25 MB**.
- **Link compartilhável** sem login: Opção A (token opaco) com **expiração opcional**.
- Permissões, menu, auditoria e contratos API/Swagger.

## Fora de escopo (fase 1)

- Versionamento de documentos (histórico de revisões).
- Workflow de aprovação de revisão.
- Assinatura digital.
- OCR / busca full-text no conteúdo.
- Mobile.
- Storage externo (S3/Azure) — evolução futura se arquivos crescerem além do limite.

## Decisões de produto (fechadas)

| Decisão | Escolha |
|---------|---------|
| Link público | **Opção A** — token opaco revogável, com **expiração opcional** |
| Limite de arquivo | **25 MB** |
| Responsável | **FK para `usuarios`** (não texto livre) |

---

## Link público — Opção A com expiração opcional

### Como funciona

- Campo `token_publico` (UUID ou hash criptográfico), único, indexado.
- Flag `compartilhamento_ativo` (default `false`).
- Campo opcional `compartilhamento_expira_em` — quando preenchido, link deixa de funcionar após a data.
- URL exibida na tela para copiar:

  ```
  https://<frontend>/omni/documentos/publico/<token>
  ```

- Endpoint público (sem JWT):

  ```
  GET /api/documentos/publico/:token
  ```

- O frontend terá rota pública que consome esse endpoint; incluir a URL em `publicUrls` do `authInterceptor`.

### Regras de segurança

1. Só documentos com status **Ativo** são acessíveis via link público.
2. `compartilhamento_ativo = true` obrigatório.
3. Se `compartilhamento_expira_em` estiver preenchido e vencido → 403.
4. Regenerar token invalida o link anterior imediatamente.
5. Desativar compartilhamento revoga acesso imediato.
6. Rate limit no endpoint público (ex.: 60 req/min por IP).
7. Log de acesso público (IP, data, token — sem gravar conteúdo do arquivo).
8. Listagem e detalhe autenticados **nunca** retornam `dados_bytea`.

---

## Modelo de dados

### Tabela `tipos_documento`

| Campo | Tipo | Observação |
|-------|------|------------|
| `id` | uuid | PK (BaseEntity) |
| `nome` | varchar(150) | unique, obrigatório |
| `descricao` | text | opcional |
| `ativo` | boolean | default `true` |
| `criado_em` / `atualizado_em` | timestamp | BaseEntity |

### Tabela `documentos`

| Campo | Tipo | Observação |
|-------|------|------------|
| `id` | uuid | PK |
| `nome_documento` | varchar(300) | obrigatório |
| `tipo_documento_id` | uuid | FK → `tipos_documento` |
| `departamento_id` | uuid | FK → `departamentos` |
| `responsavel_id` | uuid | FK → `usuarios` |
| `status` | varchar(30) | enum (ver abaixo) |
| `nome_arquivo` | varchar(255) | nome original |
| `mime_type` | varchar(100) | |
| `tamanho` | bigint | bytes |
| `dados_bytea` | bytea | conteúdo (máx. 25 MB) |
| `compartilhamento_ativo` | boolean | default `false` |
| `token_publico` | varchar(64) | nullable, unique |
| `compartilhamento_expira_em` | timestamp | nullable (expiração opcional) |
| `compartilhamento_gerado_em` | timestamp | nullable |
| `criado_em` / `atualizado_em` | timestamp | BaseEntity |

### Enum `StatusDocumento`

```typescript
enum StatusDocumento {
  ATIVO = 'ATIVO',
  EM_REVISAO = 'EM_REVISAO',
  OBSOLETO = 'OBSOLETO',
  ARQUIVADO = 'ARQUIVADO',
}
```

### Índices sugeridos

- `documentos(departamento_id)`
- `documentos(tipo_documento_id)`
- `documentos(responsavel_id)`
- `documentos(status)`
- `documentos(token_publico)` — unique, partial where not null

### Tipos MIME permitidos (sugestão)

- `application/pdf`
- `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- `application/vnd.ms-excel`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- `image/png`, `image/jpeg`

---

## Regras de negócio (RN-*)

Registrar em `docs/regras-negocio.md` antes/durante implementação.

### RN-DOC-001 — Metadados obrigatórios

- **Descrição:** Nome do documento, tipo, departamento e responsável (usuário) são obrigatórios na criação.
- **Validações:** Tipo e departamento devem existir; usuário responsável deve existir e estar ativo.
- **Status:** Proposta

### RN-DOC-002 — Upload e limite de arquivo

- **Descrição:** Upload obrigatório na criação; substituição permitida na edição.
- **Validações:** Tamanho máximo **25 MB**; MIME types da lista permitida.
- **Mensagens:** Erro claro quando exceder limite ou tipo inválido.
- **Status:** Proposta

### RN-DOC-003 — Transição de status

- **Descrição:** Documento Obsoleto ou Arquivado não permite edição de metadados/arquivo (exceto reabrir para Em Revisão, se negócio permitir).
- **Status:** Proposta

### RN-DOC-004 — Exclusão

- **Descrição:** Exclusão física exige permissão `documento:delete`; preferir status Arquivado em vez de delete.
- **Status:** Proposta

### RN-DOC-005 — Link público

- **Descrição:** Link público só funciona para status **Ativo**, `compartilhamento_ativo = true` e token válido/não expirado.
- **Status:** Proposta

### RN-DOC-006 — Regeneração de token

- **Descrição:** Regenerar token invalida link anterior imediatamente; registrar em auditoria.
- **Status:** Proposta

### RN-DOC-007 — Responsável

- **Descrição:** Responsável é sempre um usuário do sistema (`usuarios.id`); exibir nome do usuário na listagem.
- **Status:** Proposta

### RN-DOC-008 — Auditoria

- **Descrição:** Auditar create/update/delete, substituição de arquivo e ativar/desativar/regenerar compartilhamento.
- **Status:** Proposta

---

## Permissões

Adicionar em `permission.enum.ts` (backend + frontend):

```
tipo_documento:create | read | update | delete
documento:create | read | update | delete | audit
documento:compartilhar
```

Menu sugerido: **Cadastros / Gerais** (Tipo de Documento + Documentos) ou grupo **Gestão Documental** se o volume crescer.

Alinhar: `menu.model.ts`, `route-permissions.ts`, seed de permissões em migration.

---

## API — contratos

### Tipo de Documento

| Método | Rota | Auth |
|--------|------|------|
| POST | `/tipos-documento` | JWT + `tipo_documento:create` |
| GET | `/tipos-documento` | JWT + `tipo_documento:read` |
| GET | `/tipos-documento/:id` | JWT + `tipo_documento:read` |
| PATCH | `/tipos-documento/:id` | JWT + `tipo_documento:update` |
| DELETE | `/tipos-documento/:id` | JWT + `tipo_documento:delete` (bloquear se houver documentos vinculados) |

### Documento

| Método | Rota | Auth |
|--------|------|------|
| POST | `/documentos` | JWT — multipart (metadados + arquivo) |
| GET | `/documentos` | JWT — filtros: nome, tipo, departamento, responsável, status |
| GET | `/documentos/:id` | JWT — metadados (sem bytea) |
| PATCH | `/documentos/:id` | JWT — metadados |
| PATCH | `/documentos/:id/arquivo` | JWT — substituir arquivo |
| GET | `/documentos/:id/arquivo` | JWT — stream/download |
| DELETE | `/documentos/:id` | JWT + `documento:delete` |
| POST | `/documentos/:id/compartilhamento/ativar` | JWT + `documento:compartilhar` |
| POST | `/documentos/:id/compartilhamento/desativar` | JWT + `documento:compartilhar` |
| POST | `/documentos/:id/compartilhamento/regenerar` | JWT + `documento:compartilhar` |
| GET | `/documentos/publico/:token` | **Sem JWT** — stream + metadados mínimos |

### DTOs principais

**CreateDocumentoDto** (multipart ou JSON + arquivo separado):

- `nomeDocumento` (string, required)
- `tipoDocumentoId` (uuid, required)
- `departamentoId` (uuid, required)
- `responsavelId` (uuid, required)
- `status` (enum, default `ATIVO`)
- `arquivo` (file, required na criação)

**AtivarCompartilhamentoDto** (opcional):

- `compartilhamentoExpiraEm` (ISO date, optional)

**Resposta listagem** (exemplo):

```json
{
  "id": "...",
  "nomeDocumento": "POP Segurança",
  "tipoDocumento": { "id": "...", "nome": "POP" },
  "departamento": { "id": "...", "nomeDepartamento": "RH" },
  "responsavel": { "id": "...", "nome": "Maria Silva" },
  "status": "ATIVO",
  "nomeArquivo": "pop-seguranca.pdf",
  "tamanho": 1048576,
  "compartilhamentoAtivo": true,
  "compartilhamentoExpiraEm": "2026-12-31T23:59:59.000Z",
  "linkPublico": "https://app.../documentos/publico/abc123..."
}
```

---

## Fases de implementação

### Fase 1 — Backend: Tipo de Documento

- [ ] Entity + migration `tipos_documento` (up/down reversível)
- [ ] Module `tipo-documento` (Controller → Service → Repository)
- [ ] DTOs + class-validator + Swagger
- [ ] Permissões + seed em migration
- [ ] Auditoria via `AuditoriaInterceptor`

**Referência:** módulo `departamento` / `origem-ocorrencia`.

### Fase 2 — Backend: Documento + arquivo

- [ ] Entity + migration `documentos` (FKs: tipo, departamento, responsável/usuario)
- [ ] Enum `StatusDocumento`
- [ ] Upload multipart (`FileInterceptor`, limite **25 MB**)
- [ ] Armazenamento `bytea` (padrão `IrregularidadeMidia`)
- [ ] Endpoints CRUD + download autenticado (`StreamableFile`)
- [ ] Validações RN-DOC-001 a RN-DOC-004 e RN-DOC-007

### Fase 3 — Backend: Compartilhamento público

- [ ] Campos de compartilhamento na migration
- [ ] Endpoints ativar (com expiração opcional) / desativar / regenerar
- [ ] `GET /documentos/publico/:token` sem `AuthGuard` (padrão `auth/password-reset`)
- [ ] Rate limit + log de acesso
- [ ] RN-DOC-005, RN-DOC-006, RN-DOC-008

### Fase 4 — Frontend: Tipo de Documento

- [ ] Model + service
- [ ] `tipo-documento-list` + `tipo-documento-form` (padrão `departamento-form`)
- [ ] Rotas + `RoutePermissions` + item em `menu.model.ts`
- [ ] Tema claro/escuro; estados hover/focus/disabled

### Fase 5 — Frontend: Documento

- [ ] Model + service (multipart no create/update arquivo)
- [ ] `documento-list` — filtros por tipo, departamento, responsável, status
- [ ] `documento-form`:
  - select/autocomplete tipo de documento
  - select/autocomplete departamento
  - select/autocomplete usuário responsável
  - upload arquivo (validação 25 MB no client)
  - select status
- [ ] Download autenticado; preview PDF inline (opcional)
- [ ] Seção compartilhamento: toggle, data expiração opcional, copiar link, regenerar

### Fase 6 — Frontend: Página pública

- [ ] Rota `/documentos/publico/:token` fora do layout autenticado
- [ ] Incluir endpoint público em `publicUrls` do `authInterceptor`
- [ ] Estados: loading, não encontrado, revogado, expirado, download

### Fase 7 — QA e documentação

- [ ] Registrar RN-DOC-* em `docs/regras-negocio.md` com status Implementada
- [ ] Testes manuais (checklist abaixo)
- [ ] Revisão de segurança do endpoint público

---

## Frontend — telas

### Lista de documentos

Colunas: Nome, Tipo, Departamento, Responsável, Status, Tamanho, Compartilhamento.

Filtros: texto, tipo, departamento, responsável, status.

Ações: editar, download, copiar link (se ativo e não expirado).

### Formulário

| Campo | Componente |
|-------|------------|
| Tipo de Documento | autocomplete (`GET /tipos-documento`) |
| Nome do Documento | input text |
| Departamento | autocomplete (`GET /departamentos`) |
| Responsável | autocomplete usuários (`GET /users` ou endpoint dedicado) |
| Status | select enum |
| Arquivo | input file (máx. 25 MB) |
| Compartilhamento | toggle + data expiração opcional + link readonly + Copiar / Regenerar |

---

## Critérios de aceite

1. CRUD Tipo de Documento com permissões e auditoria.
2. CRUD Documento com upload obrigatório (25 MB), responsável como usuário e download autenticado.
3. Status Obsoleto/Arquivado impede compartilhamento público.
4. Usuário com `documento:compartilhar` ativa link (com ou sem expiração), copia na UI e acessa em aba anônima sem login.
5. Desativar ou regenerar token invalida acesso imediato; link expirado retorna erro funcional claro.
6. UI funcional em tema claro e escuro (loading, vazio, erro).
7. Migration reversível; Swagger e models frontend alinhados ao contrato.

---

## Validação manual

1. Cadastrar tipo "POP"; criar documento com PDF ≤ 25 MB, departamento e usuário responsável.
2. Ativar compartilhamento sem expiração → copiar link → abrir em janela anônima → download ok.
3. Ativar com data de expiração no passado (ou aguardar) → link retorna erro.
4. Regenerar token → link antigo deixa de funcionar.
5. Alterar status para Obsoleto → link público bloqueado.
6. Usuário sem permissão não vê menu e recebe 403 na API.

---

## Riscos residuais

| Risco | Mitigação |
|-------|-----------|
| Vazamento via link público | Token opaco, revogação, expiração opcional, só status Ativo |
| Banco com PDFs até 25 MB | Limite rígido; evolução futura para object storage |
| Primeira rota pública de arquivo | Revisão de segurança na Fase 3 |
| Lista de usuários para responsável | Reutilizar endpoint existente de usuários com filtro ativo |

---

## Arquivos impactados (referência)

**Backend:** `backend/src/modules/tipo-documento/*`, `backend/src/modules/documento/*`, migrations, `permission.enum.ts`, `app.module.ts`.

**Frontend:** models, services, list/form components, `app.routes.ts`, `route-permissions.ts`, `menu.model.ts`, `auth.interceptor.ts`, página pública.

**Docs:** `docs/regras-negocio.md` (RN-DOC-*).

---

## Observações técnicas

- Padrão de arquivo binário: `bytea` (como `IrregularidadeMidia`), stream na resposta — nunca base64 em listagem.
- Túnel DEV: `https://api-dev.sistemasfarmamais.com/api`
- Túnel PROD: `https://api.sistemasfarmamais.com/api`
