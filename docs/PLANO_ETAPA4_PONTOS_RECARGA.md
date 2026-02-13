# PLANO - ETAPA 4: PONTOS DE RECARGA (INTEGRACAO)
Data: 31/01/2026
Objetivo: Integrar status dos pontos de recarga/carregamento ao sistema.

## Escopo da etapa
- Integracao com fornecedor de pontos.
- Atualizacao automatica de ocupacao.
- Relatorios de utilizacao dos pontos.

## Regras de negocio
1. Integracao deve ser validada antes de ativar no fluxo.
2. Status do ponto pode ser livre, ocupado, manutencao.
3. Vistoria continua sendo o ponto oficial para status do veiculo.

## Modelo de dados (alto nivel)
### PontoRecarga
- id
- fornecedorId
- nome
- status (livre, ocupado, manutencao)
- veiculoAtualId
- ultimaAtualizacao

## Fluxo da etapa
1. Integracao atualiza status dos pontos.
2. Painel exibe ocupacao e historico.
3. Operador acompanha conflitos entre ponto e status do veiculo.

## Telas/relatorios minimos
- Painel de pontos (status atual).
- Relatorio de ocupacao por periodo.

## Criterio de sucesso
- Status do ponto sincronizado com fornecedor.
- Painel atualiza em tempo real (ou proximo do real).

## Dependencias
- Etapa 1 concluida.
- Etapa 2 recomendada (para tempo/medicao).
