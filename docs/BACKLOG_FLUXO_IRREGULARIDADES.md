# Backlog - Fechamento do Fluxo de Irregularidades

## Visao geral

Objetivo: fechar o ciclo ponta a ponta de irregularidades do veiculo sem pacote de servico:

1. Registro de irregularidades (ja concluido)
2. Tratamento opcional (corrigir classificacao, se necessario)
3. Execucao da manutencao por irregularidade
4. Conclusao da manutencao
5. Validacao final da irregularidade

Status oficiais da irregularidade:
- `REGISTRADA`
- `RETRABALHO_GARANTIA` (retrabalho/garantia apos reprovacao na validacao final)
- `CANCELADA`
- `EM_MANUTENCAO`
- `NAO_PROCEDE`
- `CONCLUIDA`
- `VALIDADA`

Referencia funcional: **RN-VIS-006** (`docs/regras-negocio.md`) — integracao OS externa (dual: API BRT vs fluxo legado).

---

## Matriz de estados (fonte unica)

### Irregularidade — fluxo comum (sem API ou pos-envio API bem-sucedido)

| Estado atual | Acao | Proximo estado | Pre-condicao | Erro esperado |
| --- | --- | --- | --- | --- |
| `REGISTRADA` | Corrigir classificacao | `REGISTRADA` | Destino valido e autorizado | `422` destino invalido |
| `REGISTRADA` | Cancelar irregularidade | `CANCELADA` | Motivo obrigatorio | `400` motivo obrigatorio |
| `REGISTRADA` | Enviar para manutencao (sem API) | `EM_MANUTENCAO` | Empresa de manutencao definida; combustivel/area no escopo da empresa (allowlist) | `400` fora do escopo; `422` transicao invalida |
| `REGISTRADA` | Enviar para manutencao (com API) | `EM_MANUTENCAO` | Escopo combustivel/area OK; selecao completa da vistoria **no escopo da empresa** (OS fora do escopo podem ficar no Tratamento); ERP (se ativo) OK por veiculo; POST OS BRT OK ou duplicada (1 vistoria = 1 OS) | `400` fora do escopo; grupo permanece `REGISTRADA` + erro ERP/BRT; reenvio idempotente |
| `RETRABALHO_GARANTIA` | Corrigir classificacao | `RETRABALHO_GARANTIA` | Destino valido e autorizado | `422` destino invalido |
| `RETRABALHO_GARANTIA` | Cancelar irregularidade | `CANCELADA` | Motivo obrigatorio | `400` motivo obrigatorio |
| `RETRABALHO_GARANTIA` | Reenviar para manutencao | `EM_MANUTENCAO` | Grupo completo da vistoria; `os_orig` = `numeroVistoria-N` (N≥2); empresa BRT: `reg_pai` = `numOs` do grupo original; empresa configurada | Erro API: grupo permanece `RETRABALHO_GARANTIA` / `REGISTRADA` |
| `EM_MANUTENCAO` | Concluir manutencao (sem controle API) | `CONCLUIDA` | Evidencia minima quando obrigatoria | `422` pendencia |
| `EM_MANUTENCAO` | Concluir manutencao (controle API) | `CONCLUIDA` | Conclusao manual permitida; nao chama BRT; vinculos OS/ERP permanecem para rastreio | `400` status/empresa |
| `EM_MANUTENCAO` | Retorno BRT `Disponivel` (poll v2) | `CONCLUIDA` | OS ativa no grupo; match tolerante de `situacao`; 1× por ciclo | Idempotente se ja `CONCLUIDA` |
| `EM_MANUTENCAO` | Retorno ERP `concluida: true` (busca) | `CONCLUIDA` (+ `VALIDADA` se modo) | Empresa `NENHUMA` na allowlist; busca ativa; `erp_codigo_pedido` | Idempotente; off = zero GET |
| `EM_MANUTENCAO` | Marcar nao procede (sem controle API) | `NAO_PROCEDE` | Justificativa obrigatoria | `400` justificativa obrigatoria |
| `EM_MANUTENCAO` | Marcar nao procede (controle API) | — | **Bloqueado** (retorno integrado nao mapeia nao procede) | `400` bloqueio manual |
| `EM_MANUTENCAO` | Cancelar OS BRT (controle API) | `REGISTRADA` | POST cancelamento BRT OK; permissao `cancel_os_brt`; OS ativa; **grupo** da vistoria | Grupo permanece `EM_MANUTENCAO` + erro BRT |
| `EM_MANUTENCAO` | Retorno BRT `Cancelado` (poll v2) | `REGISTRADA` | OS ativa no grupo; match tolerante; limpa vinculos BRT ativos + `erp_*` | Idempotente se ja no Tratamento |
| `NAO_PROCEDE` | Reclassificar / cancelar / reenviar manutencao | `NAO_PROCEDE` / `CANCELADA` / `EM_MANUTENCAO` | Fila Tratamento; sem empresa vinculada | `400` motivo / empresa |
| `CONCLUIDA` | Validar final | `VALIDADA` | Conferencia aprovada | `422` pendencia |
| `CONCLUIDA` | Reprovar final | `RETRABALHO_GARANTIA` | Observacao obrigatoria | `400` observacao obrigatoria |

### Matriz de transicao final (permitido/proibido)

| De \ Para | REGISTRADA | RETRABALHO_GARANTIA | CANCELADA | EM_MANUTENCAO | NAO_PROCEDE | CONCLUIDA | VALIDADA |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `REGISTRADA` | Permitido (reclassificar) | Proibido | Permitido | Permitido | Proibido | Proibido | Proibido |
| `RETRABALHO_GARANTIA` | Proibido | Permitido (reclassificar) | Permitido | Permitido (reenvio) | Proibido | Proibido | Proibido |
| `CANCELADA` | Proibido | Proibido | Proibido | Proibido | Proibido | Proibido | Proibido |
| `EM_MANUTENCAO` | Proibido*** | Proibido | Proibido | Proibido | Permitido* | Permitido* | Proibido |
| `NAO_PROCEDE` | Proibido | Proibido | Permitido | Permitido (reenvio) | Permitido (reclassificar) | Proibido | Proibido |
| `CONCLUIDA` | Proibido | Permitido (reprovacao final) | Proibido | Proibido** | Proibido | Proibido | Permitido |
| `VALIDADA` | Proibido | Proibido | Proibido | Proibido | Proibido | Proibido | Proibido |

\* `NAO_PROCEDE`: somente trilha **sem** controle API. `CONCLUIDA`: permitido por conclusao manual **ou** retorno BRT `Disponivel` (poll v2).

\*\*\* Permitido para trilha API via cancelamento OS BRT (`tpo_reg: 7`) **ou** retorno BRT `Cancelado` (poll v2) (`EM_MANUTENCAO` → `REGISTRADA`).

\*\* Transicao historica `CONCLUIDA` → `EM_MANUTENCAO` na reprovacao **substituida** por `CONCLUIDA` → `RETRABALHO_GARANTIA` (RN-VIS-006). Codigo legado deve ser alinhado na implementacao.

### Integracao ERP + OS (BRT) — efeito no envio a partir de `REGISTRADA` / `RETRABALHO_GARANTIA`

Pipeline: ERP (flag global) → BRT (empresa API) → transicao. Atomico **por veiculo**.

| Resultado | Status OMNI | Tela |
| --- | --- | --- |
| ERP OK (ou off) + BRT `201`/`200` duplicada (ou sem BRT) | `EM_MANUTENCAO` | Manutencao |
| Falha ERP ou BRT | Inalterado (`REGISTRADA` ou `RETRABALHO_GARANTIA`); vinculo parcial persistido | Tratamento (detalhe do erro; reenvio so do lado faltante) |

---

## Epico 1 - Tratamento Opcional

### US1.1 - Listar irregularidades registradas

**Como** analista  
**Quero** ver irregularidades `REGISTRADA` com filtros  
**Para** corrigir rapidamente casos que exigem ajuste

**Criterios de aceite**
- Filtros por veiculo, data, area, componente, sintoma e status (cascata area → componente → sintoma na UI das 4 telas do fluxo).
- Ordenacao por mais antiga.
- Paginacao e totalizadores.
- Se nao houver ajuste, item segue fluxo normal para manutencao.

**Tarefas tecnicas**
- Criar enum oficial de status da irregularidade.
- Criar endpoint de listagem com filtros.
- Criar tela web "Fila de irregularidades registradas".

---

### US1.2 - Corrigir classificacao da irregularidade

**Como** analista  
**Quero** corrigir area/componente/sintoma de uma irregularidade  
**Para** manter o contexto tecnico correto antes da manutencao

**Criterios de aceite**
- Historico com antes/depois.
- Vinculo de origem/destino preservado.
- Irregularidade permanece `REGISTRADA`.

**Tarefas tecnicas**
- Endpoint `POST /irregularidades/:id/reclassificar`.
- Estrutura de rastreio (`idIrregularidadeOrigem`, `idIrregularidadeDestino`).
- Validar permissao e integridade dos IDs de destino.

---

### US1.3 - Cancelar irregularidade

**Como** analista  
**Quero** cancelar irregularidade quando for erro de inclusao ou nao procede  
**Para** retirar a pendencia do veiculo e manter apenas no historico

**Criterios de aceite**
- Transicao: `REGISTRADA -> CANCELADA`.
- Motivo obrigatorio.
- Irregularidade `CANCELADA` nao aparece mais como pendencia ativa do veiculo.
- Irregularidade `CANCELADA` nao aparece em telas operacionais.
- Registro historico obrigatorio da justificativa.

**Tarefas tecnicas**
- Endpoint `POST /irregularidades/:id/cancelar`.
- Persistir `motivoCancelamento`.
- Ajustar listagens para ocultar `CANCELADA` das filas operacionais.

---

## Epico 2 - Manutencao da Irregularidade

### US2.1 - Iniciar manutencao

**Como** operador  
**Quero** enviar irregularidade `REGISTRADA` para manutencao  
**Para** marcar formalmente que ela entrou em execucao

**Criterios de aceite**
- So aceita irregularidade `REGISTRADA`.
- Transicao: `REGISTRADA -> EM_MANUTENCAO` (acao de envio para manutencao).
- Envio exige empresa de manutencao informada.
- Apenas usuarios vinculados a empresa que recebeu a irregularidade podem visualizar/atuar.
- Registrar usuario e data/hora de inicio.

**Tarefas tecnicas**
- Endpoint `POST /irregularidades/:id/iniciar-manutencao`.
- Incluir campo de destino da manutencao na irregularidade (`idEmpresaManutencao`).
- Regras de bloqueio de transicao invalida em transacao.
- Garantir idempotencia por chave de requisicao (`Idempotency-Key`).

---

### US2.2 - Listar irregularidades em manutencao

**Como** operador  
**Quero** listar irregularidades `EM_MANUTENCAO`  
**Para** acompanhar o trabalho pendente

**Criterios de aceite**
- Filtro por veiculo, periodo, area, componente e sintoma.
- Exibir totais por status e idade da pendencia.
- Escopo restrito a irregularidades da empresa do usuario logado.

**Tarefas tecnicas**
- Endpoint `GET /irregularidades?status=EM_MANUTENCAO`.
- Tela web "Fila de manutencao".

---

### US2.3 - Concluir manutencao

**Como** operador  
**Quero** concluir a manutencao da irregularidade  
**Para** disponibilizar o item para validacao final

**Criterios de aceite**
- Transicao: `EM_MANUTENCAO -> CONCLUIDA`.
- Registrar usuario e data/hora da conclusao.
- Permitir observacao/evidencia opcional.

**Tarefas tecnicas**
- Endpoint `POST /irregularidades/:id/concluir-manutencao`.
- Persistir metadados de conclusao.

---

### US2.4 - Marcar irregularidade como nao procede

**Como** usuario da manutencao  
**Quero** marcar que a irregularidade nao foi encontrada  
**Para** devolver a irregularidade ao Tratamento com justificativa tecnica

**Criterios de aceite**
- Transicao: `EM_MANUTENCAO -> NAO_PROCEDE`.
- Justificativa tecnica obrigatoria.
- Registro de evidencias opcional.
- Item `NAO_PROCEDE` volta a fila Tratamento; limpa `idEmpresaManutencao` / ERP / BRT; historico registra a empresa que devolveu.

**Tarefas tecnicas**
- Endpoint `POST /irregularidades/:id/nao-procede`.
- Persistir `motivoNaoProcede` e metadados da acao.

---

### US2.5 - Cancelar OS na integracao BRT (Manutencao)

**Como** operador da manutencao  
**Quero** cancelar a OS aberta na BRT e devolver a irregularidade ao Tratamento  
**Para** corrigir encaminhamento indevido sem encerrar a irregularidade

**Criterios de aceite**
- Transicao: `EM_MANUTENCAO -> REGISTRADA` somente apos cancelamento OK na API BRT (`tpo_reg: 7`).
- Permissao dedicada `irregularidade_manutencao:cancel_os_brt`.
- Somente irregularidades com OS ativa na integracao (`controleIntegracaoApi`, `osOrigAtual`, `numOsExternoAtual`).
- Falha BRT (ex.: `409 os_em_execucao`): permanece `EM_MANUTENCAO`.
- Reenvio posterior usa novo `os_orig` com sufixo (`numeroIrregularidade-2`, `-3`, …).

**Tarefas tecnicas**
- Endpoint `POST /irregularidades/:id/cancelar-os-brt`.
- Botao na tela Manutencao com modal de justificativa.

---

## Epico 3 - Validacao Final

### US3.1 - Listar fila de validacao final

**Como** analista  
**Quero** listar irregularidades `CONCLUIDA`  
**Para** validar o resultado da manutencao

**Criterios de aceite**
- Filtros por veiculo, periodo e classificacao.
- Exibir contexto tecnico e evidencias da manutencao.

**Tarefas tecnicas**
- Endpoint `GET /irregularidades?status=CONCLUIDA`.
- Tela web "Fila de validacao final".

---

### US3.2 - Validar final irregularidade

**Como** analista  
**Quero** validar a manutencao concluida  
**Para** baixar definitivamente a pendencia do veiculo

**Criterios de aceite**
- Transicao: `CONCLUIDA -> VALIDADA`.
- Irregularidade `VALIDADA` nao aparece mais como pendencia.
- Registrar usuario, data/hora e observacao da validacao final.

**Tarefas tecnicas**
- Endpoint `POST /irregularidades/:id/validar-final`.
- Ajustar consultas de pendencia por veiculo.

---

### US3.3 - Reprovar validacao final

**Como** analista  
**Quero** reprovar na validacao final e devolver para retrabalho/garantia  
**Para** permitir novo envio para manutencao com registro de garantia (RN-VIS-006)

**Criterios de aceite**
- Transicao: `CONCLUIDA -> RETRABALHO_GARANTIA`.
- Transicao: `NAO_PROCEDE -> RETRABALHO_GARANTIA` (quando acao de reprovacao aplicavel).
- Observacao obrigatoria na reprovacao.
- Item listado na tela Tratamento; reenvio para manutencao gera novo `os_orig` na integracao OS.
- Historico com rastreabilidade completa.

**Tarefas tecnicas**
- Endpoint `POST /irregularidades/:id/reprovar-final`.
- Registrar observacao e evidencias de reprovacao.

---

## Backlog Tecnico Transversal

### BT1 - Modelagem e migrations
- Adicionar enum oficial de status em irregularidades: `REGISTRADA`, `CANCELADA`, `EM_MANUTENCAO`, `NAO_PROCEDE`, `CONCLUIDA`, `VALIDADA`.
- Criar campos de controle de manutencao e validacao final (inicio, conclusao, validacao).
- Incluir `idEmpresaManutencao` na irregularidade.
- Criar indices para filas por status e por veiculo.
- Criar constraints para impedir transicoes invalidas.
- Incluir `idEmpresa` no cadastro de usuario.

### BT1.1 - Historico de andamento (fonte de verdade temporal)
- Criar tabela `irregularidade_historico` (append-only) com: `idIrregularidade`, `statusOrigem`, `statusDestino`, `acao`, `idUsuario`, `idEmpresaEvento`, `dataEvento`, `observacao`, `correlationId`.
- Ao registrar a irregularidade, criar obrigatoriamente o primeiro evento historico (`statusDestino = REGISTRADA`).
- Toda transicao de status deve atualizar `irregularidades.statusAtual` e inserir registro no historico na mesma transacao.
- Proibir update/delete de eventos historicos (imutabilidade).
- Criar indices: (`idIrregularidade`, `dataEvento`) e (`statusDestino`, `dataEvento`).

### BT1.2 - Reincidencia e garantia (ponto principal)
- Criar regra de identificacao de reincidencia por chave tecnica: `veiculo + area + componente + sintoma`.
- Ao abrir nova irregularidade com chave tecnica ja finalizada no periodo de garantia, vincular com `idIrregularidadeOrigemReincidencia`.
- Persistir dados de garantia da execucao: `dataInicioGarantia`, `dataFimGarantia`, `statusGarantia` (quando aplicavel).
- Permitir consulta de cadeia de reincidencias por irregularidade e por veiculo.

### BT2 - Permissoes
- Criar permissoes novas:
  - `irregularidade_tratamento:read`
  - `irregularidade_tratamento:update`
  - `irregularidade_manutencao:read`
  - `irregularidade_manutencao:start`
  - `irregularidade_manutencao:finish`
  - `irregularidade_manutencao:mark_not_proceeding`
  - `irregularidade_validacao_final:read`
  - `irregularidade_validacao_final:update`
- Integrar com menu/guards no web.

### BT3 - Auditoria
- Logar toda transicao de estado da irregularidade.
- Logar reclassificacao, cancelamento, envio para manutencao, conclusao, nao procede, validacao final e reprovacao final.

### BT3.1 - Observabilidade e rastreabilidade
- Correlation ID por requisicao e propagacao entre backend/web.
- Metricas por transicao (sucesso, bloqueio por regra, erro tecnico).
- Dashboard operacional: tempo medio por etapa e backlog por status.
- KPI principal de ciclo: tempo de `REGISTRADA` ate (`CONCLUIDA` ou `NAO_PROCEDE`).
- KPI de validacao: quantas irregularidades foram `VALIDADA` x quantas voltaram por reprovacao final.
- Exclusoes de indicador operacional: `CANCELADA` nao entra em comparativos de manutencao por empresa.
- `NAO_PROCEDE` deve ser exibida em categoria separada nos indicadores.
- KPI de retrabalho: quantidade de retornos `CONCLUIDA -> EM_MANUTENCAO`.
- KPI de reincidencia: novas irregularidades vinculadas por garantia (reincidencia real).

### BT4 - Testes
- Unitarios: regras de transicao de estado.
- Integracao: inicio/conclusao de manutencao e validacao final.
- Integracao: escopo de empresa (usuario so ve/atua em irregularidades da propria empresa).
- E2E web: registro -> (cancelamento ou envio manutencao) -> (conclusao ou nao procede) -> validacao final/reprovacao.
- Integracao: criacao do primeiro evento historico no registro da irregularidade.
- Integracao: snapshot de empresa no evento historico.
- Integracao: deteccao de reincidencia e vinculo com irregularidade anterior.

### BT4.1 - Confiabilidade de concorrencia
- Testes de corrida para dupla tentativa de transicao na mesma irregularidade.
- Testes de idempotencia para endpoints de transicao.
- Testes de retry sem duplicar auditoria nem alterar estado indevidamente.

### BT5 - UX e Operacao
- Feedback visual claro dos status oficiais.
- Mensagens de bloqueio por regra de negocio.
- Preparar lote (fase 2) para acao em massa (iniciar manutencao, concluir, validar final).

---

## Epico 4 - Integracao OS externa (dual BRT) — RN-VIS-006

### US4.1 - Configurar empresa de manutencao para API ou fluxo legado
- Flags: tipo integracao, enviar e-mail relatorio, credenciais BRT (homolog/prod), URL base.

### US4.2 - Enviar irregularidade/lote com ramificacao API
- **Entrega 1:** 1 vistoria = 1 OS BRT; `os_orig` = `numeroVistoria` (+ `-N` no reenvio); selecao all-or-nothing das elegiveis **no escopo da empresa** (OS fora do escopo podem ficar no Tratamento / outra empresa); `comenta` multilinha; sucesso/falha atomicos por vistoria; sucesso parcial entre vistorias no lote; erros no Tratamento com detalhe.
- Plano: `docs/PLANO_BRT_OS_AGRUPAMENTO_VISTORIA.md`.

### US4.3 - Historico de OS externas
- Multiplos `os_orig`/`numOs` por irregularidade; OS ativa vs tentativas anteriores.

### US4.4 - Conclusao manual na trilha API
- `concluir-manutencao` permitido tambem com `controleIntegracaoApi` (nao chama BRT; vinculos permanecem).
- `marcar-nao-procede` manual continua bloqueado ate retorno integrado (v2).

### US4.5 - Retorno integrado BRT (v2)

**Como** sistema (job periodico)  
**Quero** consultar status/historico/insumos das OS BRT em aberto  
**Para** atualizar a timeline da OS, gravar insumos e mover o grupo automaticamente para Validacao ou Tratamento

**Contrato API BRT (guia tecnico rev. jul/2026)**
- Consulta lote: `GET /v1/os/registro?start_date&end_date&page&per_page` (janela max. 31 dias).
- Consulta unitaria: `GET /v1/os/registro/:numOs`.
- Auth: mesmos headers `ten_emp` + `token` da criacao/cancelamento.
- Cada item: `situacao`, `historico[]` (crescente), `insumo[]` (somente cresce); sem id de linha proprio.
- `situacao` oficiais: `Aberto`, `Aceite`, `Execucao`, `Retido`, `Paralisada`, `Finalizada`, `Disponivel`, `Cancelado` — comparacao **tolerante** (case/grafia).

**Gatilhos de transicao OMNI (grupo da vistoria = mesmo `os_orig`/`numOs` ativos)**

| Situacao BRT | Status OMNI | Tela | Efeito colateral |
| --- | --- | --- | --- |
| Aberto, Aceite, Execucao, Retido, Paralisada, Finalizada | permanece `EM_MANUTENCAO` | Manutencao | So timeline + insumos |
| **Disponivel** | `EM_MANUTENCAO` → `CONCLUIDA` | Validacao Final | Nao limpa `numOs`/`os_orig`/`erp_*` (rastreio); `acao: concluir_manutencao_integracao` |
| **Cancelado** | `EM_MANUTENCAO` → `REGISTRADA` | Tratamento | Limpa vinculos BRT ativos + `erp_*` (igual cancel manual); `acao: cancelar_retorno_brt`; reenvio usa `os_orig` `-N` |

**Persistencia**
- Timeline BRT: tabela de eventos da OS externa (chave natural ≈ `num_os` + `situacao` + `data_criacao` do historico); nao misturar intermediarios em `irregularidade_historico`.
- Insumos: tabela propria no nivel da OS (`num_os_externo` / `os_orig`); campos BRT `insumo`, `quantidade`, `valor`, `descricao`, `data_alteracao`.
- Snapshot opcional na irreg/OS: `status_brt_atual`, `status_brt_atualizado_em`, `status_brt_comentario` (motivo/comentário do histórico BRT da situação atual).
- `irregularidade_historico`: gravar **somente** quando o status OMNI muda (Disponivel / Cancelado).
- **Leitura consolidada:** `GET /irregularidades/:id/historico` faz merge OMNI + timeline BRT (campo `origem`); tempo de etapa so nos eventos OMNI.
- **UI Manutencao:** exibe ultimo `statusBrtAtual` no card; vermelho somente para `Paralisada`/`Retido` (`OS … na manutenção do BRT: {motivo}`) e erros (`ultimoErroIntegracao`); demais situacoes em estilo neutro (`Status BRT: {situacao}`).

**Polling**
- Configuracao por empresa (aba Integração): `brt_busca_info_ativo` + `brt_busca_info_intervalo_minutos` (1–1440; padrao 10) + `brt_busca_info_ultimo_poll_em`.
- Job Nest (`BrtOsPollService`, tick 1 min): **so dispara** para empresas com busca **ativa** e intervalo vencido desde o ultimo poll; sem nenhuma empresa ativa → no-op.
- Consulta unitaria `GET /v1/os/registro/:numOs` por OS candidata.
- Candidatas: `EM_MANUTENCAO` + `controle_integracao_api` + `num_os_externo_atual` da empresa.
- Agrupar 1 chamada por OS; idempotente (nao reaplicar transicao nem duplicar eventos/insumos).
- Falha de API: nao muda status OMNI; log sanitizado; ainda assim atualiza `ultimo_poll_em`.

**Criterios de aceite**
- [ ] `Finalizada` sozinha **nao** move para Validacao.
- [ ] Primeira deteccao de `Disponivel` (match tolerante) → grupo inteiro `CONCLUIDA`.
- [ ] Primeira deteccao de `Cancelado` → grupo `REGISTRADA` + limpa vinculos ativos/ERP.
- [ ] Status intermediarios so atualizam timeline/insumos.
- [ ] Re-poll nao duplica transicao nem eventos/insumos.
- [ ] Conclusao manual continua valida se o poll ainda nao capturou `Disponivel`.
- [ ] `marcar-nao-procede` manual na trilha API permanece bloqueado.
- [ ] Cadastro empresa: bloco Busca de informações (check + intervalo min); so entra no poll se ativo.

**Fora de escopo (esta US)**
- Webhook/callback BRT (API e 100% pull).
- Nao procede automatico via BRT.
- E-mail automatico para erros de placa (item separado do v2 original).

**Referencia:** RN-VIS-006; guia `api-ordens-servico-brt-3`.

---

### US4.6 - Retorno integrado ERP (busca de informacoes)

**Como** sistema (job) e operador (Manutencao)  
**Quero** consultar conclusao do pedido ERP e atualizar o status da irregularidade  
**Para** fechar o ciclo de manutencao em empresas sem API BRT (`integracaoManutencao = NENHUMA`)

**Contrato API ERP** (`documentacao_api_vistoria_consulta_resultado_atualizada.pdf` v2.0)
- `GET /api/v1/vistorias/{codigo_pedido}/resultado`
- Auth: `X-Tenant` + `X-API-Key` (mesma config de envio)
- Gatilho: `concluida: true` (`FLAG_FICHA_CONCLUIDA_PED = 1`) + `data_conclusao`
- Pendente: `concluida: false`; inexistente: HTTP 404

**Configuracao (aba Integração ERP)**
- `buscaInfoAtivo`, `buscaInfoIntervaloMinutos` (1–1440), `buscaInfoEmpresaIds` (so `NENHUMA`), `buscaInfoModoConclusao` (`SOMENTE_CONCLUIR` | `CONCLUIR_E_VALIDAR`)
- Busca **off** → job e botao **nao disparam**

**Gatilhos OMNI (grupo = mesmo `erp_codigo_pedido`)**

| Resultado ERP | Modo | Status OMNI |
| --- | --- | --- |
| `concluida: true` | SOMENTE_CONCLUIR | `EM_MANUTENCAO` → `CONCLUIDA` |
| `concluida: true` | CONCLUIR_E_VALIDAR | `EM_MANUTENCAO` → `CONCLUIDA` → `VALIDADA` |
| `concluida: false` / 404 / 500 | — | permanece `EM_MANUTENCAO` |

**Criterios de aceite**
- [x] Busca off → zero GET
- [x] Multi-select so lista empresas `NENHUMA`
- [x] Job + botao «Buscar status ERP» na Manutencao
- [x] Modos A/B configuraveis; idempotencia no re-poll

**Referencia:** RN-VIS-008

---


## Priorizacao sugerida

### Sprint 1
- Epico 1 completo (tratamento opcional, reclassificacao e cancelamento).

### Sprint 2
- Epico 2 completo (enviar/listar/concluir manutencao e nao procede).

### Sprint 3
- Epico 3 completo (fila, validacao final e reprovacao com retorno).

### Sprint 4
- Melhorias operacionais (indicadores, reincidencia e garantia).

---

## Definition of Done (global)

- Regras de transicao implementadas e testadas.
- Sem transicoes invalidas.
- Auditoria completa habilitada.
- Permissoes aplicadas no backend e frontend.
- Fluxo web funcionando ponta a ponta sem pacote de servico.
- Irregularidades `VALIDADA` e `CANCELADA` nao aparecem mais como pendentes do veiculo.
- Endpoints de transicao idempotentes e seguros contra concorrencia.
- Metricas e logs permitem rastrear cada transicao por correlation ID.
