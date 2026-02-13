# PLANO - ETAPA 3: MANUTENCAO E ORDEM DE SERVICO
Data: 31/01/2026
Objetivo: Controlar manutencao via OS terceirizada, com vistoria de envio/retorno.

## Escopo da etapa
- Criar Ordem de Servico (OS) automaticamente.
- Integrar OS ao status do veiculo.
- Validar retorno por vistoria.

## Regras de negocio
1. Vistoria de saida para manutencao cria OS.
2. OS e executada por empresa terceira (sem portal proprio por enquanto).
3. Vistoria de retorno valida e encerra OS.
4. Status do veiculo e atualizado pela vistoria.

## Modelo de dados (alto nivel)
### OrdemServico
- id
- veiculoId
- statusId (que originou a OS)
- empresaTerceira
- dataEnvio
- dataPrevista
- dataRetorno
- statusOS (aberta, em_execucao, concluida, reprovada)
- itens (descricao, custo, executado)
- vistoriaEnvioId
- vistoriaRetornoId

## Fluxo da etapa
1. Vistoria gera status "Em manutencao" e cria OS.
2. Operador acompanha OS (status interno).
3. Vistoria de retorno encerra OS e atualiza status.

## Telas/relatorios minimos
- Lista de OS com filtros (aberta, em execucao, concluida).
- Detalhe da OS com itens e historico.
- Relatorio de tempo medio de manutencao.

## Criterio de sucesso
- OS criada automaticamente ao sair para manutencao.
- OS encerrada ao retorno com vistoria valida.

## Dependencias
- Etapa 1 concluida (status do veiculo).
