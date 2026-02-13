# PLANO - ETAPA 1: STATUS DO VEICULO (CORE)
Data: 31/01/2026
Objetivo: Implementar status do veiculo baseado em vistoria, com historico e dashboard simples.

## Escopo da etapa
- Status como entidade (nao enum).
- Vistoria finalizada define status do veiculo.
- Historico de status e status ativo por veiculo.
- Dashboard simples com contagem por status.

## Regras de negocio
1. O status do veiculo e sempre alterado por vistoria (ponto unico).
2. O status nao e enum, e sim entidade vinculada ao tipo de vistoria.
3. Nao ha status simultaneos nesta etapa.
4. “Disponivel para operacao” tambem e setado por vistoria.
5. TipoVistoria e 1:1 com StatusVeiculo.

## Modelo de dados (alto nivel)
### StatusVeiculo
- id
- nome
- tipoVistoriaId (vinculo com tipo de vistoria)
- ativo

### VeiculoStatus (historico/ativo)
- id
- veiculoId
- statusId
- dataInicio
- dataFim (null = ativo)
- vistoriaId (origem)
- operadorId
- observacao

## Fluxo da etapa
1. Finalizar vistoria no app.
2. Sistema identifica o StatusVeiculo vinculado ao tipo de vistoria.
3. Cria registro em VeiculoStatus (dataFim = null).
4. Dashboard atualiza contagem por status.

## Telas/relatorios minimos
- Dashboard de frota: contagem por status.
- Lista de veiculos com status ativos.
- Detalhe do veiculo com historico de status.

## Criterio de sucesso
- Status aplicado automaticamente ao finalizar vistoria.
- Status ativo aparece no painel web.
- Historico de status acessivel no detalhe do veiculo.

## Fora de escopo (etapas futuras)
- Higienizacao com tempo/medicao (Etapa 2)
- Recarga/abastecimento com tempo/medicao (Etapa 2)
- Manutencao + ordem de servico (Etapa 3)
- Integracao com pontos de recarga (Etapa 4)
