# Plano: Mapa de avaria no modelo do veículo

**Data:** 16/09/2026  
**Status:** Implementada  
**Objetivo:** Permitir identificar visualmente no desenho do veículo o local aproximado de batida, avaria ou quebra, gravar a marcação na irregularidade e exibi-la na operação, nos relatórios e no histórico.

**Escopo:** Backend (NestJS + PostgreSQL + migration), Frontend Web (Angular), App Mobile (Ionic), RN-VIS-009, impacto em RN-VIS-007 (PDF) e RN-VIS-004 (SOS).  
**Fora de escopo:** mapa 3D; GPS/perícia milimétrica; envio da coordenada ao ERP (RN-VIS-008); bloqueio por proximidade de círculos; fotos-base no cadastro de sintoma; quantidade fixa de 4 faces.

---

## Índice

1. [Contexto](#contexto)
2. [Decisões de produto](#decisões-de-produto)
3. [Regra de negócio (RN-VIS-009)](#regra-de-negócio-rn-vis-009)
4. [Critérios de aceite](#critérios-de-aceite)
5. [Modelo de dados](#modelo-de-dados)
6. [Permissões](#permissões)
7. [API e contratos](#api-e-contratos)
8. [Fluxos](#fluxos)
9. [UI/UX](#uiux)
10. [Relatórios](#relatórios)
11. [Impacto em consumidores](#impacto-em-consumidores)
12. [Riscos e mitigações](#riscos-e-mitigações)
13. [Tarefas técnicas](#tarefas-técnicas)
14. [Fases / sprints](#fases--sprints)
15. [Validação](#validação)
16. [Histórico](#histórico)

---

## Contexto

O vistoriador precisa indicar **onde** no veículo ocorreu batida, avaria ou quebra. Hoje a irregularidade tem área, componente, sintoma, descrição (RN-VIS-002) e foto-evidência (`irregularidades_midias`). Não há mapa visual.

A referência visual é uma silhueta do veículo (ex.: lado esquerdo de um ônibus) com **círculos vermelhos** sobrepostos no ponto aproximado. Vários círculos na mesma vista = várias irregularidades abertas naquele desenho.

Peças já existentes no OMNI:

- Modelo de veículo (`modelos_veiculo`) e vínculo `veiculos.idmodelo`.
- Áreas filtradas por modelo (`areas_modelos`); mobile só lista estrutura de veículos **com modelo**.
- Pendências informativas: `GET /vistoria/veiculo/:id/irregularidades-pendentes` (`resolvido = false`); **não bloqueia** novo registro.
- `resolvido = true` em `VALIDADA` e `CANCELADA`.
- Foto-evidência e PDF de pendências (RN-VIS-007).
- Compressão JPEG no web (`compressImageForUpload`, lado máx. 1024, qualidade ~0.6).

Não existe hotspot, vista de modelo nem coordenada na irregularidade.

---

## Decisões de produto

| Tema | Decisão |
|------|---------|
| Visual | Overlay de círculos na imagem-guia (não gravar o círculo no arquivo) |
| Fotos-base | Cadastro de **modelo de veículo** |
| Quantidade de vistas | **N** (não 4 fixas): item do catálogo + imagem |
| Local das imagens | Cadastro de **modelo de veículo** (não no sintoma) |
| Exemplos de vista | `Lado Esquerdo`, `Lado Esquerdo Reboque`, `Traseira`, `Frente` |
| Obrigatoriedade | Flag no **sintoma** (`exigeMarcacaoMapa`). Vale para qualquer componente que use o sintoma. **Não** entra na matriz |
| Matriz | Sem campo novo. Chip/coluna somente leitura herdado do sintoma (junto de “Exige foto”) |
| Marcação por irregularidade | **Uma** (uma vista + um toque). N irregularidades na mesma vista = N círculos |
| Precisão | Aproximação visual para vistoriador e manutenção; não perícia |
| Duplicidade | Mostrar círculos abertos na vista; **não bloquear** (igual pendentes atuais) |
| Overlay operacional | Mesmo veículo + mesma vista + `resolvido = false` |
| Overlay histórico | Todas as marcações da vista, inclusive resolvidas |
| Sumir da operação | `resolvido = true` (`VALIDADA`, `CANCELADA`). `CONCLUIDA` / `NAO_PROCEDE` **continuam visíveis** (ainda pendentes) |
| Troca da imagem da vista | Informar; **não bloquear**. Coordenadas % permanecem no mesmo `id_vista` |
| Excluir vista | Proibido se houver marcação; apenas **inativar** |
| Veículo sem modelo | Já tratado no mobile; fora deste plano |
| Modelo sem vistas + sintoma exige mapa | **Bloquear** save com mensagem clara (não pular o mapa) |
| Sintoma sem flag | Fluxo atual; mapa não aparece |
| Compactação | JPEG compactado (mesmo espírito da mídia / `compressImageForUpload`) |
| Zoom no mapa | Obrigatório: pinça 1x–4x, pan com zoom, botões +/−/1x; sem toque duplo |
| Área de edição | Viewport ocupa o espaço restante da tela (mesmo se a silhueta for baixa); zoom recortado **dentro** da caixa; textos/legenda **fora** do desenho |
| Tamanho do círculo | Proporcional à **altura da imagem** (~22%, 16–40px); **não cresce** com o zoom (counter-scale) |
| Pendentes no mapa | Botão Ver/Ocultar pendentes; círculos **azuis**; marca atual **vermelha** |
| Versão da imagem | Não versionar arquivo. Sem snapshot na irregularidade |
| ERP (RN-VIS-008) | Não envia coordenada nem vista |
| Permissão nova | Sim. Catálogo `vista_veiculo:*`. Concessão **manual** em Perfis; **não** via migration |
| Concessão de permissão | Manual em Perfis; **não** via migration |

---

## Regra de negócio (RN-VIS-009)

Fonte oficial após aprovação: `docs/regras-negocio.md` (status **Proposta** até implementar).

### RN-VIS-009 — Mapa de avaria no modelo do veículo

- **Módulo:** Vistoria
- **Fluxo:** Cadastro de modelo (vistas) → registro de irregularidade (mobile/SOS) → operação/relatório/histórico
- **Descrição:** Há um catálogo de vistas/partes. O modelo escolhe o item e anexa o JPEG. Sintomas com “exige marcação no mapa” obrigam o usuário a escolher uma vista e marcar um ponto percentual. A matriz pode restringir pelos IDs do catálogo. O círculo é overlay. Na operação aparecem só irregularidades não resolvidas; no histórico permanecem todas. Serve para localizar rapidamente o dano, não para perícia.
- **Condições de entrada:** Veículo com modelo (já exigido na vistoria mobile). Usuário autenticado com permissão da tela.
- **Validações:**
  - Vista: item do catálogo + imagem JPEG compactada obrigatórios na criação; único por modelo.
  - Sintoma com `exigeMarcacaoMapa = true`: `idVista` + `posXPct` + `posYPct` obrigatórios no create (mobile e SOS).
  - Vista deve pertencer ao **modelo do veículo** da vistoria.
  - Coordenadas em 0–100 (percentual da largura/altura da imagem).
  - Modelo sem vista ativa + sintoma que exige mapa: recusar com mensagem funcional.
  - Inativar vista permitida; excluir vista com marcação: recusar.
  - Troca de imagem: persistir e avisar; não recusar.
- **Ações do sistema:** persistir vistas no modelo; persistir uma marcação por irregularidade; overlay em tela e PDF; filtrar operacional por `resolvido = false`.
- **Mensagens ao usuário:**
  - Sem marcação quando obrigatória: “Marque o local da irregularidade no desenho do veículo.”
  - Modelo sem vistas: “Cadastre ao menos uma vista no modelo do veículo para sintomas que exigem localização.”
  - Troca de imagem: “As marcações já feitas permanecem na mesma posição percentual. Confira se o novo desenho está alinhado.”
  - Excluir vista com uso: “Não é possível excluir. Inative a vista. Há irregularidades marcadas neste desenho.”
- **Permissões envolvidas:** `vista_veiculo:create|update|read|delete` (catálogo, concessão manual); `modelo_veiculo:create|update|read|delete`; `sintoma:update`; leitura de vistas na vistoria com `vistoria_mobile:read` / `vistoria_web:read` / `irregularidade_tratamento:read` / `irregularidade_tratamento:create_sos`; PDF com `vistoria_web_historico_veiculo:read`.
- **Dados impactados:** `vistas_veiculo`; `modelo_veiculo_vistas`; `sintomas.exige_marcacao_mapa`; `matriz_criticidade.id_vistas`; `irregularidades.id_vista`, `pos_x_pct`, `pos_y_pct`.
- **Rastreabilidade:** auditoria padrão de create/update de modelo, sintoma e irregularidade. Marcação segue o histórico de status da irregularidade (não há tabela de eventos de toque).
- **Critérios de aceite:** ver seção abaixo.
- **Cenários de exceção:** reclassificação para sintoma que exige mapa sem marcação; vista inativa não listada para novo registro, mas reabre no histórico; SOS com o mesmo bloqueio do mobile.
- **Origem da regra:** Decisão de produto — mapa de avaria, 2026-09-16.
- **Status:** Implementada

**RN relacionadas**

- RN-VIS-002: descrição do problema permanece obrigatória (mapa não substitui).
- RN-VIS-003: permissões por tela do fluxo; detalhe da irregularidade passa a exibir o mapa.
- RN-VIS-004: SOS web aplica a mesma obrigatoriedade.
- RN-VIS-007: PDF de pendências passa a desenhar círculos das marcações abertas.
- RN-VIS-008: sem mudança de payload ERP.

---

## Critérios de aceite

Verificáveis:

1. **Cadastro de vistas:** catálogo de nomes; no modelo, o usuário escolhe o item, anexa JPEG compactado, define ordem, inativa e substitui imagem (com aviso, sem bloqueio). Vista com marcação não é excluída.
2. **Obrigatoriedade no sintoma:** flag ligado → qualquer componente que use o sintoma exige vista + toque (mobile e SOS). Flag desligado → mapa não aparece. Matriz não ganha campo editável; apenas indica o flag herdado.
3. **Overlay operacional:** na vista, círculos das irregularidades do veículo com `resolvido = false`; ao validar/cancelar, o círculo some da operação e permanece no histórico.
4. **Relatório:** PDF de pendências (RN-VIS-007) mostra, por vista, o desenho com os círculos ainda abertos.

**Validação esperada (manual, 3 passos)**

1. Cadastrar 3 vistas no modelo (ex.: Lado Esquerdo, Lado Esquerdo Reboque, Frente) e ligar o flag em um sintoma “Amassado”.
2. No app, registrar irregularidade nesse sintoma: escolher vista, ver círculos já abertos, marcar um ponto, salvar; conferir que sintoma sem flag não pede mapa.
3. Validar a irregularidade: círculo some na vistoria seguinte / mapa operacional; permanece no histórico e some do PDF de pendências.

**UI (cadastro web):** tema claro e escuro; hover, focus e disabled em botões de adicionar/remover/inativar vista e no flag do sintoma; estados vazio, loading e erro no upload.

---

## Modelo de dados

Migration reversível (`up`/`down`), snake_case, sem carga massiva, **sem** alterar `perfil.permissoes`.

### `vistas_veiculo` (catálogo)

| Coluna | Tipo | Regra |
|--------|------|--------|
| `id` | uuid PK | BaseEntity |
| `descricao` | varchar(80) | única (case-insensitive) |
| `ativo` | boolean | default true |
| `ordem` | integer | default 0 |

### `modelo_veiculo_vistas` (nova)

| Coluna | Tipo | Regra |
|--------|------|--------|
| `id` | uuid PK | BaseEntity |
| `criado_em` / `atualizado_em` | timestamp | BaseEntity |
| `idmodelo` | uuid FK → `modelos_veiculo` | `ON DELETE RESTRICT` |
| `id_catalogo` | uuid FK → `vistas_veiculo` | `ON DELETE RESTRICT`; único com `idmodelo` |
| `descricao` | varchar(80) | cópia do catálogo (rótulo) |
| `ordem` | integer | default 0; listagem ASC |
| `mime_type` | varchar(100) | `image/jpeg` |
| `nome_arquivo` | varchar(255) | |
| `tamanho` | bigint | bytes após compactar |
| `dados_bytea` | bytea | JPEG compactado |
| `ativo` | boolean | default true |

Índices: `IDX_MODELO_VEICULO_VISTA_MODELO` (`idmodelo`); único `(idmodelo, id_catalogo)`.

### `sintomas` (alterar)

| Coluna | Tipo | Regra |
|--------|------|--------|
| `exige_marcacao_mapa` | boolean | NOT NULL, default `false` |

### `irregularidades` (alterar)

| Coluna | Tipo | Regra |
|--------|------|--------|
| `id_vista` | uuid NULL FK → `modelo_veiculo_vistas` | `ON DELETE RESTRICT` |
| `pos_x_pct` | numeric(6,3) NULL | 0–100 |
| `pos_y_pct` | numeric(6,3) NULL | 0–100 |

Check sugerido: os três campos vêm juntos (todos nulos **ou** todos preenchidos).  
Raio do círculo: constante de UI (não persistir na v1).

**Não persistir:** círculo rasterizado; versão da imagem; múltiplos pontos por irregularidade.

---

## Permissões

Catálogo: chaves novas `vista_veiculo:*`. Concessão a perfis: **manual**.

| Ação | Permissão |
|------|-----------|
| CRUD catálogo de vistas | `vista_veiculo:create` / `:read` / `:update` / `:delete` |
| CRUD JPEG no modelo | `modelo_veiculo:vistas` (concessão manual) |
| Flag no sintoma | `sintoma:update` |
| Listar vistas + imagem na vistoria | `vistoria_mobile:read` **ou** `modelo_veiculo:read` **ou** `vistoria_web:read` **ou** `irregularidade_tratamento:read` **ou** `irregularidade_tratamento:create_sos` |
| Gravar marcação | mesmas permissões atuais de create/update de irregularidade |
| PDF com círculos | `vistoria_web_historico_veiculo:read` |

---

## API e contratos

Swagger + DTO + `class-validator`. Tipos de retorno explícitos. Compactar JPEG no **cliente** antes do upload; backend recusa não-JPEG ou arquivo vazio.

### Vistas do modelo

Listagens de cadastro **não** devolvem `dados_bytea` (payload). Imagem em endpoint dedicado.

| Método | Rota | Permissão | Contrato |
|--------|------|-----------|----------|
| `GET` | `/vistas-veiculo` | catálogo / modelo / matriz | lista `{ id, descricao, ativo, ordem }` |
| `GET` | `/modelos-veiculo/:id/vistas` | leitura combinada (acima) | lista metadados: `id`, `idCatalogo`, `descricao`, `ordem`, `ativo`, `mimeType`, `tamanho`, `atualizadoEm` |
| `GET` | `/modelos-veiculo/:id/vistas/:vistaId/imagem` | idem | `image/jpeg` (stream) |
| `POST` | `/modelos-veiculo/:id/vistas` | `modelo_veiculo:vistas` | multipart: `idCatalogo`, `ordem?`, `file` |
| `PATCH` | `/modelos-veiculo/:id/vistas/:vistaId` | `modelo_veiculo:vistas` | `ordem`, `ativo` e/ou multipart `file` (troca de imagem → aviso no cliente) |
| `DELETE` | `/modelos-veiculo/:id/vistas/:vistaId` | `modelo_veiculo:vistas` | 204 se sem marcação; **409** se houver irregularidade com `id_vista` |

`GET /modelos-veiculo/:id` no cadastro web pode incluir `vistas[]` **sem** bytea.

### Sintoma

- `CreateSintomaDto` / `UpdateSintomaDto` / resposta: `exigeMarcacaoMapa?: boolean` (default false).
- `GET /sintomas` e matriz por componente: incluir o flag (matriz **não** persiste cópia).

### Irregularidade

`CreateIrregularidadeDto` (mobile e SOS):

```ts
idVista?: string;      // uuid, obrigatório se sintoma.exigeMarcacaoMapa
posXPct?: number;      // 0–100
posYPct?: number;      // 0–100
```

Validação no service (não só no DTO): se o sintoma exige mapa, os três campos são obrigatórios; `idVista` ativa e do modelo do veículo da vistoria.

Respostas (`IrregularidadeResumoDto`, detalhe, pendentes, histórico):

```ts
marcacao?: {
  idVista: string;
  descricaoVista: string;
  posXPct: number;
  posYPct: number;
} | null;
exigeMarcacaoMapa?: boolean; // do sintoma, para a UI
```

### Overlay de uma vista (novo)

`GET /vistoria/veiculo/:idVeiculo/vistas/:idVista/marcacoes?somenteAbertas=true`

- `somenteAbertas=true` (padrão operacional): `resolvido = false`.
- `somenteAbertas=false`: histórico.
- Itens: `idIrregularidade`, `numeroIrregularidade`, `idsintoma`, `descricaoSintoma`, `statusAtual`, `resolvido`, `posXPct`, `posYPct`.
- Não devolver a imagem neste endpoint (já tem o GET de imagem).

### Reclassificação (RN-VIS-001)

Se o sintoma **destino** exige mapa e a irregularidade **não** tem marcação completa: `422` “Marque o local no desenho do veículo.”  
UI de reclassificar (web): passo extra de mapa quando o destino exigir.  
Se o destino **não** exige: não apagar marcação existente (histórico visual).

### Contratos que não mudam

- Payload ERP (RN-VIS-008).
- `exige_foto` / `permite_audio` da matriz.
- Pendentes atuais continuam informativos; overlay é complemento visual.

**Breaking change?** Campos novos opcionais na criação. App/web antigos **quebram** só para sintomas com flag ligado (backend passa a exigir marcação). Coordenar deploy: backend primeiro com flag default `false`; ligar sintomas depois que mobile/web estiverem publicados.

---

## Fluxos

### Cadastro de modelo (web)

1. Form atual (nome, ativo) permanece.
2. Seção **Vistas do veículo**: lista ordenável.
3. Adicionar: escolher vista do catálogo + upload (preview, compactar, JPEG).
4. Substituir imagem: dialog de aviso → grava no mesmo `id`.
5. Inativar: some das listas operacionais.
6. Excluir: só se zero marcações.

### Cadastro de sintoma (web)

Checkbox **Exige marcação no mapa do veículo** (default desligado). Texto de ajuda: vale para todos os componentes que usarem este sintoma.

### Matriz (web)

Quando o sintoma **exige mapa**, a matriz lista o catálogo de vistas para marcar quais valem. Nenhuma marcada = o app mostra todas as vistas do modelo do veículo. Coluna **Exige mapa** continua herdada do sintoma.

### Vistoria mobile

1. Área → componente → sintoma (igual hoje).
2. Se o sintoma **não** exige mapa: tela atual (descrição, foto, áudio).
3. Se **exige**:
   - A tela do sintoma abre direto (descrição, foto, áudio).
   - Abaixo do áudio aparece o bloco **Local no veículo**.
   - Toque em **Definir local** abre o mapa em tela cheia (vistas ativas **filtradas pela matriz**, overlay de pendentes, zoom do protótipo).
   - Se a matriz não marcou nenhuma vista, aparecem todas as vistas do modelo.
   - **Confirmar local** volta ao sintoma; **Voltar** descarta o toque não confirmado.
   - Sem marcação, o save é bloqueado e o mapa abre de novo.
4. Salvar envia `idVista`, `posXPct`, `posYPct`.
5. Editar irregularidade da vistoria atual: permite reposicionar se o sintoma exigir.

Toque: `xPct = (clientX - rect.left) / rect.width * 100` (idem Y) sobre o overlay da **imagem** (o `getBoundingClientRect` já considera o zoom). Círculo proporcional à altura da imagem; counter-scale para não crescer no zoom.

### SOS web (RN-VIS-004)

Mesma regra após escolher o sintoma. Componente de mapa reutilizável (web). Sem marcação + flag ligado → não inclui na lista “salvas” / bloqueia gravar.

### Detalhe no fluxo (Tratamento / Manutenção / Validação)

Exibir a vista + círculo da irregularidade (e opcionalmente os outros abertos da mesma vista, com destaque no item atual).

---

## UI/UX

### Web — modelo e sintoma

- Tokens de tema; sem cor hardcoded no chrome da tela.
- Círculo do mapa: vermelho com contraste nos dois temas (pode ser token `--mapa-avaria-marcacao` se não houver equivalente).
- Upload: loading, preview, erro de tipo/tamanho, disabled enquanto envia.
- Lista de vistas vazia: CTA “Adicionar vista”.
- Focus visível em inputs, botões e área clicável do mapa (SOS).

### Mobile

- Lista de vistas com nome + miniatura.
- Mapa: **zoom obrigatório** (pinça 1x–4x, pan com 1 dedo quando ampliado, botões +/−/1x). Sem toque duplo para zoom (conflita com a marcação).
- Viewport flexível até o rodapé; chrome (hint, botões, status, legenda) **acima** do mapa, nunca sobreposto ao desenho.
- Zoom isolado com `overflow: hidden` na caixa (não vaza para o texto).
- Círculo: tamanho base pela altura da imagem. A marca **Nova** (vermelha) cresce com o zoom, mantendo a proporção da altura. Pendentes (azuis) permanecem com tamanho estável na tela (counter-scale).
- Pendentes: Ver/Ocultar; azul. Marca atual: vermelho.
- Acessibilidade: não depender só da cor; círculo com borda e rótulo (Nova / P1).
- Estados: loading da imagem, vazio (sem vistas), erro de rede, disabled no salvar até marcar.

### Aprendizados do protótipo (`/prototipo/mapa-avaria`)

Validado em dispositivo (articulado/silhueta larga):

1. Pinça + botões +/−/1x são usáveis; toque duplo **não** deve zoomar.
2. Sem viewport alto, `transform: scale` corta o ônibus numa faixa e cobre a legenda — a caixa de edição precisa preencher a tela e recortar o zoom.
3. Pendentes em tamanho estável na tela (derivado da altura da imagem). Marca Nova cresce com o zoom, na mesma proporção da altura do desenho.
4. Pendentes em azul + toggle Ver/Ocultar distinguem da marca nova (vermelha) sem depender só da posição.

### Overlay operacional vs histórico

| Contexto | Círculos |
|----------|----------|
| Novo registro / vistoria | Só `resolvido = false` |
| PDF pendências | Só `resolvido = false` |
| Histórico do veículo / detalhe de item resolvido | Todas; resolvidas com estilo distinto (ex. cinza ou tracejado) |

---

## Relatórios

### RN-VIS-007 — PDF de pendências

Primeira página: até 4 vistas na ordem do catálogo. Vistas altas lado a lado; laterais em largura total com recorte da margem branca do JPEG. Círculo azul com índice **global do veículo**; legenda em uma linha `OS: 1:202637, 2:202639 e 3:202689`. Se o modelo tiver mais de 4 vistas, as seguintes ocupam as páginas seguintes. Depois vem a lista de pendências (fotos-evidência).

PDFKit: imagem + círculo nas coordenadas percentuais. Vista sem marcação aberta ainda aparece no mapa (veículo completo). Sem vistas cadastradas: comportamento atual (só a lista).

### Relatório de manutenção / e-mail

O PDF de preview e o anexo de e-mail reutilizam o helper de overlay: se a irregularidade tiver local (`id_vista` + % ), o card mostra a vista do modelo e um círculo azul no ponto. Sem marcação, permanece só as fotos-evidência.

### Histórico PDF “com resolvidas”

Fora da v1. Tela de histórico no app/web com `somenteAbertas=false` cobre o requisito “ficar somente para histórico”.

---

## Impacto em consumidores

| Consumidor | Impacto |
|------------|---------|
| Mobile vistoria | Novo passo + campos no POST; ler flag do sintoma e vistas do modelo |
| SOS web | Mesmo contrato; componente de mapa |
| Frontend cadastro modelo/sintoma/matriz | Formulários e listagens |
| Fluxo irregularidades (3 telas) | Exibir mapa no detalhe |
| PDF pendências | Helper de overlay |
| App antigo | Quebra só após ligar o flag em sintomas |
| ERP | Nenhum |

---

## Riscos e mitigações

| Risco | Mitigação |
|-------|-----------|
| Troca da silhueta desalinha círculos | Aviso; não bloquear; orientar a usar o mesmo enquadramento |
| Bytea de várias vistas | Poucos modelos; JPEG compactado; GET de listagem sem bytea |
| Sintoma espacial usado em item sem desenho adequado | Operação cadastra vista extra (ex. Interior); não ir para a matriz |
| Modelo sem vistas e flag ligado | 422 + mensagem; não finalizar SOS/vistoria com esse sintoma |
| Deploy desencontrado | Flag default `false`; ligar sintomas depois do app |
| Toque impreciso em modelo grande | Zoom obrigatório 1x–4x (pinça, pan, botões); coordenadas em % independem do zoom |
| Excluir modelo/vista | FK RESTRICT; inativar vista |
| Performance overlay | Endpoint por vista; poucos pontos por veículo |

---

## Tarefas técnicas

### BT1 — Migration e entidades

- Tabela `modelo_veiculo_vistas`.
- Colunas em `sintomas` e `irregularidades` + check de tríade.
- `down` reversível.
- **Não** popular vistas nem ligar flags.

### BT2 — Backend modelo

- Entity, DTOs, service, rotas de vistas + stream da imagem.
- Compactação/validação MIME no servidor (recusar não-JPEG).
- 409 ao deletar vista em uso; PATCH `ativo`.

### BT3 — Backend sintoma e matriz

- Persistir `exigeMarcacaoMapa`.
- Listagens de matriz/sintoma devolvem o flag; sem coluna nova na matriz.

### BT4 — Backend irregularidade

- Create/update/SOS: validar tríade vs sintoma e vs modelo do veículo.
- Resumos com `marcacao`.
- `GET .../vistas/:idVista/marcacoes`.
- Reclassificar: 422 se destino exige e não há marcação.
- Helper PDF: imagem + círculos (RN-VIS-007).

### BT5 — Web cadastro

- Form modelo: CRUD de vistas, preview, compactar, aviso de troca, inativar, tema claro/escuro.
- Form/lista sintoma: checkbox.
- Lista/form matriz: chip somente leitura.

### BT6 — Mobile

- Passo de mapa se o flag estiver ligado.
- Overlay de abertas; um toque; envio no POST.
- Erro se não houver vista.

### BT7 — SOS e fluxo web

- Mapa no modal SOS.
- Detalhe nas filas Tratamento / Manutenção / Validação.
- Reclassificar com mapa se o destino exigir.

### BT8 — Testes

- Unitário: tríade obrigatória / proibida; vista de outro modelo; delete com uso.
- Integração: create irregularidade com e sem flag; overlay `resolvido`; PDF com círculo.
- Manual: 3 passos da seção de aceite; tema claro/escuro no cadastro.

### BT9 — Documentação na implementação

- Status RN-VIS-009 → Implementada.
- Atualizar `docs/MER_VISTORIA.md`.
- Changelog em `regras-negocio.md`.

---

## Fases / sprints

### Sprint 1 — Fundação

BT1–BT3 + cadastro web de vistas e flag do sintoma. Nenhum sintoma ligado em produção.  
**Aceite parcial:** cadastrar N vistas, trocar imagem com aviso, inativar, recusar delete com uso (teste com FK manual se ainda não houver marcação na UI).

### Sprint 2 — Registro

BT4 (API de marcação) + BT6 (mobile) + SOS (parte de BT7).  
**Aceite:** fluxo ponta a ponta no app com overlay de abertas.

### Sprint 3 — Operação e relatório

Detalhe nas 3 telas, reclassificação, PDF RN-VIS-007, testes BT8, RN implementada.  
**Aceite:** critérios 3 e 4.

**Ordem de publicação:** API (flag false) → web cadastro → mobile/SOS → ligar sintomas de batida/avaria/quebra.

---

## Validação

### Manual (QA)

1. Modelo com 3 vistas; compactação JPEG visível (tamanho).
2. Sintoma com flag: mobile e SOS exigem toque; outro sintoma não mostra mapa.
3. Dois registros na mesma vista: dois círculos; validar um: resta um na operação; o validado aparece no histórico.
4. Trocar imagem: aviso; círculos no mesmo %.
5. Delete de vista usada: 409; inativar: some da lista de novo registro.
6. Cadastro web: tema claro e escuro; focus/hover/disabled; lista vazia.
7. PDF pendências: círculos só das abertas.

### Automatizado (mínimo na implementação)

- Service: exige mapa sem coordenadas → 400/422.
- Vista de outro modelo → 422.
- Overlay não retorna `VALIDADA`/`CANCELADA` quando `somenteAbertas=true`.

### Protótipo

Tela isolada (`/prototipo/mapa-avaria`) validou pinça, pan e viewport. Removida do app após a tela operacional **Local no veículo** absorver a mesma usabilidade.

---

## Histórico

- 2026-09-17: PDF de manutenção — vista do modelo com círculo quando a irregularidade tem local.
- 2026-09-17: PDF de pendências — recorte das laterais, numeração global por veículo, círculo azul.
- 2026-09-17: PDF de pendências — índice no círculo, legenda OS em uma linha, silhuetas baixas em largura total.
- 2026-09-17: PDF de pendências — primeira página com 4 vistas/partes (ordem do catálogo) e círculos das marcações.
- 2026-09-17: Pinça/pan do mapa operacional iguais ao protótipo; marca Nova escala com o zoom (proporção da altura); protótipo removido do app.
- 2026-09-17: Cadastro de sintoma lista modelos/vistas só como informação; restrição fica na matriz.
- 2026-09-17: Permissão `modelo_veiculo:vistas` para gravar JPEG no modelo; lista de modelos mostra vistas já cadastradas.
- 2026-09-17: Catálogo `vistas_veiculo`; modelo escolhe o cadastro + JPEG; matriz filtra por `id_vistas`.
- 2026-09-16: Matriz restringe vistas do mapa por descrição; vazio = todas no app.
- 2026-09-16: Mobile — mapa em tela cheia a partir do bloco Local (abaixo de foto/áudio), sem etapa antes do formulário do sintoma.
- 2026-09-16: Implementação ponta a ponta (API, cadastro web, mobile, SOS, fluxo, PDF). UX do protótipo reutilizada no mapa operacional.
- 2026-09-16: Plano absorve aprendizados do protótipo (viewport tela cheia, recorte do zoom, círculo pela altura da imagem, Ver/Ocultar pendentes em azul) e segue para implementação.
- 2026-09-16: Zoom do mapa passou a ser obrigatório (modelos articulados/grandes). Protótipo mobile com pinça, pan e +/−/1x.
- 2026-09-16: Plano inicial. Vistas N no modelo; flag no sintoma; overlay percentual; aviso na troca de imagem; JPEG compactado; aproximação visual; RN-VIS-009 proposta.
