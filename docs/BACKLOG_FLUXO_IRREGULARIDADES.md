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
| `REGISTRADA` | Enviar para manutencao (sem API) | `EM_MANUTENCAO` | Empresa de manutencao definida | `422` transicao invalida |
| `REGISTRADA` | Enviar para manutencao (com API) | `EM_MANUTENCAO` | POST OS externa OK ou duplicada idempotente | Permanece `REGISTRADA` + erro integracao |
| `RETRABALHO_GARANTIA` | Corrigir classificacao | `RETRABALHO_GARANTIA` | Destino valido e autorizado | `422` destino invalido |
| `RETRABALHO_GARANTIA` | Cancelar irregularidade | `CANCELADA` | Motivo obrigatorio | `400` motivo obrigatorio |
| `RETRABALHO_GARANTIA` | Reenviar para manutencao | `EM_MANUTENCAO` | `os_orig` = `numeroIrregularidade-N` (N≥2); empresa configurada | Erro API: permanece `RETRABALHO_GARANTIA` |
| `EM_MANUTENCAO` | Concluir manutencao (sem controle API) | `CONCLUIDA` | Evidencia minima quando obrigatoria | `422` pendencia |
| `EM_MANUTENCAO` | Concluir manutencao (controle API) | `CONCLUIDA` | **v2:** apenas via retorno integrado | `422` bloqueio manual |
| `EM_MANUTENCAO` | Marcar nao procede (sem controle API) | `NAO_PROCEDE` | Justificativa obrigatoria | `400` justificativa obrigatoria |
| `EM_MANUTENCAO` | Marcar nao procede (controle API) | — | **Bloqueado** ate regra v2 | `422` bloqueio manual |
| `EM_MANUTENCAO` | Cancelar OS BRT (controle API) | `REGISTRADA` | POST cancelamento BRT OK; permissao `cancel_os_brt`; OS ativa | Permanece `EM_MANUTENCAO` + erro BRT |
| `NAO_PROCEDE` | Encaminhar para validacao final | `CONCLUIDA` | Justificativa preenchida | `422` pendencia |
| `CONCLUIDA` | Validar final | `VALIDADA` | Conferencia aprovada | `422` pendencia |
| `CONCLUIDA` | Reprovar final | `RETRABALHO_GARANTIA` | Observacao obrigatoria | `400` observacao obrigatoria |
| `NAO_PROCEDE` | Reprovar final (quando aplicavel) | `RETRABALHO_GARANTIA` | Observacao obrigatoria | `400` observacao obrigatoria |

### Matriz de transicao final (permitido/proibido)

| De \ Para | REGISTRADA | RETRABALHO_GARANTIA | CANCELADA | EM_MANUTENCAO | NAO_PROCEDE | CONCLUIDA | VALIDADA |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `REGISTRADA` | Permitido (reclassificar) | Proibido | Permitido | Permitido | Proibido | Proibido | Proibido |
| `RETRABALHO_GARANTIA` | Proibido | Permitido (reclassificar) | Permitido | Permitido (reenvio) | Proibido | Proibido | Proibido |
| `CANCELADA` | Proibido | Proibido | Proibido | Proibido | Proibido | Proibido | Proibido |
| `EM_MANUTENCAO` | Proibido*** | Proibido | Proibido | Proibido | Permitido* | Permitido* | Proibido |
| `NAO_PROCEDE` | Proibido | Proibido | Proibido | Proibido | Proibido | Permitido | Proibido |
| `CONCLUIDA` | Proibido | Permitido (reprovacao final) | Proibido | Proibido** | Proibido | Proibido | Permitido |
| `VALIDADA` | Proibido | Proibido | Proibido | Proibido | Proibido | Proibido | Proibido |

\* Somente trilha **sem** controle API, ou via integracao de retorno (v2) na trilha API.

\*\*\* Permitido para trilha API via cancelamento OS BRT (`EM_MANUTENCAO` → `REGISTRADA`).

\*\* Transicao historica `CONCLUIDA` → `EM_MANUTENCAO` na reprovacao **substituida** por `CONCLUIDA` → `RETRABALHO_GARANTIA` (RN-VIS-006). Codigo legado deve ser alinhado na implementacao.

### Integracao OS (BRT) — efeito no envio a partir de `REGISTRADA` / `RETRABALHO_GARANTIA`

| Resultado HTTP / corpo | Status OMNI | Tela |
| --- | --- | --- |
| `201` success ou `200` duplicada | `EM_MANUTENCAO` | Manutencao |
| Erro (`401`, `403`, `422`, etc.) | Inalterado (`REGISTRADA` ou `RETRABALHO_GARANTIA`) | Tratamento (detalhe do erro) |

---

## Epico 1 - Tratamento Opcional

### US1.1 - Listar irregularidades registradas

**Como** analista  
**Quero** ver irregularidades `REGISTRADA` com filtros  
**Para** corrigir rapidamente casos que exigem ajuste

**Criterios de aceite**
- Filtros por veiculo, data, area, componente, sintoma e status.
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
**Para** seguir para validacao final com justificativa tecnica

**Criterios de aceite**
- Transicao: `EM_MANUTENCAO -> NAO_PROCEDE`.
- Justificativa tecnica obrigatoria.
- Registro de evidencias opcional.
- Item `NAO_PROCEDE` deve aparecer na fila de validacao final.

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
**Quero** listar irregularidades `CONCLUIDA` e `NAO_PROCEDE`  
**Para** validar o resultado da manutencao

**Criterios de aceite**
- Filtros por veiculo, periodo e classificacao.
- Exibir contexto tecnico e evidencias da manutencao.

**Tarefas tecnicas**
- Endpoint `GET /irregularidades?status=CONCLUIDA,NAO_PROCEDE`.
- Tela web "Fila de validacao final".

---

### US3.2 - Validar final irregularidade

**Como** analista  
**Quero** validar a manutencao concluida  
**Para** baixar definitivamente a pendencia do veiculo

**Criterios de aceite**
- Transicao: `CONCLUIDA -> VALIDADA`.
- Transicao: `NAO_PROCEDE -> VALIDADA`.
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
- 1:1 OS; resposta parcial; erros permanecem no Tratamento com detalhe.

### US4.3 - Historico de OS externas
- Multiplos `os_orig`/`numOs` por irregularidade; OS ativa vs tentativas anteriores.

### US4.4 - Bloqueio de conclusao manual (trilha API)
- Manutencao somente leitura/acompanhamento ate retorno integrado (v2).

### US4.5 - Retorno integrado BRT (v2)
- Transicao automatica para `CONCLUIDA` e fila de Validacao Final.

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
