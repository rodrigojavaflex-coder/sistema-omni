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

### RN-AUTH-002 - Atalhos da tela inicial (home)
- **Modulo:** Autenticacao / Usuario
- **Fluxo:** Usuario personaliza atalhos rapidos na tela de boas-vindas
- **Descricao:** Preferencia persistida em `usuarios.atalhos_home` (JSON array de IDs), ate 8 itens, ordem definida pelo usuario. IDs estaticos derivados das rotas do menu; links BI cadastrados usam `bi-acesso:{uuid}`. `null` no banco = usuario ainda nao personalizou; frontend usa atalhos padrao filtrados por permissao. Categorias em «Personalizar atalhos» seguem a hierarquia do menu (ex.: `Cadastros / Gerais`, `Gestão / Fluxo Vistoria`, `Gestão / BI`).
- **Condicoes de entrada:** Usuario autenticado
- **Validacoes:** Apenas o proprio usuario pode alterar seus atalhos (`PATCH /users/:id/atalhos-home`); maximo 8 itens; somente IDs do catalogo
- **Acoes do sistema:** Exibir grid de atalhos na home; modal de personalizacao com busca, selecao e reordenacao; persistir preferencia no banco
- **Mensagens ao usuario:** Erro ao salvar: "Nao foi possivel salvar os atalhos da tela inicial."; 403 ao tentar alterar atalhos de outro usuario
- **Permissoes envolvidas:** Cada atalho exige a permissao `:read` da rota correspondente (telas de irregularidades: `tratamento:read`, `manutencao:read` ou `validacao_final:read`)
- **Dados impactados:** `usuarios.atalhos_home`
- **Rastreabilidade:** Nao exige auditoria dedicada
- **Criterios de aceite:**
  - [ ] Login sem personalizacao exibe atalhos padrao filtrados por permissao
  - [ ] Personalizar, salvar e recarregar persiste no banco
  - [ ] Atalho sem permissao nao aparece na home nem no modal
  - [ ] Links BI cadastrados aparecem em «Gestão / BI» quando o usuario tem permissao
  - [ ] Tentativa de alterar atalhos de outro usuario retorna 403
- **Cenarios de excecao:** Usuario sem nenhuma permissao de atalho ve estado vazio com CTA para configurar
- **Origem da regra:** Alinhamento com NEST_ANGULAR (RN-014), 2026-05-20
- **Status:** Implementada

### 1. Vistoria
#### Regras
- [x] RN-VIS-003 - Permissoes de acesso e acao por tela do fluxo de irregularidades
- [x] RN-VIS-004 - Registrar irregularidade SOS na web (Tratamento)
- [ ] RN-VIS-001 - Placeholder
- [x] RN-VIS-002 - Descricao obrigatoria do problema na irregularidade (vistoria)

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

### RN-VIS-003 - Permissoes de acesso e acao por tela do fluxo de irregularidades
- **Modulo:** Vistoria
- **Fluxo:** Telas web Tratamento, Manutencao e Validacao (`/irregularidades/*`)
- **Descricao:** Cada tela exige permissao `:read` propria para menu, rota e listagem API. Permissoes de acao (`:update`, `:start`, `:finish`, `:mark_not_proceeding`) controlam apenas botoes e endpoints de transicao; nao substituem o `:read` de acesso.
- **Condicoes de entrada:** Usuario autenticado com perfil contendo permissoes do fluxo
- **Validacoes:**
  - Menu e rota de Tratamento exigem `irregularidade_tratamento:read`
  - Menu e rota de Manutencao exigem `irregularidade_manutencao:read`
  - Menu e rota de Validacao exigem `irregularidade_validacao_final:read`
  - `GET /irregularidades` exige `:read` de cada etapa correspondente aos status consultados (REGISTRADA/CANCELADA → tratamento; EM_MANUTENCAO → manutencao; CONCLUIDA/NAO_PROCEDE/VALIDADA → validacao final)
  - Consulta com multiplos status exige todas as permissoes `:read` envolvidas
- **Acoes do sistema:**
  - Cadastro de perfis agrupa permissoes em «Irregularidades – Tratamento», «Irregularidades – Manutenção» e «Irregularidades – Validação»
  - `irregularidade_manutencao:start` aparece no grupo Tratamento (botao «Enviar para manutenção» nesta tela)
  - API retorna HTTP 403 quando falta `:read` da etapa consultada
  - Filtro «Todos» na tela Tratamento (frontend) monta a lista de status conforme `:read` do usuario antes de chamar a API
- **Mensagens ao usuario:** Guard/rota redireciona para home sem `:read`; API 403 com lista de permissoes faltantes
- **Permissoes envolvidas:**
  - Tratamento: `irregularidade_tratamento:read` (acesso), `irregularidade_tratamento:update` (reclassificar/cancelar), `irregularidade_manutencao:start` (enviar para manutencao)
  - Manutencao: `irregularidade_manutencao:read` (acesso), `irregularidade_manutencao:finish`, `irregularidade_manutencao:mark_not_proceeding`
  - Validacao: `irregularidade_validacao_final:read` (acesso), `irregularidade_validacao_final:update` (validar/reprovar)
- **Dados impactados:** Nenhum (sem alteracao de schema; keys de permissao mantidas)
- **Rastreabilidade:** Nao exige auditoria adicional
- **Criterios de aceite:**
  - [ ] Usuario so com permissoes de acao (sem `:read`) nao ve menu nem rota da tela
  - [ ] Usuario com `:read` ve fila sem botoes de acao nao autorizados
  - [ ] Operador Tratamento precisa de `tratamento:read` + acoes desejadas (ex.: `update`, `manutencao:start`)
  - [ ] `GET /irregularidades` retorna 403 ao consultar status de etapa sem `:read`
  - [ ] Cadastro de perfil exibe 3 grupos com labels alinhados as telas
  - [ ] Filtro «Todos» em Tratamento lista apenas status das etapas com `:read` do usuario
- **Cenarios de excecao:** Perfis existentes com acao mas sem `:read` perdem acesso ate inclusao da permissao de leitura; filtro «Todos» em Tratamento envia ao backend apenas status permitidos pelas permissoes `:read` do usuario (tratamento → REGISTRADA/CANCELADA; manutencao → EM_MANUTENCAO; validacao → CONCLUIDA/NAO_PROCEDE/VALIDADA)
- **Origem da regra:** Reorganizacao de permissoes do fluxo web, 2026-05-21
- **Status:** Implementada

### RN-VIS-004 - Registrar irregularidade SOS na web (Tratamento)
- **Modulo:** Vistoria
- **Fluxo:** Tela web Tratamento (`/irregularidades/tratamento`)
- **Descricao:** Operador com permissao dedicada abre sessao SOS, registra uma ou mais irregularidades com vistoria pai automatica e conclui ou cancela a sessao. Irregularidades SOS seguem o fluxo normal apos o registro.
- **Condicoes de entrada:** Usuario autenticado com `irregularidade_tratamento:create_sos` e `irregularidade_tratamento:read`
- **Validacoes:**
  - Veiculo e motorista ativos via autocomplete
  - Odometro validado no frontend e backend (maior que ultimo quando existir); ultimo odometro considera apenas vistorias `FINALIZADA` (exclui `EM_ANDAMENTO` e `CANCELADA`)
  - Bateria obrigatoria para veiculo eletrico
  - Descricao da irregularidade obrigatoria (RN-VIS-002); observacao da vistoria opcional
  - Matriz: `exigeFoto` e `permiteAudio`
  - Concluir SOS exige ao menos uma irregularidade e fotos quando obrigatorias
  - Pendencia duplicada: aviso e confirmacao; sem bloqueio
- **Acoes do sistema:**
  - Ao abrir o modal SOS, verificar sessao `EM_ANDAMENTO` com `origem = SOS_WEB` do usuario logado; se existir, oferecer continuar ou excluir (exclusao fisica em cascata)
  - Criar vistoria `EM_ANDAMENTO` com `origem = SOS_WEB`
  - Registrar irregularidade(s) com `origem_registro = SOS_WEB`
  - Historico `registrar_sos` com observacao «Irregularidade registrada por SOS»
  - Finalizar com tempo em minutos (minimo 1) ou cancelar SOS excluindo vistoria, irregularidades, historico e midias do banco (sem status CANCELADA)
- **Permissoes envolvidas:** `irregularidade_tratamento:create_sos`, `irregularidade_tratamento:read`; demais acoes do fluxo conforme RN-VIS-003
- **Dados impactados:** `vistorias`, `irregularidades.origem_registro`, `vistorias.origem`, `irregularidades_midias`, `irregularidade_historico`
- **Rastreabilidade:** Historico com usuario, data e tempo de etapa
- **Criterios de aceite:** Ver `docs/PLANO_IRREGULARIDADE_SOS_WEB.md`
- **Origem da regra:** Requisito de produto — irregularidade SOS web, 2026-06-08
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
- 2026-06-08: RN-VIS-004 Cancelamento SOS passa a excluir registros do banco (vistoria e irregularidades), sem marcar CANCELADA.
- 2026-06-08: RN-VIS-004 Registro de irregularidade SOS na web (Tratamento), vistoria pai automatica, origem SOS, filtro e badge no fluxo.
- 2026-05-21: RN-VIS-003 Permissoes de acesso (`:read`) e acao separadas por tela do fluxo de irregularidades (Tratamento, Manutencao, Validacao); grupos no cadastro de perfis.
- 2026-05-06: RN-VIS-002 Descricao obrigatoria ao registrar/editar irregularidade na vistoria (app mobile + API `observacao`), com validacao trim e UX acessivel.
- 2026-04-27: RN-AUTH-001 Recuperacao de senha por OTP (e-mail), web e mobile.
- 2026-04-22: Criacao do template inicial.
