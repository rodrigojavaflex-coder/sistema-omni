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

### Autenticacao

### RN-AUTH-001 - Recuperacao de senha por codigo (OTP) por e-mail
- **Modulo:** Autenticacao
- **Fluxo:** Usuario nao lembra a senha; informa o e-mail de login, recebe codigo numerico por e-mail e define nova senha
- **Descricao:** A API responde de forma generica na solicitacao (nao revela se o e-mail existe). Codigo e de uso unico, com prazo, limite de tentativas e limite de frequencia; envio de e-mail depende da `emailEnvioConfig` (SMTP) ativa em Configuracoes. Senha redefinida com as mesmas regras de complexidade do cadastro.
- **Condicoes de entrada:** E-mail com formato valido; usuario ativo (fluxo interno, sem vazar inexistencia de conta)
- **Validacoes:** Codigo de 6 digitos; bloqueio apos N tentativas; cooldown entre solicitacoes; teto de solicitacoes por hora para usuario existente
- **Acoes do sistema:** Gera e envia codigo, invalida tentativas anteriores, ao confirmar aplica hash da nova senha (bcrypt) e audita redefinicao (quando configurado)
- **Mensagens ao usuario:** Resposta de solicitacao unica; erros de confirmacao nao expoem existencia de conta; 429 com mensagem generica de excesso
- **Permissoes envolvidas:** Nenhuma (rota publica)
- **Dados impactados:** `password_reset_otp`, `password_reset_throttle`, `usuarios.senha`
- **Rastreabilidade:** `CHANGE_PASSWORD` em auditoria (sem registro do codigo)
- **Criterios de aceite:** (1) Solicitar com e-mail existente e SMTP ok envia e-mail; (2) confirmar com codigo e senhas validas altera login; (3) codigo reutilizado ou expirado e recusado
- **Cenarios de excecao:** SMTP inativo, falha de envio (usuario ve mensagem generica; log servidor); muitas solicitacoes (429)
- **Origem da regra:** Requisito de produto, 2026-04-27
- **Status:** Implementada

### 1. Vistoria
#### Regras
- [ ] RN-VIS-001 - Placeholder
- [ ] RN-VIS-002 - Descricao obrigatoria do problema na irregularidade (vistoria)

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

### RN-VIS-002 - Descricao obrigatoria do problema na irregularidade (vistoria)
- **Modulo:** Vistoria
- **Fluxo:** Registrar ou editar irregularidade durante inspecao no aplicativo (campo «Descreva o problema», armazenado como `observacao`).
- **Descricao:** Toda gravacao dessa irregularidade deve incluir texto explicito da anomalia informada pelo vistoriador. Valores vazios ou compostos apenas de espacos em branco nao sao aceites.
- **Condicoes de entrada:** Fluxo em que se seleciona sintoma/componente/area na vistoria aberta e o utilizador solicita gravar irregularidade.
- **Validacoes:**
  - O campo de descricao deve existir texto apos `trim`;
  - A API deve rejeitar `observacao` ausente ou vazia (`trim`) com resposta HTTP 4xx coerente.
- **Acoes do sistema:** Persistir apenas descricoes validas; servico registra historia com status REGISTRADA como hoje.
- **Mensagens ao utilizador:**
  - Antes de persistir (app): impedir gravacao com mensagem acessivel associada ao campo;
  - API: mensagens funcionais claras (class-validator `message`), sem dados sensiveis.
- **Permissoes envolvidas:** `VISTORIA_UPDATE` nos endpoints utilizados pela vistoria; sem alteracao de matriz de permissoes.
- **Dados impactados:** `irregularidades.observacao`
- **Rastreabilidade:** Historico de irregularidade mantem entrada de registro; descricao faz parte da propria irregularidade.
- **Criterios de aceite:**
  - [ ] Com descricao em branco ou so espacos, nao ha gravacao bem-sucedida.
  - [ ] Com texto valido apos `trim`, comportamento igual ao atual (incluido anexacao de midias quando aplicavel).
  - [ ] Resposta da API inconsistente (`observacao` invalida) e tratada pelo cliente com mensagem visivel ao utilizador.
- **Cenarios de excecao:** Cliente offline nao comunica erro de validacao servidor ate haver ligacao — validacao client-side continua obrigatoria.
- **Origem da regra:** Requisito de produto — descricao obrigatoria da irregularidade, 2026-05-06
- **Status:** Implementada

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
- 2026-05-06: RN-VIS-002 Descricao obrigatoria ao registrar/editar irregularidade na vistoria (app mobile + API `observacao`), com validacao trim e UX acessivel.
- 2026-04-27: RN-AUTH-001 Recuperacao de senha por OTP (e-mail), web e mobile.
- 2026-04-22: Criacao do template inicial.
