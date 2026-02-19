# Plano: Status e Histórico de Ocorrências

## Objetivo

Implementar fluxo de status nas ocorrências (Registrada → Em Análise → Concluída), tabela de histórico de alterações, alteração de status pela lista de ocorrências (com permissão específica) e tela de Painel de Ocorrências no menu Gestão.

---

## 1. Status da Ocorrência

### 1.1 Valores do status

| Valor (enum)     | Label exibido   |
|------------------|-----------------|
| `REGISTRADA`     | Registrada      |
| `EM_ANALISE`     | Em Análise      |
| `CONCLUIDA`      | Concluída       |

### 1.2 Comportamento

- **Ao criar** uma ocorrência: o status é **Registrada** e deve ser criado **um registro na tabela de histórico** (registro inicial).
- **Alteração de status**: feita pela tela de listagem de ocorrências, via botão "Registrar andamento" na coluna Ações, com permissão específica.

---

## 2. Tabela de Histórico (historicoocorrencias)

Registra cada alteração de status (incluindo o registro inicial na criação).

### 2.1 Campos

| Campo           | Tipo        | Obrigatório | Descrição |
|----------------|-------------|-------------|-----------|
| `id`           | uuid        | Sim (PK)    | Identificador |
| `criadoEm`     | timestamp   | Sim         | Herdado BaseEntity |
| `atualizadoEm` | timestamp   | Sim         | Herdado BaseEntity |
| `idOcorrencia` | uuid        | Sim         | FK para `ocorrencias.id` |
| `statusAnterior` | varchar   | Não         | Status antes da alteração (null no primeiro registro) |
| `statusNovo`   | varchar     | Sim         | Status após a alteração |
| `dataAlteracao`| timestamp   | Sim         | Data/hora da alteração |
| `observacao`    | text        | Não         | Observação do usuário |
| `idUsuario`    | uuid        | Não         | FK para `usuarios.id` (quem alterou) |

### 2.2 Regras

- **Criação da ocorrência**: inserir um registro com `statusAnterior = null`, `statusNovo = 'REGISTRADA'`, `dataAlteracao = criadoEm da ocorrência`, `idUsuario` = usuário que criou (se disponível).
- **Mudança de status**: inserir novo registro com `statusAnterior` = status atual da ocorrência, `statusNovo` = novo status, `dataAlteracao = now()`, `observacao` e `idUsuario` preenchidos.

---

## 3. Backend

### 3.1 Enum

- **Arquivo**: `backend/src/common/enums/status-ocorrencia.enum.ts`
- **Conteúdo**: `REGISTRADA = 'Registrada'`, `EM_ANALISE = 'Em Análise'`, `CONCLUIDA = 'Concluída'`.

### 3.2 Entidade Ocorrencia

- **Arquivo**: `backend/src/modules/ocorrencia/entities/ocorrencia.entity.ts`
- **Alteração**: adicionar coluna `status` (enum `StatusOcorrencia`), default `REGISTRADA`.
- **Índice**: considerar índice em `status` para consultas do painel.

### 3.3 Entidade HistoricoOcorrencia

- **Arquivo**: `backend/src/modules/ocorrencia/entities/historico-ocorrencia.entity.ts`
- **Relacionamentos**: `ManyToOne` com `Ocorrencia` e `Usuario` (eager: false).
- **Índices**: `idOcorrencia`, eventualmente `dataAlteracao` para ordenação.

### 3.4 Migrations

- **Migration 1** (ex.: `1739330000000-add-status-ocorrencia.ts`):
  - Criar tipo enum no PostgreSQL para status da ocorrência (ou usar varchar se preferir compatibilidade).
  - Adicionar coluna `status` em `ocorrencias` com default `'REGISTRADA'`.
- **Migration 2** (ex.: `1739331000000-create-historico-ocorrencias.ts`):
  - Criar tabela `historicoocorrencias` com todos os campos e FKs para `ocorrencias` e `usuarios`.
- **Migration 3 (opcional)** – backfill: para ocorrências já existentes sem status, aplicar regra por ano da ocorrência **e criar os registros na tabela de histórico**:
  - **Ocorrências de 2025 e anteriores**: atualizar `status = 'CONCLUIDA'` e inserir **dois** registros no histórico:
    1. **Registro de abertura**: `statusAnterior = null`, `statusNovo = 'REGISTRADA'`, `dataAlteracao = dataHora` da ocorrência.
    2. **Registro de conclusão**: `statusAnterior = 'REGISTRADA'`, `statusNovo = 'CONCLUIDA'`, `dataAlteracao = dataHora` da ocorrência (mesma data para ambos os registros, evitando informações incorretas em relatórios futuros).
  - **Ocorrências de 2026**: atualizar `status = 'REGISTRADA'` e inserir **um** registro no histórico: `statusAnterior = null`, `statusNovo = 'REGISTRADA'`, `dataAlteracao = dataHora` da ocorrência.

### 3.5 OcorrenciaService

- **create**: após salvar a ocorrência, inserir registro em `historicoocorrencias` (status inicial Registrada, `idUsuario` quando disponível).
- **findAll**: incluir filtro opcional por `status` (string ou string[]) para o painel e listagem.
- **Novo método**: `updateStatus(idOcorrencia: string, statusNovo: StatusOcorrencia, observacao?: string, idUsuario?: string)`: atualizar `ocorrencia.status` e inserir registro no histórico.

### 3.6 Histórico – API

Endpoints no próprio `OcorrenciaController`:
- `GET /ocorrencias/:id/historico` – retorna lista de registros do histórico da ocorrência (ordenado por dataAlteracao desc).
- `PATCH /ocorrencias/:id/status` – body: `{ status: StatusOcorrencia, observacao?: string }` – altera status e grava histórico (usa usuário do token).

### 3.7 Permissão

- **Nova permissão**: `OCORRENCIA_UPDATE_STATUS = 'ocorrencia:update_status'` (ex.: "Registrar andamento da ocorrência").
- **Onde usar**: no endpoint `PATCH /ocorrencias/:id/status` e no guard do frontend para exibir o botão "Registrar andamento".
- **Arquivos**: `backend/src/common/enums/permission.enum.ts` e `PERMISSION_GROUPS` (grupo Ocorrências). No banco, adicionar a permissão aos perfis que devem ter acesso.

**Importante sobre registro do histórico:**

- **Criação de ocorrência** (`POST /ocorrencias`): o registro inicial no histórico (status REGISTRADA) é criado **automaticamente** no backend durante o processo de criação. Não requer permissão adicional além de `OCORRENCIA_CREATE`. O usuário que cria a ocorrência não precisa ter `OCORRENCIA_UPDATE_STATUS` para que o histórico inicial seja criado.

- **Alteração de status** (`PATCH /ocorrencias/:id/status`): requer a permissão `OCORRENCIA_UPDATE_STATUS`. Usuários sem essa permissão não conseguem alterar o status de ocorrências existentes, mas isso **não afeta** o registro inicial do histórico criado na criação da ocorrência.

**Resumo**: O registro inicial do histórico na criação é automático e não depende de `OCORRENCIA_UPDATE_STATUS`. Apenas alterações posteriores de status requerem essa permissão específica.

---

## 4. Frontend – Model e Serviço

### 4.1 Enum

- **Arquivo**: `frontend/src/app/models/status-ocorrencia.enum.ts`
- **Valores**: iguais ao backend (labels para exibição).

### 4.2 Model Ocorrencia

- **Arquivo**: `frontend/src/app/models/ocorrencia.model.ts`
- **Alteração**: adicionar propriedade opcional `status?: StatusOcorrencia`.

### 4.3 Model HistoricoOcorrencia

- **Arquivo**: `frontend/src/app/models/historico-ocorrencia.model.ts` (ou interface no mesmo arquivo de ocorrência)
- **Campos**: id, idOcorrencia, statusAnterior, statusNovo, dataAlteracao, observacao, idUsuario; opcionalmente usuario (nome) se o backend retornar.

### 4.4 OcorrenciaService

- **Métodos**:
  - `getHistorico(idOcorrencia: string): Observable<HistoricoOcorrencia[]>`
  - `updateStatus(idOcorrencia: string, status: StatusOcorrencia, observacao?: string): Observable<Ocorrencia>`
- **FindOcorrenciaDto / params**: incluir `status` (string ou string[]) para filtrar por status na listagem e no painel.

---

## 5. Frontend – Listagem de Ocorrências (ocorrencia-list)

### 5.1 Coluna Status

- Na tabela, exibir coluna **Status** com o valor atual da ocorrência (label do enum).

### 5.2 Botão "Registrar andamento"

- **Onde**: coluna **Ações**, ao lado de Editar / Excluir / Auditoria.
- **Visibilidade**: apenas se o usuário tiver permissão `OCORRENCIA_UPDATE_STATUS`.
- **Ação**: abrir modal com:
  - **Histórico da ocorrência**: lista (tabela ou cards) com data, status anterior → status novo, observação, usuário.
  - **Formulário para novo registro**: select com novo status (Registrada, Em Análise, Concluída), campo texto para observação, botão "Registrar".
- Ao registrar: chamar `updateStatus`, fechar o modal e atualizar a lista de ocorrências já com o novo status refletido.

### 5.3 Modal

- **Componente**: pode ser um componente reutilizável, ex.: `ocorrencia-status-modal` (ou nome similar), que recebe `ocorrencia` e emite evento de sucesso.
- **Título**: "Registrar andamento" + número ou id da ocorrência.

### 5.4 Campo Status no componente de listagem

- Adicionar o campo **Status** em `frontend/src/app/components/ocorrencia-list/ocorrencia-list.ts` (e na tabela do template correspondente), para que a coluna Status exiba o valor atual da ocorrência (label do enum).

---

## 6. Frontend – Painel de Ocorrências

### 6.1 Objetivo

Tela de acompanhamento no menu **Gestão**: um **resumo (painel)** de acordo com os filtros aplicados. O usuário aplica filtros (período, linha, tipo, origem, etc.) e visualiza indicadores agregados daquele conjunto de ocorrências.

**Exemplos de indicadores do painel:**
- **Totais por status**: quantidade de ocorrências Registradas, Em Análise e Concluídas (considerando apenas as que atendem aos filtros).
- **Tempo médio em dias**: do registro da ocorrência até o dia da conclusão (média, em dias, entre a data do primeiro registro no histórico com status REGISTRADA e a data do registro com status CONCLUIDA, apenas para ocorrências já concluídas no período/filtros).

### 6.2 Conteúdo da tela

- **Filtros**: período (data início/fim), linha, tipo/classificação, origem, etc. (reaproveitar DTO de listagem). O painel é recalculado conforme os filtros aplicados.
- **Resumo (cards ou blocos)**:
  - Totais de ocorrências por status (Registradas, Em Análise, Concluídas).
  - Tempo médio em dias do registro da ocorrência até a conclusão (para as concluídas no escopo dos filtros).
- **Lista ou tabela** (opcional): ocorrências filtradas, com link para edição ou "Registrar andamento", ou apenas exibir os totais/indicadores.

### 6.3 API do painel

- Endpoint **stats** para o painel (ex.: `GET /ocorrencias/stats?dataInicio=&dataFim=&linha=&...`) retornando, conforme os filtros aplicados:
  - **Totais por status**: `{ registrada: number, emAnalise: number, concluida: number }`.
  - **Tempo médio em dias** (do registro até a conclusão): para ocorrências concluídas no escopo, calcular a média em dias entre a data do primeiro registro no histórico com status REGISTRADA e a data do registro com status CONCLUIDA; retornar ex.: `tempoMedioConclusaoDias: number` (ou null se não houver concluídas).
- Na mesma tela, lista paginada opcional com os mesmos filtros (usando `findAll` existente).

### 6.4 Rota e menu

- **Rota**: ex.: `/ocorrencia/painel` ou `/painel-ocorrencias`.
- **Menu**: em **Gestão**, novo item "Painel de Ocorrências" com ícone (ex.: `feather-pie-chart` ou `feather-activity`), exigindo permissão `OCORRENCIA_READ` (ou uma permissão específica de painel, se desejar).
- **Arquivos**: `frontend/src/app/app.routes.ts`, `frontend/src/app/models/menu.model.ts`, componente `painel-ocorrencias` (pasta ex.: `components/painel-ocorrencias`).

---

## 7. Resumo de Arquivos

### Backend (criar ou alterar)

| Ação   | Arquivo |
|--------|---------|
| Criar  | `backend/src/common/enums/status-ocorrencia.enum.ts` |
| Criar  | `backend/src/modules/ocorrencia/entities/historico-ocorrencia.entity.ts` |
| Criar  | `backend/src/migrations/1739330000000-add-status-ocorrencia.ts` (nome/timestamp ajustável) |
| Criar  | `backend/src/migrations/1739331000000-create-historico-ocorrencias.ts` |
| Criar  | `backend/src/migrations/1739332000000-backfill-status-ocorrencia.ts` (opcional) |
| Alterar| `backend/src/modules/ocorrencia/entities/ocorrencia.entity.ts` (campo status) |
| Alterar| `backend/src/modules/ocorrencia/ocorrencia.service.ts` (create + histórico, findAll com status, updateStatus) |
| Alterar| `backend/src/modules/ocorrencia/ocorrencia.controller.ts` (GET :id/historico, PATCH :id/status; eventualmente GET stats) |
| Alterar| `backend/src/modules/ocorrencia/ocorrencia.module.ts` (registrar entidade HistoricoOcorrencia) |
| Alterar| `backend/src/common/enums/permission.enum.ts` (nova permissão + PERMISSION_GROUPS) |

### Frontend (criar ou alterar)

| Ação   | Arquivo |
|--------|---------|
| Criar  | `frontend/src/app/models/status-ocorrencia.enum.ts` |
| Criar  | `frontend/src/app/models/historico-ocorrencia.model.ts` (ou em ocorrencia.model) |
| Criar  | `frontend/src/app/components/ocorrencia-status-modal/*` (ts, html, css) |
| Criar  | `frontend/src/app/components/painel-ocorrencias/*` (ts, html, css) |
| Alterar| `frontend/src/app/models/ocorrencia.model.ts` (status, FindOcorrenciaDto com status) |
| Alterar| `frontend/src/app/models/usuario.model.ts` ou onde estiver Permission (nova permissão) |
| Alterar| `frontend/src/app/services/ocorrencia.service.ts` (getHistorico, updateStatus, filtro status) |
| Alterar| `frontend/src/app/components/ocorrencia-list/ocorrencia-list.ts` (botão, modal, coluna status) |
| Alterar| `frontend/src/app/components/ocorrencia-list/ocorrencia-list.html` (coluna status, botão, uso do modal) |
| Alterar| `frontend/src/app/app.routes.ts` (rota do painel) |
| Alterar| `frontend/src/app/models/menu.model.ts` (item Painel de Ocorrências em Gestão) |

---

## 8. Ordem sugerida de implementação

1. Backend: enum, entidade Ocorrencia (status), entidade HistoricoOcorrencia, migrations (status + tabela histórico + backfill se necessário).
2. Backend: OcorrenciaService (create com histórico, updateStatus, findAll com status) e OcorrenciaController (GET historico, PATCH status; stats se fizer sentido).
3. Backend: permissão `OCORRENCIA_UPDATE_STATUS` e registro em perfis.
4. Frontend: enum, models (Ocorrencia + HistoricoOcorrencia), OcorrenciaService (getHistorico, updateStatus, filtro status), permissão no frontend.
5. Frontend: coluna Status na lista, botão "Registrar andamento", modal de histórico + registro de novo status.
6. Frontend: componente Painel de Ocorrências, rota e item no menu Gestão; backend endpoint de stats se ainda não existir.

---

## 9. Pontos para revisão

- Nomes dos enums: `REGISTRADA` / `EM_ANALISE` / `CONCLUIDA` vs labels "Registrada", "Em Análise", "Concluída".
- Nome da tabela: `historicoocorrencias` ou `historico_ocorrencias` (seguir padrão do projeto).
- Permissão: apenas `OCORRENCIA_UPDATE_STATUS` para o botão ou também exigir `OCORRENCIA_READ` para ver a lista (normalmente já terá).
- Painel: só totais ou totais + lista paginada; quais filtros exatamente.
- Backfill: confirmado que `dataAlteracao` usará sempre `dataHora` da ocorrência para todos os registros históricos (abertura e conclusão), garantindo consistência nos relatórios.

Documento pronto para revisão. Após aprovação, a implementação pode seguir a ordem da seção 8.
