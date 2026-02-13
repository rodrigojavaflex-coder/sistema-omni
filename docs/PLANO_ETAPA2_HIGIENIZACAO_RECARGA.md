# PLANO - ETAPA 2: HIGIENIZACAO E RECARGA
Data: 31/01/2026
Objetivo: Controlar tempo e medicao para higienizacao e recarga/abastecimento.

## Escopo da etapa
- Medir tempo de permanencia em status.
- Registrar medicao de recarga/abastecimento.
- Relatorios basicos por periodo.

## Regras de negocio
1. Status continua sendo alterado apenas por vistoria.
2. Higienizacao pode ser simples ou geral (status distintos).
3. Recarga/abastecimento deve registrar tempo e medicao.

## Modelo de dados (alto nivel)
### VeiculoStatusMetrica
- id
- veiculoStatusId
- tipo (bateria, combustivel, km, outros)
- valor
- unidade
- dataRegistro

## Fluxo da etapa
1. Vistoria define status de higienizacao ou recarga.
2. Sistema inicia contagem de tempo (dataInicio).
3. Ao finalizar vistoria de retorno, encerra status (dataFim).
4. Medicoes sao registradas durante ou ao fim do status.

## Telas/relatorios minimos
- Tempo medio por tipo de status.
- Lista de veiculos com tempo atual em higienizacao/recarga.
- Relatorio de consumo/recarga por periodo.

## Criterio de sucesso
- Tempo calculado corretamente (dataInicio/dataFim).
- Medicoes registradas e consultaveis.

## Dependencias
- Etapa 1 concluida (status do veiculo).
