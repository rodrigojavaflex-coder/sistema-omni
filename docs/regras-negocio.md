# Regras de Negocio da Aplicacao

## Objetivo
Este documento centraliza as regras de negocio funcionais da aplicacao para alinhar time de produto, desenvolvimento, QA e operacao.

## Como usar este documento
- Registre regras por modulo e fluxo.
- Escreva cada regra de forma objetiva e verificavel.
- Inclua exemplos de entrada/saida quando possivel.
- Atualize este arquivo sempre que uma regra funcional for criada, alterada ou removida.

## Template de regra
Copie o bloco abaixo para cada regra nova.

```md
### RN-<MODULO>-<NUMERO> - <Titulo curto>
- **Modulo:** <Ex.: Vistoria>
- **Fluxo:** <Ex.: Reclassificacao de Irregularidade>
- **Descricao:** <Regra em linguagem funcional clara>
- **Condicoes de entrada:** <Pre-condicoes obrigatorias>
- **Validacoes:** <Regras de validacao e bloqueios>
- **Acoes do sistema:** <O que o sistema deve fazer>
- **Mensagens ao usuario:** <Mensagens esperadas em sucesso/erro>
- **Permissoes envolvidas:** <Perfis/permissoes exigidas>
- **Dados impactados:** <Entidades/tabelas/campos>
- **Rastreabilidade:** <Logs, historico, auditoria>
- **Criterios de aceite:** <Checklist objetivo para QA>
- **Cenarios de excecao:** <Comportamentos alternativos e erros>
- **Origem da regra:** <Ticket, decisao de negocio, data>
- **Status:** <Proposta | Aprovada | Implementada | Deprecada>
```

## Modulos

### 1. Vistoria
#### Regras
- [ ] RN-VIS-001 - Placeholder

#### Exemplo (preencher e substituir)
### RN-VIS-001 - Reclassificar irregularidade por cascata
- **Modulo:** Vistoria
- **Fluxo:** Reclassificacao
- **Descricao:** Ao reclassificar, o usuario deve selecionar area, depois componente da area e depois sintoma do componente.
- **Condicoes de entrada:** Irregularidade em status permitido para reclassificacao.
- **Validacoes:** Nao permitir componente sem area valida; nao permitir sintoma sem componente valido.
- **Acoes do sistema:** Atualizar area/componente/sintoma e registrar historico.
- **Mensagens ao usuario:** Exibir erro quando selecao for invalida.
- **Permissoes envolvidas:** IRREGULARIDADE_TRATAMENTO_UPDATE.
- **Dados impactados:** irregularidades.idarea, irregularidades.idcomponente, irregularidades.idsintoma.
- **Rastreabilidade:** Evento de historico com usuario, data e observacao.
- **Criterios de aceite:**
  - [ ] Area lista opcoes por modelo do veiculo.
  - [ ] Componente depende da area.
  - [ ] Sintoma depende do componente.
- **Cenarios de excecao:** Area sem componentes vinculados.
- **Origem da regra:** <ticket/decisao>.
- **Status:** Aprovada.

### 2. Ocorrencias
#### Regras
- [ ] RN-OCO-001 - Placeholder

### 3. Manutencao
#### Regras
- [ ] RN-MAN-001 - Placeholder

### 4. Cadastros Gerais
#### Regras
- [ ] RN-CAD-001 - Placeholder

## Regras transversais

### Permissoes e acesso
- Toda acao deve validar permissao antes de executar regra de negocio.
- Operacoes fora de escopo devem retornar erro funcional claro.

### Integridade e consistencia
- Mudancas criticas devem ser atomicas (transacao quando necessario).
- Estados invalidos devem ser bloqueados com mensagem objetiva.

### Auditoria
- Acoes relevantes devem registrar: usuario, data/hora, acao, origem e dados alterados.

## Politica de versao do documento
- Sempre adicionar historico de alteracao no final.
- Nao apagar regras antigas sem marcar como "Deprecada".

## Historico de alteracoes
- 2026-04-22: Criacao do template inicial.
