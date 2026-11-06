# Plano: Controle de Escala e Liberação de Veículos

**Data:** 28/10/2026  
**Status:** Implementada (código) — conceder permissões manualmente em Perfis e rodar migration  
**Módulo:** Escala / Operação (cruzamento com Vistoria/OS)  
**Regras:** RN-ESC-001 … RN-ESC-005 em `docs/regras-negocio.md`

---

## Contexto

O OMNI precisa cruzar **escala prevista do dia (INFOBUS)**, **telemetria BRT** e **OS graves** para apoiar a liberação da frota antes da largada.

Fontes externas:
- INFOBUS: `GET /api/v1/veiculos/km/detalhado?data=YYYY-MM-DD` (`X-Tenant` + `X-API-Key`) — `veiculos[].km` = **previsão de KM da escala** do dia
- BRT: `GET /v1/tempo_real` (`ten_emp` + `token`) — bateria %, autonomia, odometro, lat/long

---

## Objetivo

Tela de **Controle de Escala e Liberação** com alertas de:
1. Veículo **RETIDO** (OS vermelha em Manutenção ou Validação) **e** presente na escala do dia
2. GNV/Elétrico cuja autonomia (telemetria e/ou cálculo OMNI) pode **não cobrir** o KM da escala — exibir **as duas fontes** e projeção a 100%

---

## Decisões fechadas

| Tema | Decisão |
|------|--------|
| KM INFOBUS | Previsão de escala do dia (não “realizado histórico” genérico) |
| RETIDO | `gravidade = VERMELHO` e status `EM_MANUTENCAO` ou `CONCLUIDA` |
| Fora do RETIDO | Tratamento, `CANCELADA`, `NAO_PROCEDE`, **`VALIDADA`** |
| Alerta autonomia | Dispara se **qualquer** fonte (telemetria ou OMNI) &lt; KM escala; UI mostra as duas + projeção 100% |
| Config INFOBUS | Aba **Escala INFOBUS** na Configuração do Sistema (URL, tenant, API Key mascarada) |
| Telemetria BRT | Credenciais da empresa `BRT_OS` (sem nova aba de segredo) |
| Diesel | Campo `kmPorLitro` no modelo; alerta autonomia v1 só GNV/Elétrico |
| Permissões | Enum/catálogo; concessão **manual** em Perfis |

---

## Escopo

### Dentro
- Campos no modelo: `kmPorPercentual`, `kmPorLitro`
- Config Escala INFOBUS + sync/persistência da escala do dia
- Sync/persistência telemetria `tempo_real`
- Status operacional RETIDO (derivado)
- Tela web de controle + alertas dual-fonte
- RN-ESC-* e permissões `controle_escala:read` / `controle_escala:sync`

### Fora
- Mobile
- Workflow formal de liberar/bloquear
- Alerta Diesel por autonomia
- API de escala planejada distinta do KM detalhado

---

## Critérios de aceite

1. RETIDO apenas com OS `VERMELHO` em `EM_MANUTENCAO` ou `CONCLUIDA` (`VALIDADA` não conta)
2. Aba Escala INFOBUS grava URL/tenant/API Key (mascarada); sync usa essa config
3. Escala do dia persiste KM previsto; match por prefixo ↔ `veiculos.descricao`
4. Alerta autonomia mostra KM escala, autonomia telemetria, autonomia OMNI e projeções a 100%
5. Tela com loading/vazio/erro, tema claro/escuro, hover/focus/disabled

---

## Fases

1. Modelo — `km_por_percentual` / `km_por_litro`
2. Config Escala INFOBUS + sync KM detalhado
3. Sync telemetria BRT
4. API de painel + tela Controle de Escala / Liberação

---

## Validação manual

1. Preencher Escala INFOBUS e sincronizar data do dia → veículos/KM na tela
2. OS vermelha `EM_MANUTENCAO` ou `CONCLUIDA` no veículo da escala → alerta RETIDO
3. Elétrico/GNV com `% × kmPorPercentual` ou autonomia BRT &lt; KM escala → alerta com as duas fontes
