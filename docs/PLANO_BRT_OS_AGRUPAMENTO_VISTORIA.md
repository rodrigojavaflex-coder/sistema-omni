# Plano: Entrega 1 — OS BRT agrupada por vistoria

**Data:** 29/09/2026  
**Status:** Implementada (Entrega 1)  
**Objetivo:** No envio para manutenção com empresa configurada para Integração OS Consórcio BRT, gerar **1 OS na BRT por vistoria OMNI**, agregando todas as irregularidades elegíveis daquela vistoria no mesmo `os_orig` / `numOs`.

**Regra de negócio:** atualizar **RN-VIS-006** (`docs/regras-negocio.md`) e Épico 4 / US4.2 (`docs/BACKLOG_FLUXO_IRREGULARIDADES.md`).

**Relacionado:** análise de conflito de numeração (set/2026) — 114 colisões históricas `numero_vistoria` = `os_orig` legado; **0** com irregularidades elegíveis a envio no momento da validação.

---

## Contexto

| Hoje (v1) | Entrega 1 |
|-----------|-----------|
| 1 irregularidade = 1 OS BRT | 1 vistoria = 1 OS BRT |
| `os_orig` = `numeroIrregularidade` (+ `-N` no reenvio) | `os_orig` = `numeroVistoria` (+ `-N` no reenvio) |
| Lote processa item a item na API | Lote agrupa por `idVistoria` / `numeroVistoria` |
| Seleção parcial permitida | Seleção parcial **bloqueada** (all-or-nothing por vistoria) |

Trilha **sem** API BRT (legado PDF/e-mail) permanece inalterada.

---

## Escopo

### Dentro
- Envio unitário e em lote para empresa `integracaoManutencao = BRT_OS`
- Validação: selecionar **todas** as irregularidades elegíveis da vistoria
- Payload BRT: `comenta` multilinha; `tpo_srv` da capa da vistoria; `os_orig` = nº da vistoria
- Persistência do mesmo `os_orig` / `numOs` em todas as irregularidades do grupo
- Cancelamento OS BRT **no grupo** (vistoria)
- Preview/mensagens na UI (Tratamento) e bloqueio de seleção incompleta
- Atualização RN-VIS-006 + backlog US4.2
- SOS: mesma regra (mesma estrutura de vistoria)

### Fora de escopo
- Retorno automático BRT → `CONCLUIDA` (v2 / US4.5)
- Retrabalho parcial na validação (aprovar 1 / reprovar 2 → Manutenção + reintegração BRT)
- Prefixo alfanumérico em `os_orig` (`V…`) — desnecessário no cutover atual
- Alteração do fluxo legado sem API
- Migration estrutural (reuso de colunas existentes)
- Pagamento / pós-validação

---

## Decisões fechadas

| Tema | Decisão |
|------|--------|
| Chave do grupo | Vistoria OMNI (`idVistoria` / `numeroVistoria`) |
| `os_orig` 1º envio | `String(numeroVistoria)` |
| `os_orig` reenvio | Após sucesso BRT prévio (incl. cancelada) ou ciclo equivalente: `numeroVistoria-2`, `-3`… (mesma lógica atual de contagem de sucessos, no âmbito do **grupo/vistoria**) |
| Seleção incompleta | Bloquear (UI + API) com mensagem citando vistoria e qtd faltante |
| Tratamento | Continua item a item (reclassificar/cancelar); só o **envio BRT** exige conjunto completo |
| `comenta` | Multilinha; limite **4000** com truncate (como hoje) |
| Formato `comenta` | Ver abaixo |
| `tpo_srv` | Da capa da vistoria (SINISTRO/PREVENTIVA/SOS/corretiva) — sem conflito no grupo |
| Cancelamento | Uma chamada `tpo_reg: 7`; todas as irreg com aquele `os_orig`/`numOs` ativos → `REGISTRADA` |
| Rastreio operacional | Continua por **`numOs` BRT** (`num_os_externo`); `os_orig` para auditoria/idempotência |
| Legado 1:1 | Convive; não reescrever histórico antigo |
| Conflito numeração | Aceito número puro: max vistoria > max `os_orig` enviado; 0 elegíveis nas colisões |
| Entrega 3 (reprovação parcial) | Desconsiderada por hora |

### Formato `comenta`

```text
CHASSI->FREIO->Luz de Freio Acesa
Obs: Freio com problema

CHASSI->MOTOR->AQUECIMENTO
Obs: Motor esta aquecendo
```

(Blocos por irregularidade ordenados por `numeroIrregularidade`; sem prefixo de NS.)

### Elegíveis ao envio (conjunto obrigatório por vistoria)

Status: `REGISTRADA` e `RETRABALHO_GARANTIA` (quando aplicável).  
Excluir: `CANCELADA`, `VALIDADA`, `EM_MANUTENCAO`, `CONCLUIDA`, `NAO_PROCEDE`.

---

## Critérios de aceite

1. Empresa BRT + seleção com 2 de 3 elegíveis da mesma vistoria → **rejeitado** (UI e API); mensagem indica vistoria e quantidade.
2. Seleção completa de N vistorias distintas → **N** POSTs BRT; `os_orig` = respectivos `numeroVistoria`.
3. Sucesso: todas as irreg do grupo em `EM_MANUTENCAO` com o **mesmo** `numOs` / `os_orig`; histórico em `irregularidades_os_externas` por irregularidade (mesmo par).
4. Falha BRT: **nenhuma** irreg daquela vistoria avança; erro visível no Tratamento (atômico por vistoria).
5. `comenta` no formato acordado; se > 4000, truncate.
6. Cancelar OS BRT: 1 chamada; todas do grupo → `REGISTRADA`; UI avisa impacto em N itens.
7. Reenvio após cancelamento (sucesso prévio no grupo): `os_orig` com sufixo `-N`.
8. Empresa **sem** BRT: comportamento legado inalterado (subset permitido).
9. SOS: mesma regra de agrupamento/seleção completa.
10. Tema claro/escuro e estados hover/focus/disabled no modal de envio/cancelamento.

---

## Impacto técnico

### Backend
| Arquivo / área | Mudança |
|----------------|---------|
| `brt-os-integration.service.ts` | `buildOsOrig` baseado em `numeroVistoria`; `buildComentarioGrupo`; payload de grupo |
| `irregularidade-manutencao-envio.service.ts` | Agrupar lote por vistoria; envio atômico; validar conjunto completo; cancelamento em grupo |
| `irregularidade.service.ts` / controller | Validação de seleção incompleta no unitário/lote; cancelamento propaga ao grupo |
| DTOs de falha/resumo | Falhas por vistoria (listar irreg afetadas) quando fizer sentido |
| RN / backlog | Documentar 1 vistoria = 1 OS |

### Frontend
| Área | Mudança |
|------|---------|
| `irregularidade-fluxo-list` | Validar seleção completa por vistoria antes do POST; preview “N vistorias → N OS BRT”; mensagem de bloqueio |
| Modal cancelar OS BRT | Aviso de impacto em todas as irreg do grupo |
| Exibição OS | Vários cards com o mesmo `OS BRT: {numOs}` / `os_orig` (nº vistoria) |

### Dados
- Sem migration obrigatória.
- Contagem de ciclos de `os_orig`: definir regra explícita (ex.: sucessos distintos de `os_orig` base da vistoria, ou flag/máximo de ciclo por `numeroVistoria` nas linhas de `irregularidades_os_externas` do grupo).

### Contrato BRT (inalterado na URL)
- POST criar: `tpo_reg: 1`; cancelar: `tpo_reg: 7`
- Headers: `ten_emp`, `token`
- Campos: `os_orig`, `plc_vcl`, `tpo_srv`, `nom_sol`, `tel_ctt`, `loc_atd`, `comenta`, `odo_vcl` (odômetro da vistoria)

---

## Tarefas sugeridas

1. **Docs:** atualizar RN-VIS-006 (1:1 → 1 vistoria = 1 OS; `os_orig`; seleção; cancelamento grupo; `comenta`) e US4.2 no backlog.
2. **Client BRT:** `buildOsOrig(vistoria, sucessosAnterioresGrupo)` + `buildComentarioGrupo(irregularidades[])`.
3. **Envio:** refatorar `executarEnvioLote` / unitário para agrupar por vistoria; validar all-or-nothing; POST uma vez; persistir em todas.
4. **Cancelamento:** resolver grupo por `os_orig_atual` / `num_os_externo_atual`; uma chamada BRT; transação atualiza todas.
5. **UI Tratamento:** validação de seleção + preview + mensagens; Manutenção: aviso no cancelamento.
6. **Validação manual:** cenários dos critérios de aceite (1 vistoria / multi / falha / cancel / legado / SOS).

---

## Validação manual (1–3 passos principais)

1. Tratamento: selecionar 2 de 3 irreg da mesma vistoria + empresa BRT → bloqueio com mensagem clara.
2. Selecionar as 3 + enviar → 1 OS BRT; três cards em Manutenção com o mesmo `numOs` e `os_orig` = nº da vistoria.
3. Cancelar OS BRT em um card → as três voltam a `REGISTRADA`; reenvio gera `numeroVistoria-2`.

---

## Riscos residuais

| Risco | Mitigação |
|-------|-----------|
| Colisão futura se irregularidade elegível surgir em vistoria cujo nº já foi `os_orig` 1:1 | Reenvio com `-N` após sucesso; monitorar; prefixo como plano B |
| Truncate de `comenta` com muitas irreg | Limite 4000 mantido; preview opcional do tamanho |
| Timeout 60s | Menos POSTs por lote (melhor); grupo grande só no `comenta` |
| Contagem de ciclo `-N` no grupo | Definir na implementação (sucessos por base `numeroVistoria`, não por irreg isolada) |
| Dead-end v1 (sem retorno BRT) | Inalterado; grupo inteiro preso até cancelar ou v2 |

---

## Entregas posteriores (não nesta)

| Entrega | Conteúdo |
|---------|----------|
| **2** | Retorno BRT → grupo `EM_MANUTENCAO` → Validação (`CONCLUIDA`) |
| **3** | Validação parcial; reprovadas → Manutenção; reintegração BRT TBD |

---

## Definition of Done (Entrega 1)

- [ ] RN-VIS-006 e backlog US4.2 atualizados
- [ ] Envio BRT agrupado por vistoria (lote e unitário coerentes)
- [ ] Bloqueio seleção incompleta (UI + API)
- [ ] Cancelamento em grupo
- [ ] Critérios de aceite validados manualmente
- [ ] Sem regressão na trilha legado sem API
- [ ] Tema claro/escuro ok nas mudanças de UI
