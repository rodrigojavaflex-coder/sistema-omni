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

### RN-AUTH-003 - Versao do frontend e aviso de atualizacao
- **Modulo:** Autenticacao / Layout
- **Fluxo:** Usuario autenticado consulta a versao no menu do avatar; apos deploy, a aba aberta e avisada para recarregar
- **Descricao:** A versao visivel e a do `frontend/package.json` gravada em `version.json` no build. PATCH incrementa automaticamente em cada `deploy.ps1`. MINOR e MAJOR sao indicados manualmente (`.\deploy.ps1 -VersionBump minor|major` ou `none` para nao alterar). A deteccao de nova versao compara o `buildId` (nao o semver). O recarregar mantem a sessao.
- **Condicoes de entrada:** Frontend publicado em `/omni/`; `version.json` acessivel sem cache
- **Validacoes:** Monitoramento ativo apenas em `environment.production`; consulta a cada 5 minutos e ao focar a aba
- **Acoes do sistema:** Exibe versao/data/build no menu; botao "Atualizar sistema" recarrega a pagina; barra no topo "Nova versao disponivel" com botao Atualizar quando o `buildId` remoto muda
- **Mensagens ao usuario:** "Nova versao disponivel." na barra; "Atualizar sistema" no menu
- **Permissoes envolvidas:** Nenhuma (qualquer usuario autenticado)
- **Dados impactados:** Nenhum dado de negocio; artefato `frontend/public/version.json`
- **Rastreabilidade:** Nao exige auditoria
- **Criterios de aceite:**
  - Menu do usuario mostra Versao X.Y.Z abaixo de "Expira em" e acima de "Alterar Senha"
  - "Atualizar sistema" recarrega a aplicacao sem deslogar
  - Apos novo deploy, a barra no topo aparece (ate 5 min ou ao voltar para a aba)
  - Cada `deploy.ps1` incrementa PATCH; MINOR/MAJOR so com `-VersionBump`
- **Cenarios de excecao:** `version.json` indisponivel (menu omite a linha; recarregar ainda funciona); ambiente de desenvolvimento nao exibe a barra
- **Origem da regra:** Alinhamento com NEST_ANGULAR (banner/version.json), 2026-08-13
- **Status:** Implementada

### RN-AUTH-004 - E-mails salvos no login do aplicativo mobile
- **Modulo:** Autenticacao / Mobile
- **Fluxo:** Usuario reabre o app e escolhe um e-mail ja usado neste aparelho
- **Descricao:** Apos login bem-sucedido com a opcao "Lembrar e-mail", o app persiste localmente nome e e-mail (sem senha). Varios e-mails podem ser salvos (maximo 10, o mais recente na frente) e aparecem em carrossel horizontal na tela de login. O toque no card preenche o e-mail; a senha continua digitada. A remocao nao e feita no card (sem botao X); o usuario abre "Gerenciar e-mails", ve a lista completa e remove com confirmacao. Login por digital so aparece se o e-mail selecionado for o da biometria habilitada. O convite para ativar a digital apos login com senha pode ser ocultado por e-mail ("Nao mostrar novamente"). Logout nao apaga a lista nem essa preferencia.
- **Condicoes de entrada:** App mobile; login com credenciais validas ou biometria da conta correspondente
- **Validacoes:** E-mail normalizado (trim + minusculas); duplicata atualiza nome e vai para o inicio; limite de 10 contas; remocao exige confirmacao
- **Acoes do sistema:** Grava lista em `Preferences` (`saved_login_accounts`); preferencia do checkbox em `remember_login_email`; ocultar convite de digital em `biometric_prompt_hidden:{email}`; "Usar outro e-mail" mostra o form vazio sem apagar a lista; "Gerenciar e-mails" lista todos e permite remover
- **Mensagens ao usuario:** Confirmacao ao remover em Gerenciar e-mails: "Remover e-mail salvo?"; convite de digital com "Agora nao", "Ativar" e "Nao mostrar novamente"
- **Permissoes envolvidas:** Nenhuma (tela publica de login)
- **Dados impactados:** Somente armazenamento local do aparelho; nenhuma tabela/API
- **Rastreabilidade:** Nao exige auditoria
- **Criterios de aceite:**
  - [ ] Login com "lembrar" grava o e-mail; ao reabrir o app o card aparece
  - [ ] Dois e-mails salvos permitem deslizar e o selecionado preenche o campo
  - [ ] Remover em Gerenciar e-mails exclui so aquele; o outro permanece no carrossel
  - [ ] Senha nao e persistida na lista; digital so na conta que ativou biometria
  - [ ] Marcar "Nao mostrar novamente" e recusar o convite de digital nao exibe o alerta no proximo login daquele e-mail
  - [ ] Recusar sem marcar continua exibindo o convite; Configuracoes ainda permite ativar a digital
- **Cenarios de excecao:** Lista vazia exibe o form atual; checkbox desmarcado no "outro e-mail" nao adiciona a conta; falha de leitura do storage cai no form vazio; convite de digital oculto nao impede ativar em Configuracoes
- **Origem da regra:** Requisicao de produto (login com contas salvas), 2026-09-04
- **Status:** Implementada

### RN-AUTH-005 - Voltar na tela inicial do aplicativo mobile
- **Modulo:** Autenticacao / Mobile
- **Fluxo:** Usuario autenticado na tela inicial pressiona o botao voltar do aparelho
- **Descricao:** O voltar na home nao deve devolver o usuario autenticado a tela de login sem confirmacao. O sistema pergunta se deseja sair; cancelar mantem a sessao na home; confirmar encerra a sessao (mesmo efeito do Sair do menu) e abre o login.
- **Condicoes de entrada:** App mobile; usuario autenticado na rota `/home`
- **Validacoes:** O alerta so segue para logout se o usuario confirmar; um segundo voltar com o alerta aberto nao dispara outro logout
- **Acoes do sistema:** Intercepta o botao voltar na home; apos login bem-sucedido substitui a rota de login no historico; usuario autenticado que cair em `/login` e redirecionado para `/home`
- **Mensagens ao usuario:** Titulo "Sair do sistema"; texto "Deseja realmente sair?"; botoes "Cancelar" e "Sair"
- **Permissoes envolvidas:** Nenhuma (usuario ja autenticado)
- **Dados impactados:** Encerrar sessao no confirmar (tokens locais e chamada de logout); nenhum schema
- **Rastreabilidade:** Mesma do logout existente
- **Criterios de aceite:**
  - [ ] Na home, voltar exibe o alerta e nao abre o login sozinho
  - [ ] Cancelar permanece na home, ainda autenticado
  - [ ] Confirmar vai para o login com a sessao encerrada
  - [ ] O item Sair do menu usa a mesma pergunta
- **Cenarios de excecao:** Em telas internas (vistoria, configuracoes, sobre) o voltar continua o fluxo daquela tela; menu aberto fecha o menu antes de perguntar sair
- **Origem da regra:** Requisicao de produto (voltar na home), 2026-09-08
- **Status:** Implementada

### RN-AUTH-006 - Alterar senha no aplicativo mobile
- **Modulo:** Autenticacao / Mobile
- **Fluxo:** Usuario autenticado altera a propria senha pelo app
- **Descricao:** O app oferece a tela Alterar senha (menu e Configuracoes) usando o mesmo contrato da web (`POST /users/:id/change-password`): senha atual, nova senha e confirmacao. Complexidade igual ao cadastro (minimo 6 caracteres, letra e numero). Se o login por digital estiver ativo para o mesmo e-mail, as credenciais locais sao atualizadas com a nova senha.
- **Condicoes de entrada:** Usuario autenticado; sessao valida
- **Validacoes:** Senha atual obrigatoria; nova senha com as regras de complexidade; confirmacao deve coincidir; senha atual incorreta e recusada pela API
- **Acoes do sistema:** Chama a API com o id do usuario logado; em sucesso persiste o hash no servidor e sincroniza a senha da biometria local quando aplicavel
- **Mensagens ao usuario:** Sucesso "Senha alterada com sucesso."; senha atual errada "Senha atual incorreta."; senhas diferentes "As senhas nao conferem."; complexidade "Min. 6 caracteres, com letra e numero"
- **Permissoes envolvidas:** Nenhuma alem de estar autenticado (mesmo endpoint do web)
- **Dados impactados:** `usuarios.senha`; armazenamento local da biometria (se habilitada); nenhuma migration
- **Rastreabilidade:** Auditoria `CHANGE_PASSWORD` ja existente no interceptor da API
- **Criterios de aceite:**
  - [ ] Menu e Configuracoes abrem a tela Alterar senha
  - [ ] Senha atual incorreta nao troca a senha e exibe erro
  - [ ] Nova senha valida altera o login; a senha antiga deixa de funcionar
  - [ ] Digital habilitada continua funcionando apos a troca (mesma conta)
- **Cenarios de excecao:** Usuario sem id na sessao nao envia a requisicao; vistoria em andamento bloqueia o atalho do menu; "Esqueci minha senha" no login permanece no fluxo OTP (RN-AUTH-001)
- **Origem da regra:** Requisicao de produto (alterar senha no app), 2026-09-08
- **Status:** Implementada

### 1. Vistoria
#### Regras
- [x] RN-VIS-003 - Permissoes de acesso e acao por tela do fluxo de irregularidades
- [x] RN-VIS-004 - Registrar irregularidade SOS na web (Tratamento)
- [x] RN-VIS-005 - Desistencia da vistoria mobile com exclusao em cascata
- [x] RN-VIS-006 - Envio para manutencao com integracao OS externa (dual BRT)
- [x] RN-VIS-007 - Relatorio PDF de pendencias do veiculo
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
  - `GET /irregularidades` exige `:read` de cada etapa correspondente aos status consultados (REGISTRADA/RETRABALHO_GARANTIA/CANCELADA → tratamento; EM_MANUTENCAO → manutencao; CONCLUIDA/NAO_PROCEDE/VALIDADA → validacao final)
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
  - Percentual obrigatorio (0–100) quando o combustivel do veiculo for Eletrico (`% Bateria`) ou GNV (Gas Natural) (`% GNV (Gas Natural)`); Diesel permanece opcional/oculto; mesma regra na inclusao da vistoria no aplicativo mobile; listagens e PDF usam o rotulo dinamico conforme o combustivel
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
  - Nas filas de Tratamento, Manutencao e Validacao Final, irregularidades SOS (`origem_registro = SOS_WEB`) aparecem antes das demais; dentro de cada grupo, ordenar pela data de referencia da etapa (mais antiga primeiro)
- **Permissoes envolvidas:** `irregularidade_tratamento:create_sos`, `irregularidade_tratamento:read`; demais acoes do fluxo conforme RN-VIS-003
- **Dados impactados:** `vistorias`, `irregularidades.origem_registro`, `vistorias.origem`, `irregularidades_midias`, `irregularidade_historico`
- **Rastreabilidade:** Historico com usuario, data e tempo de etapa
- **Criterios de aceite:** Ver `docs/PLANO_IRREGULARIDADE_SOS_WEB.md`
- **Origem da regra:** Requisito de produto — irregularidade SOS web, 2026-06-08
- **Status:** Implementada

### RN-VIS-005 - Desistencia da vistoria mobile com exclusao em cascata
- **Modulo:** Vistoria
- **Fluxo:** App mobile — tela de areas e lista de vistorias em andamento na tela inicial
- **Descricao:** A vistoria mobile em andamento segue fluxo linear (inicio → areas → irregularidades → finalizar). Nao e permitido voltar da tela de areas para editar veiculo/motorista. Ao desistir, o usuario confirma exclusao permanente da vistoria e dados vinculados.
- **Condicoes de entrada:** Vistoria com `status = EM_ANDAMENTO` e origem mobile (`origem` nula).
- **Validacoes:**
  - Somente vistorias `EM_ANDAMENTO` podem ser excluidas por `POST /vistoria/:id/cancelar`
  - Vistorias `FINALIZADA` retornam erro funcional
- **Acoes do sistema:**
  - Bloquear navegacao areas → inicio; redirecionar inicio para areas quando houver vistoria ativa no fluxo
  - Exibir confirmacao antes de excluir
  - Excluir em cascata: `irregularidade_historico`, `irregularidades_midias`, `irregularidades` e `vistorias`
- **Mensagens ao usuario:** Confirmacao com aviso de exclusao permanente; erro funcional se exclusao falhar
- **Permissoes envolvidas:** `VISTORIA_UPDATE` (endpoint `cancelar` existente)
- **Dados impactados:** `vistorias`, `irregularidades`, `irregularidades_midias`, `irregularidade_historico`
- **Criterios de aceite:**
  - [ ] Botao Desistir na tela de areas nao retorna ao inicio sem exclusao
  - [ ] Confirmacao obrigatoria antes de excluir
  - [ ] Apos exclusao, vistoria nao aparece em andamento
  - [ ] Irregularidades da vistoria excluida nao permanecem no banco
- **Origem da regra:** Simplificacao do fluxo mobile — desistencia com limpeza de dados, 2026-06-11
- **Status:** Implementada

### RN-VIS-006 - Envio para manutencao com integracao OS externa (dual BRT)
- **Modulo:** Vistoria
- **Fluxo:** Tratamento (`/irregularidades/tratamento`) → Manutencao → Validacao final; registro mobile e SOS inalterados na origem
- **Descricao:** Ao enviar irregularidade para manutencao, o operador seleciona empresa de manutencao (mesmo fluxo atual). Se a empresa estiver configurada para integracao de OS (ex.: API Consorcio BRT), o sistema cria uma OS externa **sincrona** (1 irregularidade = 1 OS), persiste `os_orig` e `numOs` retornado, e so entao transiciona para `EM_MANUTENCAO`. Se a empresa **nao** usar API, mantem-se o fluxo atual (relatorio PDF/e-mail conforme parametros). Falhas de integracao mantem a irregularidade em `REGISTRADA` na tela Tratamento, com detalhes do erro para tratamento ou cancelamento. Reprovacao na validacao final move para `RETRABALHO_GARANTIA` (retrabalho/garantia) na mesma tela Tratamento; reenvio usa `os_orig` com sufixo (`numeroIrregularidade-2`, `-3`, …) para nova OS na BRT, preservando historico das tentativas anteriores. Irregularidades sob controle da API nao permitem conclusao manual na Manutencao — a saida de `EM_MANUTENCAO` para `CONCLUIDA` ocorrera por integracao de retorno (escopo v2, API ainda nao documentada). A validacao final permanece no OMNI; aprovacao marca irregularidade como corrigida no veiculo (`VALIDADA` / `resolvido` conforme regras de pendencia).
- **Condicoes de entrada:**
  - Envio: status `REGISTRADA` ou `RETRABALHO_GARANTIA`; empresa com `ehEmpresaManutencao`; permissao `irregularidade_manutencao:start`
  - Integracao BRT: empresa com tipo de integracao OS configurado e credenciais validas (`ten_emp`, `token`, URL)
  - Empresa sem API: mesmas pre-condicoes do fluxo legado (RN-VIS-003 e backlog epico 2)
- **Validacoes:**
  - Lote: cada irregularidade e processada individualmente na API; sucesso parcial e permitido (ex.: 3 em Manutencao, 2 permanecem em Tratamento com erro)
  - Resposta BRT `201` ou `200` com `duplicada: true` conta como sucesso; persistir `numOs` informado
  - Erros BRT (`credenciais_invalidas`, `tenant_divergente`, `veiculo_nao_encontrado`, `validacao`, `os_nao_encontrada`, `os_em_execucao` no cancelamento) mapeados para mensagens funcionais sem expor token
  - `os_orig` enviado à API: `numeroIrregularidade` (ex.: `20267`) no 1º envio; após OS BRT criada com sucesso (incl. cancelada depois) ou em `RETRABALHO_GARANTIA`, `numeroIrregularidade-N` com N≥2; historico em `irregularidades_os_externas`
  - Cancelamento OS BRT (`tpo_reg: 7`) na tela Manutencao: permissao `irregularidade_manutencao:cancel_os_brt`; somente irregularidade com OS ativa (`controleIntegracaoApi`, `osOrigAtual`, `numOsExternoAtual`); sucesso BRT → `REGISTRADA` (Tratamento); falha BRT → permanece `EM_MANUTENCAO`
  - E-mail de relatorio PDF: somente se flag `enviar_email_relatorio` na empresa **e** SMTP global ativo; para trilha API, enviar apos OS criada com sucesso (itens do lote que falharam na API nao entram no anexo)
  - Trilha API (`controle_integracao` / derivado da empresa no envio): bloquear `concluir-manutencao` e `marcar-nao-procede` manuais ate existir retorno integrado (v2)
  - Trilha sem API: transicoes manuais de Manutencao inalteradas
  - Reprovar validacao final: `CONCLUIDA` ou `NAO_PROCEDE` → `RETRABALHO_GARANTIA` (nao retornar direto a `EM_MANUTENCAO`)
- **Acoes do sistema:**
  - Ramificar `iniciar-manutencao` / lote por configuracao da empresa selecionada
  - Client HTTP backend para POST `https://www.api.brtgo.com.br/v1/os` (`tpo_reg: 1` criar; `tpo_reg: 7` cancelar quando aplicavel)
  - Mapear campos: `os_orig` (ver regra acima), `plc_vcl`, `tpo_srv` (ex.: SOS → socorro), `nom_sol`, `tel_ctt`, `loc_atd` (cadastro da empresa BRT), `comenta` (linha 1: area->componente->sintoma; linha 2: descricao do problema / observacao), `odo_vcl` opcional
  - Registrar historico: `enviar_api_os`, `falha_api_os`, `cancelar_api_os`, `iniciar_manutencao`, `reprovar_validacao_final`
  - Pendencias de veiculo (mobile): status `RETRABALHO_GARANTIA` continua pendente ate `VALIDADA` ou `CANCELADA` (mesma regra de exclusao de finais)
- **Mensagens ao usuario:**
  - Sucesso parcial de lote: resumo com quantidade enviada e lista de falhas com codigo/mensagem BRT
  - `veiculo_nao_encontrado`: orientar regularizacao da placa no cadastro do consorcio
  - Bloqueio de conclusao manual (trilha API): mensagem indicando aguardo de retorno da integracao
- **Permissoes envolvidas:** RN-VIS-003; `RETRABALHO_GARANTIA` exige `irregularidade_tratamento:read`; acoes de reenvio exigem `irregularidade_manutencao:start`; cancelamento OS BRT exige `irregularidade_manutencao:cancel_os_brt`
- **Dados impactados:** `empresasterceiras` (integracao, e-mail, credenciais BRT), `irregularidades` (status, flags de integracao, OS ativa), historico de OS externas (nova estrutura), `irregularidade_historico`
- **Rastreabilidade:** Historico de transicoes; log de integracao (request/response sanitizado); multiplos pares `os_orig`/`numOs` por irregularidade ao longo do tempo
- **Criterios de aceite:**
  - [ ] Empresa sem API: comportamento equivalente ao fluxo pre-integracao; e-mail respeita flag da empresa
  - [ ] Empresa BRT: OS criada → `EM_MANUTENCAO` + `numOs`; falha → permanece `REGISTRADA` com erro visivel no Tratamento
  - [ ] Lote misto documentado na UI (sucesso/falha por item)
  - [ ] Reprovar final → `RETRABALHO_GARANTIA`; reenvio gera novo `os_orig` e novo registro historico de OS
  - [ ] Trilha API: botoes de conclusao manual desabilitados/bloqueados no backend
  - [ ] Cancelamento OS BRT na Manutencao: sucesso → `REGISTRADA`; falha → permanece `EM_MANUTENCAO`; reenvio usa novo `os_orig` com sufixo
  - [ ] Aprovacao na validacao final → `VALIDADA` e pendencia do veiculo atualizada
- **Cenarios de excecao:**
  - Credenciais BRT invalidas: nenhum item do lote avanca na trilha API
  - Cancelamento de irregularidade sem OS criada: sem chamada BRT de cancelamento
  - Cancelamento OS BRT na Manutencao: somente com resposta OK da API; `409 os_em_execucao` e demais erros mantem `EM_MANUTENCAO`
  - Homologacao OMNI sem ambiente BRT: parametros de teste na empresa quando disponiveis
- **Escopo de implementacao:**
  - **v1:** envio BRT, historico OS, erros no Tratamento, status `RETRABALHO_GARANTIA`, bloqueio conclusao manual trilha API, cancelamento OS BRT na Manutencao, parametros empresa
  - **v2:** retorno integrado BRT → `CONCLUIDA`; e-mail automatico para erros de placa
- **Origem da regra:** Integracao Consorcio BRT e fluxo dual de manutencao, decisao de produto 2026-08-03
- **Status:** Implementada (retorno automático BRT → `CONCLUIDA` previsto v2)

### RN-VIS-007 - Relatorio PDF de pendencias do veiculo
- **Modulo:** Vistoria
- **Fluxo:** App mobile — tela Pendencias do Veiculo
- **Descricao:** Usuario com permissao de historico do veiculo gera PDF das irregularidades nao resolvidas do veiculo selecionado, no padrao de relatorio do sistema (logo, titulo, fotos das irregularidades, rodape com usuario e data).
- **Condicoes de entrada:** Veiculo selecionado; permissao `vistoria_web_historico_veiculo:read`.
- **Validacoes:**
  - Sem veiculo, o botao permanece desabilitado
  - Se Area e/ou Componente estiverem filtrados, o PDF lista esses filtros aplicados
  - Sem filtro, o PDF traz todas as pendencias do veiculo
- **Acoes do sistema:** `GET /vistoria/veiculo/:id/historico-irregularidades-nao-resolvidas/pdf`
- **Permissoes envolvidas:** `vistoria_web_historico_veiculo:read`
- **Dados impactados:** somente leitura (`irregularidades`, `irregularidades_midias`, `vistorias`, `veiculos`, `configuracao.logoRelatorio`)
- **Criterios de aceite:**
  - [ ] PDF com logo (quando cadastrada), veiculo/placa, lista de pendencias
  - [ ] Fotos de cada irregularidade no PDF (grade 3 colunas); sem foto, texto "Sem imagens anexadas"
  - [ ] Rodape com emissao, usuario e paginacao
  - [ ] Filtros de area/componente visiveis no PDF quando aplicados
- **Origem da regra:** Requisicao de produto — relatorio de pendencias no app, 2026-09-11
- **Status:** Implementada

### 2. Ocorrencias
#### Regras
- [ ] RN-OCO-001 - Placeholder

### 3. Manutencao
#### Regras
- [ ] RN-MAN-001 - Placeholder

### 4. Cadastros Gerais
#### Regras
- [x] RN-DOC-001 - Metadados obrigatorios do documento
- [x] RN-DOC-002 - Upload e limite de arquivo (25 MB)
- [x] RN-DOC-003 - Transicao de status
- [x] RN-DOC-004 - Exclusao de documento
- [x] RN-DOC-005 - Link publico
- [x] RN-DOC-006 - Regeneracao de token
- [x] RN-DOC-007 - Responsavel vinculado a usuario
- [x] RN-DOC-008 - Auditoria de documentos
- [x] RN-DOC-009 - Preview Excel no link publico
- [x] RN-PER-001 - Vincular e desvincular usuarios ao perfil (lista de perfis)

### RN-PER-001 - Vincular e desvincular usuarios ao perfil (lista de perfis)
- **Modulo:** Perfis / Usuarios
- **Fluxo:** Lista de perfis → acao Vincular → modal de usuarios
- **Descricao:** Na lista de perfis, e possivel adicionar usuarios ao perfil (merge, sem substituir outros perfis do usuario) e, com permissao adequada, remover o vinculo apenas com aquele perfil.
- **Condicoes de entrada:** Usuario autenticado; `perfil:read` para listar perfis; acao Vincular visivel com `perfil:assign_users` e/ou `perfil:unassign_users`.
- **Validacoes:** Vincular exige IDs de usuarios validos (UUID); desvincular exige que o usuario esteja vinculado ao perfil; apos desvincular, o usuario deve permanecer com ao menos um perfil no sistema.
- **Acoes do sistema:** `POST /perfil/:id/vincular-usuarios` adiciona o perfil a cada usuario (idempotente se ja vinculado); `POST /perfil/:id/desvincular-usuarios` remove so este perfil; `GET /perfil` retorna `totalUsuarios` e `usuariosVinculados` por perfil.
- **Mensagens ao usuario:** Erro de negocio ao remover ultimo perfil: `O usuario "{nome}" deve permanecer com ao menos um perfil` (exibida no modal, sem fechar o dialogo); demais erros HTTP com `message` da API no modal.
- **Permissoes envolvidas:** `perfil:assign_users` (vincular na lista); `perfil:unassign_users` (desmarcar/remover vinculo na lista); grupo **Perfis** no catalogo de permissoes. Migration `1744600000000-grant-perfil-vincular-usuarios-permissions` concede as duas chaves a perfis `ADMIN` (nome) e a quem ja tem `perfil:duplicate`; demais perfis exigem inclusao manual no cadastro de perfil.
- **Dados impactados:** Relacao N:N `usuarios` ↔ `perfis`
- **Criterios de aceite:** Com so `assign_users`, novos vinculos sao criados e usuarios ja vinculados nao podem ser desmarcados; com `unassign_users`, remocao atualiza contagem na lista; tentativa de remover unico perfil bloqueia com mensagem no modal; catalogo e startup validam integridade das permissoes.
- **Cenarios de excecao:** Alteracao mista (adicionar e remover na mesma confirmacao) executada em sequencia (desvincular, depois vincular) para reduzir inconsistencia; falha na primeira etapa impede a segunda.
- **Origem da regra:** Fluxo espelhado OMNI / lista de perfis, 2026-08-04
- **Status:** Implementada

### RN-DOC-001 - Metadados obrigatorios
- **Modulo:** Documentos
- **Fluxo:** Cadastro de documento
- **Descricao:** Nome do documento, tipo, departamento e responsavel (usuario ativo) sao obrigatorios na criacao.
- **Validacoes:** Tipo e departamento devem existir; tipo deve estar ativo; responsavel deve existir e estar ativo. Combo de departamento lista todos os departamentos cadastrados (nao restringe por vinculo do usuario nem exige `departamento:read`). Campo opcional `detalhesDocumento` (ate 2000 caracteres). Nome padrao do arquivo para download: `TIPO.NOME.DEPARTAMENTO.extensao`.
- **Mensagens ao usuario:** Erros 400 com mensagem funcional clara.
- **Permissoes envolvidas:** `documento:create`, `documento:update`
- **Dados impactados:** `documentos`, `tipos_documento`, `departamentos`, `usuarios`
- **Status:** Implementada

### RN-DOC-002 - Upload e limite de arquivo
- **Modulo:** Documentos
- **Fluxo:** Upload/substituicao de arquivo
- **Descricao:** Upload obrigatorio na criacao; substituicao permitida na edicao quando status permitir.
- **Validacoes:** Tamanho maximo 25 MB; MIME PDF, Word, Excel, PNG, JPEG.
- **Mensagens ao usuario:** "Arquivo excede o limite maximo de 25 MB"; "Tipo de arquivo nao permitido..."
- **Permissoes envolvidas:** `documento:create`, `documento:update`
- **Dados impactados:** `documentos.dadosBytea`, `documentos.mimeType`, `documentos.tamanho`
- **Status:** Implementada

### RN-DOC-003 - Transicao de status
- **Modulo:** Documentos
- **Fluxo:** Edicao de documento
- **Descricao:** Documento Obsoleto ou Arquivado nao permite edicao de metadados/arquivo; permite alterar status para Em Revisao.
- **Validacoes:** Bloqueio de PATCH de campos exceto reabertura via status Em Revisao.
- **Permissoes envolvidas:** `documento:update`
- **Status:** Implementada

### RN-DOC-004 - Exclusao
- **Modulo:** Documentos
- **Fluxo:** Exclusao
- **Descricao:** Exclusao fisica exige `documento:delete`; recomenda-se status Arquivado.
- **Permissoes envolvidas:** `documento:delete`
- **Status:** Implementada

### RN-DOC-005 - Link publico
- **Modulo:** Documentos
- **Fluxo:** Compartilhamento publico
- **Descricao:** Link publico funciona apenas para status Ativo, `compartilhamentoAtivo=true`, token valido e nao expirado (expiracao opcional).
- **Permissoes envolvidas:** endpoint publico sem JWT; gestao exige `documento:compartilhar`
- **Status:** Implementada

### RN-DOC-006 - Regeneracao de token
- **Modulo:** Documentos
- **Fluxo:** Compartilhamento publico
- **Descricao:** Regenerar token invalida link anterior imediatamente; acao auditada.
- **Permissoes envolvidas:** `documento:compartilhar`
- **Status:** Implementada

### RN-DOC-007 - Responsavel
- **Modulo:** Documentos
- **Fluxo:** Cadastro/edicao
- **Descricao:** Responsavel e sempre um usuario do sistema (`usuarios.id`).
- **Permissoes envolvidas:** `documento:create`, `documento:update`; busca de usuarios para autocomplete
- **Status:** Implementada

### RN-DOC-008 - Auditoria
- **Modulo:** Documentos
- **Fluxo:** CRUD e compartilhamento
- **Descricao:** Auditar create/update/delete, substituicao de arquivo e ativar/desativar/regenerar compartilhamento.
- **Permissoes envolvidas:** `documento:audit` para consulta de historico
- **Status:** Implementada

### RN-DOC-009 - Preview Excel no link publico
- **Modulo:** Documentos
- **Fluxo:** Acesso publico via token (`/documentos/publico/:token`)
- **Descricao:** Planilhas Excel exibem preview completo em memoria (limite do arquivo: 25 MB), com primeira linha como cabecalho fixo, filtros por coluna e paginacao de 300 linhas por pagina. Colunas de data exibem `dd/mm/aaaa` com filtro por intervalo (De/Até); colunas de valor exibem `R$` com filtro por intervalo (Mín/Máx); demais colunas usam filtro texto + dropdown. Usuario pode redimensionar largura das colunas e limpar filtro individual por coluna.
- **Validacoes:** Primeira linha da aba tratada como cabecalho; filtros aplicados no cliente antes da paginacao; download continua entregando arquivo integral.
- **Mensagens ao usuario:** "Nenhuma linha corresponde aos filtros aplicados"; contador "Exibindo X–Y de Z linhas".
- **Permissoes envolvidas:** Nenhuma (rota publica)
- **Status:** Implementada

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
- 2026-09-11: RN-VIS-007 Relatorio PDF de pendencias do veiculo (app), com logo, fotos das irregularidades, filtros de area/componente e usuario no rodape.
- 2026-09-11: RN-VIS-004 Percentual obrigatorio na vistoria (app e SOS) para combustivel Eletrico e GNV, com rotulo dinamico; Diesel permanece opcional.
- 2026-09-08: RN-AUTH-006 Alterar senha no aplicativo mobile (mesmo contrato da web).
- 2026-09-08: RN-AUTH-004 Limite de e-mails salvos no login mobile de 5 para 10.
- 2026-09-08: RN-AUTH-005 Voltar na home do mobile pergunta se deseja sair do sistema (nao retorna ao login sem confirmacao).
- 2026-09-08: RN-AUTH-004 Convite de digital apos login pode ser ocultado por e-mail ("Nao mostrar novamente").
- 2026-09-04: RN-AUTH-004 E-mails salvos no login mobile (carrossel local, sem senha).
- 2026-08-13: RN-AUTH-003 Versao do frontend no menu do usuario, barra de nova versao e PATCH automatico no `deploy.ps1`.
- 2026-08-04: RN-PER-001 Vincular/desvincular usuarios ao perfil; migration concede assign/unassign a ADMIN e perfis com `perfil:duplicate`.
- 2026-08-03: RN-VIS-006 Integracao OS externa (dual BRT), status RETRABALHO_GARANTIA, matriz de transicoes atualizada em BACKLOG; RN-VIS-003 ampliada para RETRABALHO_GARANTIA na etapa Tratamento.
- 2026-06-23: RN-DOC-001 Campo opcional detalhesDocumento; correcao de edicao de tipo; nome de arquivo TIPO.NOME.DEPARTAMENTO.
- 2026-06-23: RN-DOC-001 Listagem de departamentos no cadastro de documentos disponivel com permissoes de documento (sem exigir `departamento:read`).
- 2026-06-17: RN-DOC-009 Preview Excel no link publico com cabecalho fixo, filtros por coluna e paginacao de 300 linhas.
- 2026-06-16: RN-DOC-001 a RN-DOC-008 Cadastro de documentos (tipo, metadados, upload bytea 25MB, link publico com token e expiracao opcional).
- 2026-06-11: RN-VIS-004 Prioridade de listagem: irregularidades SOS no topo das filas do fluxo; demais itens por data de referencia da etapa (mais antiga primeiro).
- 2026-06-11: RN-VIS-005 Desistencia da vistoria mobile bloqueia volta ao inicio e exclui vistoria em andamento em cascata (como SOS).
- 2026-06-08: RN-VIS-004 Cancelamento SOS passa a excluir registros do banco (vistoria e irregularidades), sem marcar CANCELADA.
- 2026-06-08: RN-VIS-004 Registro de irregularidade SOS na web (Tratamento), vistoria pai automatica, origem SOS, filtro e badge no fluxo.
- 2026-05-21: RN-VIS-003 Permissoes de acesso (`:read`) e acao separadas por tela do fluxo de irregularidades (Tratamento, Manutencao, Validacao); grupos no cadastro de perfis.
- 2026-05-06: RN-VIS-002 Descricao obrigatoria ao registrar/editar irregularidade na vistoria (app mobile + API `observacao`), com validacao trim e UX acessivel.
- 2026-04-27: RN-AUTH-001 Recuperacao de senha por OTP (e-mail), web e mobile.
- 2026-04-22: Criacao do template inicial.
