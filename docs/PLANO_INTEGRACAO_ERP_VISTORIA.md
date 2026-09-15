# Plano: Integracao ERP de Vistoria (legado)

**Data:** 15/09/2026  
**Status:** Implementada  
**Objetivo:** Ao finalizar uma vistoria no OMNI com pelo menos uma irregularidade, registrar a **capa** no ERP legado de forma **assincrona**, gravar o numero de vistoria devolvido pelo ERP e permitir reenvio/envio em massa na tela **Vistorias**.

**Escopo:** Backend (NestJS), Frontend Web (Angular), migration, permissao nova no catalogo, RN-VIS-008.  
**Fora de escopo:** App mobile; tela de irregularidades; fotos/audios no ERP (ate o contrato pedir); bloquear `finalizar` se o legado estiver fora.

---

## Indice

1. [Contexto](#contexto)
2. [Decisoes de produto](#decisoes-de-produto)
3. [Contrato HTTP do legado](#contrato-http-do-legado)
4. [Regras de negocio (RN-VIS-008)](#regras-de-negocio-rn-vis-008)
5. [Modelo de dados](#modelo-de-dados)
6. [Permissoes](#permissoes)
7. [API e contratos (OMNI)](#api-e-contratos-omni)
8. [Fluxo tecnico](#fluxo-tecnico)
9. [UI — Configuracao](#ui--configuracao)
10. [UI — Tela Vistorias](#ui--tela-vistorias)
11. [Riscos](#riscos)
12. [Criterios de aceite](#criterios-de-aceite)
13. [Tarefas tecnicas](#tarefas-tecnicas)
14. [Validacao](#validacao)
15. [Historico](#historico)

---

## Contexto

O OMNI e a fonte operacional da vistoria (mobile e SOS). O ERP legado precisa da **capa** (`vistorias`) quando a inspecao e encerrada com achados.

Hoje:

- Status da vistoria: `EM_ANDAMENTO` | `FINALIZADA` | `CANCELADA` (nao existe "Concluida" na capa).
- Unico ponto que grava `FINALIZADA`: `POST /vistoria/:id/finalizar` (`VistoriaService.finalize`) — mobile e SOS.

Gatilho: vistoria `FINALIZADA` **e** pelo menos uma irregularidade **e** envio ao ERP **habilitado** na configuracao.

---

## Decisoes de produto

| Tema | Decisao |
|------|---------|
| Modelo | **B — assincrono**: `finalizar` responde na hora; ERP vai depois |
| Unidade | **Capa da vistoria** (1 registro OMNI = 1 registro ERP). Nao e por irregularidade |
| Numero ERP | Gravar `pedido.codigo_pedido` em `vistorias.erp_numero_vistoria` |
| Reenvio | Somente vistoria **sem** nr do ERP. Com nr (`ENVIADO`) **nao** reenvia |
| Config | Nova aba em Configuracao do Sistema, com **habilitar/desabilitar** o envio |
| Reprocessar | Tela **Fluxo Vistoria → Vistorias** (nao a fila de irregularidades) |
| Selecao | Checkbox no card + **envio em massa** das selecionadas elegiveis |
| Granularidade HTTP | `POST /api/v1/vistorias/lote` com array `vistorias` (1 item no automatico; N no envio em massa) |
| Worker | Sem Redis/Bull na v1: pos-`finalizar` em background + reenvio manual/massa |
| Permissao reenvio | Nova no catalogo; concessao **manual** em Perfis (sem migration de perfil) |

---

## Contrato HTTP do legado

Fonte: exemplo do desenvolvedor da API (POST lote), 2026-09-15.

### Endpoint

- **Metodo:** `POST`
- **Path:** `/api/v1/vistorias/lote`
- **Header:**
  - `Content-Type: application/json`
  - `X-Tenant` (ex.: `SISTEMA_VISTORIA`)
  - `X-API-Key` (token da integracao)
- **Auth:** obrigatoria. Tenant e API Key na aba Configuracao. GET da config **mascara** a API Key (mesmo padrao da senha SMTP).
- **Corpo:** objeto com array `vistorias` (lote). O OMNI envia 1 item ao finalizar e N itens no envio em massa.

### Headers (exemplo do desenvolvedor)

```http
POST /api/v1/vistorias/lote
Content-Type: application/json
X-Tenant: SISTEMA_VISTORIA
X-API-Key: SEU_TOKEN
```

O worker monta esses headers a partir da config. Nao logar `X-API-Key`.

### Request (por item do array)

```json
{
  "vistorias": [
    {
      "veiculo": "5:1111",
      "data_vistoria": "2026-09-14T08:00:00",
      "local_abertura": 1,
      "tipo_pedido": 0,
      "condicao": 1,
      "motorista": "JOAO DA SILVA",
      "matricula_motorista": 12345,
      "vistoriador": "MARIA DE SOUZA",
      "odometro": 125430,
      "sintomas": ["CARROCERIA (INTERNA)-ADESIVOS/SELO CMTC-Danificado - (Hshsh)"]
    }
  ]
}
```

### Mapeamento OMNI → payload

| Campo ERP | Origem OMNI | Observacao |
|-----------|-------------|------------|
| `veiculo` | `veiculos.descricao` | Montar `{prefixo}:{descricao}`. Prefixo pelos **2 primeiros caracteres** da descricao (inteiro): **≥ 12 → `1:`**; **< 12 → `5:`**. Ex.: descricao `1111` → `5:1111`; descricao `1214` → `1:1214`. Se os 2 primeiros nao forem numericos, `FALHA` na capa |
| `data_vistoria` | `vistorias.datavistoria` | ISO sem timezone no exemplo (`YYYY-MM-DDTHH:mm:ss`) |
| `local_abertura` | config | Combo na aba: `0` Oficina, `1` Portaria (default `1`) |
| `tipo_pedido` | config | Combo na aba: `0` Entrada, `1` Saída (default `0`) |
| `condicao` | origem da vistoria | Mobile (`origem` nulo) → `1`; SOS (`SOS_WEB`) → `5` |
| `motorista` | `motoristas.nome` | Texto |
| `matricula_motorista` | `motoristas.matricula` | No OMNI e string; enviar number. Se nao for numerica, marcar `FALHA` na capa |
| `vistoriador` | `usuarios.nome` (`vistorias.idusuario`) | Texto |
| `odometro` | `vistorias.odometro` | Inteiro (truncar decimal se houver) |
| `sintomas` | cada irregularidade | `AREA-COMPONENTE-SINTOMA - (observacao)`. `observacao` = descricao do problema (RN-VIS-002). Se vazia, envia so `AREA-COMPONENTE-SINTOMA`. Lista; o gatilho OMNI so enfileira com ≥1 irregularidade |

Correlacao da resposta: usar `indice` (1-based, ordem do array enviado) para casar cada item OMNI.

### Campo `veiculo` (regra fechada)

Identificador = `veiculos.descricao` (trim). Prefixo **nao** vai na config.

1. Ler os **2 primeiros caracteres** da descricao.
2. Interpretar como inteiro (devem ser digitos).
3. Se o valor for **12 ou maior** → prefixo `1:`.
4. Se o valor for **menor que 12** → prefixo `5:`.
5. Enviar `{prefixo}:{descricao}` completa.

| Descricao OMNI | 2 primeiros | Prefixo | Payload `veiculo` |
|----------------|-------------|---------|-------------------|
| `1111` | 11 | `5:` | `5:1111` |
| `1214` | 12 | `1:` | `1:1214` |
| `1502` | 15 | `1:` | `1:1502` |
| `0501` | 5 | `5:` | `5:0501` |

Se a descricao tiver menos de 2 caracteres ou os 2 primeiros nao forem numericos: nao chama o ERP para aquele item; capa fica `FALHA` com mensagem funcional (ex.: "Descricao do veiculo invalida para o ERP").

### Response (sucesso)

Nr da vistoria no ERP = **`pedido.codigo_pedido`** (ex.: `123386252`). Gravar como string em `erp_numero_vistoria`.

```json
{
  "sucesso": true,
  "acao": "LOTE_PROCESSADO",
  "total_recebidas": 2,
  "total_processadas": 2,
  "total_cadastradas": 2,
  "total_com_erro": 0,
  "vistorias": [
    {
      "indice": 1,
      "sucesso": true,
      "acao": "VISTORIA_CADASTRADA",
      "pedido": {
        "codigo_empresa": 1,
        "codigo_pedido": 123386252,
        "veiculo": "5:1214",
        "quantidade_sintomas": 2
      }
    }
  ]
}
```

### Regras de interpretacao

- Item `sucesso: true` **e** `pedido.codigo_pedido` presente → `ENVIADO`.
- Item `sucesso: true` **sem** `codigo_pedido` → `FALHA` (mesma cadeia de mensagem: API → aba → `Erro ao gravar Vistoria no OMNI`).
- Item `sucesso: false` → `FALHA` com a mensagem resolvida na ordem:
  1. texto de erro do item/API, se vier preenchido;
  2. senao, `mensagemErroPadrao` da aba Configuracao, se preenchida;
  3. senao, `Erro ao gravar Vistoria no OMNI`.
- HTTP de rede/5xx no lote inteiro: todas as capas do POST ficam `FALHA` com a mesma cadeia de mensagens (sem texto da API → config → padrao).
- Lote misto (`total_com_erro` > 0): atualizar cada capa pelo `indice` (sucesso parcial).

---

## Regras de negocio (RN-VIS-008)

> Registrar tambem em `docs/regras-negocio.md` (status Proposta ate implementar).

### RN-VIS-008 — Integracao assincrona da capa da vistoria com ERP legado

- **Modulo:** Vistoria
- **Fluxo:** Finalizar vistoria (mobile/SOS) → fila ERP; reenvio na tela Vistorias
- **Descricao:** Com a integracao **habilitada**, ao finalizar vistoria com ≥1 irregularidade o OMNI enfileira a capa e chama `POST /api/v1/vistorias/lote`. O usuario nao espera o ERP. Sucesso grava `pedido.codigo_pedido` em `erp_numero_vistoria`. Falha persiste erro funcional na capa. Vistorias **sem** nr ERP podem ser (re)enviadas (unitario ou massa, um POST com array). Vistoria **com** nr ERP nao reenvia.
- **Condicoes de entrada:**
  - Enfileirar no `finalizar`: status passara a `FINALIZADA`; ≥1 irregularidade; flag **ativo** na config ERP; URL, `X-Tenant` e `X-API-Key` preenchidos
  - Reenviar: `FINALIZADA`; ≥1 irregularidade; `erp_numero_vistoria` nulo; integracao ativa; permissao de reenvio
- **Validacoes:**
  - Integracao desabilitada: nao enfileira no `finalizar`; botoes de envio desabilitados
  - Sem irregularidade: `NAO_APLICA`; nao chama ERP
  - Ja possui nr ERP: recusar reenvio (`422`)
  - `EM_ANDAMENTO` / `CANCELADA`: nao envia
  - Descricao do veiculo: 2 primeiros caracteres numericos; ≥12 → `1:{descricao}`; <12 → `5:{descricao}`; senao `FALHA`
- **Acoes do sistema:**
  - `finalizar` persiste `FINALIZADA` mesmo se o ERP falhar depois
  - Worker POST lote; por item: `PENDENTE` → `ENVIADO` (`codigo_pedido`) ou `FALHA` (erro)
  - Envio em massa: um POST com o array das selecionadas; sucesso parcial por `indice`
- **Mensagens ao usuario:**
  - Falha no card: mensagem da API, ou a da aba, ou `Erro ao gravar Vistoria no OMNI`
  - Lote: resumo (enviadas / falhas / ignoradas)
  - Integracao off: "Envio ao ERP desabilitado na configuracao do sistema"
- **Permissoes envolvidas:** `configuracao:access` (aba); `vistoria_web:read` (lista); `vistoria_web:reprocessar_erp` (enviar/reenviar)
- **Dados impactados:** `configuracoes.erp_vistoria_config`; `vistorias` (status ERP, nr, erro)
- **Rastreabilidade:** Auditoria de alteracao da config; log sanitizado request/response do worker
- **Criterios de aceite:** ver secao [Criterios de aceite](#criterios-de-aceite)
- **Cenarios de excecao:** ERP fora; config incompleta; resposta sem nr; lote misto
- **Origem da regra:** Decisao de produto — integracao capa ERP legado, 2026-09-15
- **Status:** Proposta

---

## Modelo de dados

### `configuracoes.erp_vistoria_config` (jsonb, nullable)

Mesmo padrao de `emailEnvioConfig`.

| Campo | Tipo | Uso |
|-------|------|-----|
| `ativo` | boolean | Habilita/desabilita envio automatico e botoes da tela |
| `url` | string | Base do legado (ex.: `http://10.6.48.159:8000`); path fixo `/api/v1/vistorias/lote` |
| `tenant` | string | Header `X-Tenant` (default `SISTEMA_VISTORIA`) |
| `apiKey` | string | Header `X-API-Key`; obrigatorio se `ativo`; mascarar no GET |
| `localAbertura` | number | `0` Oficina / `1` Portaria (combo na aba; default `1`) |
| `tipoPedido` | number | `0` Entrada / `1` Saída (combo na aba; default `0`) |
| `mensagemErroPadrao` | string (opcional) | Texto usado quando a API nao devolve erro. Vazio → `Erro ao gravar Vistoria no OMNI` |
| `timeoutMs` | number (opcional) | Default 30000 |

Migration reversivel: `ADD COLUMN erp_vistoria_config jsonb NULL`.

### `vistorias` (capa)

| Coluna | Tipo | Uso |
|--------|------|-----|
| `erp_status` | varchar(20) | `NAO_APLICA` \| `PENDENTE` \| `ENVIADO` \| `FALHA` |
| `erp_numero_vistoria` | varchar(50) nullable | `pedido.codigo_pedido` (chave de "ja enviado") |
| `erp_enviado_em` | timestamp nullable | Ultimo sucesso |
| `erp_ultimo_erro` | text nullable | Ultimo erro funcional |

Default `erp_status = NAO_APLICA`. Indice em `erp_status` e em `erp_numero_vistoria` (filtro/consulta).

**Elegivel para envio/reenvio:** `status = FINALIZADA` **e** `erp_numero_vistoria IS NULL` **e** existe ≥1 irregularidade.

---

## Permissoes

O acesso a **ver** a tela Vistorias continua com `vistoria_web:read`. Enviar ou reenviar ao ERP e uma **acao aparte**: exige permissao nova, criada no catalogo e atribuida manualmente em **Cadastro de Perfis**.

### Nova permissao — reenvio ao ERP

| Campo | Valor |
|-------|--------|
| Enum backend | `Permission.VISTORIA_WEB_REPROCESSAR_ERP` |
| Enum frontend | mesmo valor em `usuario.model.ts` |
| Chave | `vistoria_web:reprocessar_erp` |
| Grupo no cadastro de Perfis | **Vistoria Web** (junto de `vistoria_web:read`) |
| Label | Enviar / reenviar vistorias ao ERP |
| Concessao | **Manual** na tela de Perfis. Nao gravar em `perfil.permissoes` via migration |

Arquivos a alterar na implementacao:

- `backend/src/common/enums/permission.enum.ts` (enum + grupo `PERMISSION_GROUPS['Vistoria Web']`)
- `frontend/src/app/models/usuario.model.ts` (enum espelhado)

### Como a permissao se aplica

| Superficie | Sem a permissao | Com a permissao |
|------------|-----------------|-----------------|
| Lista Vistorias | Ve cards, nr OMNI, nr ERP e erro | Checkbox, barra de massa, botao Enviar ao ERP |
| Drawer | Sem botao de envio | Botao unitario Enviar ao ERP |
| `POST /vistoria/erp/enviar` | `403` | Processa lote |
| `finalizar` (app/SOS) | Enfileira se a integracao estiver ativa (fluxo automatico; nao exige esta permissao) | — |

Quem so tem `vistoria_web:read` **consulta** o status ERP, mas nao dispara envio.

Nao criar permissao nova para a aba de Configuracao: permanece `configuracao:access`.

---

## API e contratos (OMNI)

Endpoints novos/alterados (DTO + class-validator + Swagger):

| Metodo | Rota | Permissao | Comportamento |
|--------|------|-----------|---------------|
| GET/PUT | `/configuracao` (existente) | `configuracao:access` | Incluir `erpVistoriaConfig`; `apiKey` mascarada no GET |
| GET | `/vistoria` (existente) | `vistoria_web:read` | Expor `numeroVistoria`, `erpNumeroVistoria`, `erpStatus`, `erpUltimoErro` |
| POST | `/vistoria/erp/enviar` | `vistoria_web:reprocessar_erp` | Body `{ ids: uuid[] }` (1..N). Ignora nao elegiveis. Retorno por item |

Resposta de lote (exemplo):

```json
{
  "enviadas": 3,
  "falhas": 1,
  "ignoradas": 2,
  "itens": [
    { "id": "...", "resultado": "ENVIADO", "erpNumeroVistoria": "12345" },
    { "id": "...", "resultado": "FALHA", "erro": "Timeout ao conectar no ERP" },
    { "id": "...", "resultado": "IGNORADA", "erro": "Vistoria ja possui numero do ERP" }
  ]
}
```

`POST /vistoria/:id/finalizar`: contrato de resposta **inalterado** para o app. Apenas side-effect interno (enfileirar e POST lote com 1 item).

Contrato do legado: ver [Contrato HTTP do legado](#contrato-http-do-legado). Nr persistido = `pedido.codigo_pedido`.

---

## Fluxo tecnico

```
finalizar (HTTP)
  → save FINALIZADA
  → se ativo && tem irregularidade → erp_status=PENDENTE, limpa erro
  → return vistoria (app segue)
  → void worker.enviar(id)   // nao await

worker
  → se ja tem erp_numero_vistoria → no-op
  → POST {url}/api/v1/vistorias/lote
       headers: Content-Type, X-Tenant, X-API-Key
       body { vistorias: [...] }
  → por indice: codigo_pedido → ENVIADO; senao FALHA
  → erro HTTP/rede → FALHA em todos os itens do POST

tela Vistorias / lote
  → mesma regra de elegibilidade
  → um POST com o array; sucesso parcial por indice
```

Controller → Service → client HTTP dedicado (`ErpVistoriaIntegrationService`).

---

## UI — Configuracao

Tela **Configuracao do Sistema**: nova aba **Integracao ERP** (alem de Sistema e Envio de E-mail).

- Switch/checkbox **Habilitar envio ao ERP** (`ativo`)
- URL base
- Tenant (`X-Tenant`)
- API Key (`X-API-Key`, campo password)
- **Local de abertura** (`local_abertura`): combo `0 - Oficina` / `1 - Portaria` (default `1`)
- **Tipo de pedido** (`tipo_pedido`): combo `0 - Entrada` / `1 - Saída` (default `0`)
- **Mensagem de erro padrao** (textarea/input; usada se a API nao devolver erro)
- Timeout
- Estados hover/focus/disabled; tokens de tema (claro/escuro)
- Salvar no botao existente da tela
- Com `ativo` e URL/tenant/API Key incompletos: recusar salvar ou nao enfileirar, com mensagem funcional
- Desabilitado: nao enfileira no `finalizar`; tela Vistorias mostra envio desabilitado

---

## UI — Tela Vistorias

Lista atual (cards/linhas em `vistoria-list`). Em cada card:

- **Nr OMNI** (`numeroVistoria`)
- **Nr ERP** (`erp_numero_vistoria` ou "—")
- **Erro ERP** (`erp_ultimo_erro`; vazio se nao houver)
- **Checkbox** se elegivel (sem nr ERP, finalizada, com irregularidade) e usuario com permissao; senao disabled

Barra de acao (quando houver permissao):

- Selecionar visiveis elegiveis
- Contador de selecionadas
- **Enviar ao ERP** (massa): disabled se 0 selecionadas, loading, ou integracao off

Filtro opcional: status ERP (Todos / Pendente / Enviado / Falha / Nao aplica).

Drawer de detalhe: repetir nrs e erro; botao unitario **Enviar ao ERP** com as mesmas regras.

Nao esconder a lista se o lote falhar (mensagem no topo / por card).

---

## Riscos

| Risco | Mitigacao |
|-------|-----------|
| Descricao do veiculo sem 2 digitos iniciais | `FALHA` na capa; nao envia o item |
| Matricula nao numerica | `FALHA` na capa com mensagem funcional |
| Lote misto | Atualizar cada item pelo `indice` |
| `finalizar` duplicado | Idempotencia por `erp_numero_vistoria` |
| API Key na config | Mascarar GET; nunca logar `X-API-Key` |
| Envio com integracao off | Recusar no backend |
| Cores hardcoded na lista atual | Novos campos usam tokens; nao refatorar o grid inteiro sem necessidade |

---

## Criterios de aceite

1. Aba Configuracao: habilitar/desabilitar persiste; GET nao vaza a API Key em claro.
2. Integracao **off**: finalizar com irregularidade nao chama ERP; cards sem acao de envio (disabled + texto).
3. Integracao **on**: finalizar com ≥1 irregularidade → card `PENDENTE` e envio em background; app nao espera.
4. Finalizar **sem** irregularidade → `NAO_APLICA`; sem chamada.
5. Sucesso: grava **`pedido.codigo_pedido`** no card; status `ENVIADO`; checkbox/enviar disabled.
6. Falha: card mostra **erro** (API → mensagem da aba → `Erro ao gravar Vistoria no OMNI`); sem nr ERP; permite reenvio.
7. Card exibe nr OMNI, nr ERP e erro.
8. Selecao + envio em massa: so elegiveis; sucesso parcial; resumo ao usuario.
9. Com nr ERP: API recusa reenvio; UI nao marca/envia.
10. Tema claro/escuro; hover/focus/disabled nos controles novos.
11. Permissao `vistoria_web:reprocessar_erp` criada no catalogo (backend + frontend, grupo Vistoria Web); concessao so pela tela de Perfis.
12. Usuario sem essa permissao ve nrs/erro e recebe 403 no endpoint de envio.

---

## Tarefas tecnicas

1. Migration `vistorias` (colunas ERP) + `configuracoes.erp_vistoria_config` (`up`/`down`).
2. Enum/status ERP + `ErpVistoriaConfig` na entidade/DTOs de configuracao (`apiKey` mascarada).
3. Aba Integracao ERP no frontend de configuracao.
4. `ErpVistoriaIntegrationService`: montar `veiculo` pela descricao (prefixo `1:` ou `5:`); `POST /api/v1/vistorias/lote`; persistir `pedido.codigo_pedido`.
5. Hook no `finalize` (enfileirar + disparo async com array de 1).
6. `POST /vistoria/erp/enviar` (lote OMNI → um POST legado com N itens) + exposicao dos campos no GET da lista.
7. Tela Vistorias: nrs, erro, checkbox, barra de massa, filtro ERP.
8. Criar permissao `vistoria_web:reprocessar_erp` no enum/catalogo (backend `permission.enum.ts` + frontend `usuario.model.ts`), grupo **Vistoria Web**, label "Enviar / reenviar vistorias ao ERP". Nao conceder via migration.
9. Guardar `POST /vistoria/erp/enviar` e os controles de envio na tela com essa permissao.
10. Atualizar `docs/regras-negocio.md` (RN-VIS-008) para Aprovada/Implementada ao concluir.

---

## Validacao

1. Config: salvar ativo on/off; recarregar aba; GET nao devolve a API Key em claro.
2. Finalizar no app (e SOS) com e sem irregularidade, integracao on e off.
3. Forcar falha (URL invalida): card com erro; reenvio unitario e em massa.
4. Sucesso: `codigo_pedido` no card; segunda tentativa recusada.
5. Usuario sem permissao de reenvio: ve nrs/erro, nao envia (403 na API).
6. Apos marcar a permissao no perfil, checkbox e envio em massa ficam disponiveis.

---

## Historico

- 2026-09-15: Sintomas ERP `AREA-COMPONENTE-SINTOMA - (observacao)`; filtros na lista por numero da vistoria e codigo OMNI.
- 2026-09-15: Combos Local (`0` Oficina / `1` Portaria) e Tipo (`0` Entrada / `1` Saida); `condicao` 1=mobile / 5=SOS; sintomas `AREA-COMPONENTE-SINTOMA`; botao Enviar ao ERP compacto na barra.
- 2026-09-15: Implementacao RN-VIS-008 (migration, worker lote, aba Integracao ERP, tela Vistorias, permissao no catalogo).
- 2026-09-15: `local_abertura` e `tipo_pedido` na aba (default 1 e 0). Mensagem de erro padrao na aba; se vazia, `Erro ao gravar Vistoria no OMNI`.
- 2026-09-15: Campo `veiculo` = `1:` ou `5:` + descricao OMNI (2 primeiros caracteres ≥12 → `1:`; <12 → `5:`). Prefixo nao fica na config.
- 2026-09-15: Contrato HTTP do legado (`POST /api/v1/vistorias/lote`, array `vistorias`, nr = `pedido.codigo_pedido`).
- 2026-09-15: Inclusao da criacao da permissao `vistoria_web:reprocessar_erp` (catalogo Vistoria Web, concessao manual em Perfis).
- 2026-09-15: Plano inicial (modelo B, capa, config com flag, tela Vistorias com nr OMNI/ERP, erro e envio em massa).
