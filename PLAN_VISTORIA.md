# Plano de Desenvolvimento - Vistoria (Mobile/Backend/Frontend)

## Fases
1) Cadastro: TipoVistoria + ItensVistoriados (backend + frontend).
2) Mobile: fluxo completo de vistoria.

## Escopo e Regras de Negócio
- Mostrar itens do checklist por `sequencia`.
- Exibir apenas itens cujo `tiposvistorias` contenha o `idtipovistoria` da vistoria.
- Se `conforme=false` e `obrigafoto=true`, foto é obrigatória.
- `datavistoria` é carregada automaticamente no app (data e hora) e não é editável.
- `tempo` é calculado no app (em minutos).
- Vistoria possui `status` para controle de fluxo: `EM_ANDAMENTO`, `FINALIZADA`, `CANCELADA`.
- `datavistoria` deve usar hora do servidor (`GET /system/time`) e fallback local.

## Modelagem (todas herdam `baseentity`, campos em minúsculo)
### tipovistoria
- descricao (varchar 300)
- ativo (booleano)

### itemvistoriado
- descricao (varchar 300)
- sequencia (numero)
- tiposvistorias (array de ids de `tipovistoria`)
- obrigafoto (booleano)
- ativo (booleano)

### vistoria
- idveiculo (uuid, FK → tabela de veículos existente)
- idmotorista (uuid, FK → tabela de motoristas existente)
- odometro (numeric(10,2) ou integer)
- porcentagembateria (numeric(5,2) ou integer)
- idtipovistoria (uuid)
- datavistoria (timestamp enviado pelo app)
- tempo (integer, minutos)
- observacao (text)
- status (enum: `EM_ANDAMENTO`, `FINALIZADA`, `CANCELADA`)

### imagensvistoria
- nome_arquivo (varchar 255)
- tamanho (bigint)
- dados_bytea (bytea)

### checklistvistoria
- idvistoria (FK → vistoria)
- iditemvistoriado
- conforme (booleano)
- observacao (texto)
- imagens (1:N via `imagensvistoria`)

## Índices e Validações
- Índice GIN em `itemvistoriado.tiposvistorias`.
- Validar `tiposvistorias` (array não vazio e ids válidos).
- `odometro` > 0.
- `porcentagembateria` entre 0 e 100.
- `sequencia` numérica e consistente por tipo.

## Matriz de Validações
### Vistoria
- idveiculo: obrigatório (uuid válido, FK → tabela de veículos existente)
- idmotorista: obrigatório (uuid válido, FK → tabela de motoristas existente)
- odometro: obrigatório, > 0
- porcentagembateria: obrigatório, 0–100
- idtipovistoria: obrigatório (uuid válido, FK → tipovistoria)
- datavistoria: obrigatório (datetime ISO)
- tempo: obrigatório, > 0
- observacao: opcional

### ItemVistoriado
- descricao: obrigatório, máx 300
- sequencia: obrigatório, inteiro > 0
- tiposvistorias: obrigatório, array não vazio, ids válidos
- obrigafoto: obrigatório (boolean)
- ativo: obrigatório (boolean)

### ChecklistVistoria
- idvistoria: obrigatório
- iditemvistoriado: obrigatório
- conforme: obrigatório (boolean)
- observacao: opcional
- fotos: obrigatório se conforme=false e obrigafoto=true (upload multipart separado)

### ImagensVistoria
- nome_arquivo: obrigatório
- tamanho: obrigatório (>0)
- dados_bytea: obrigatório
- idchecklistvistoria (FK)

## Endpoints (mínimos)
- `GET /system/time`
- `GET /tiposvistoria`
- `POST /tiposvistoria`
- `GET /itemvistoriado?tipovistoria=ID`
- `POST /itemvistoriado`
- `POST /vistoria` (início)
- `POST /vistoria/:id/checklist` (incremental por item, sem imagens)
- `POST /vistoria/:id/checklist/:checklistId/imagens` (multipart)
- `POST /vistoria/:id/finalizar`
- `POST /vistoria/:id/cancelar`
- `POST /vistoria/:id/retomar`
- `GET /vistoria?status=EM_ANDAMENTO`
- `GET /vistoria/:id`

## Telas (Frontend Admin)
### Cadastro TipoVistoria
- descricao, ativo

### Cadastro ItemVistoriado
- descricao
- sequencia
- tiposvistorias (combo multi-select com check)
- obrigafoto
- ativo

## Fluxo Mobile (detalhado)
### Tela 1 - Início
- veículo, motorista, odometro, % bateria, tipo de vistoria
- `datavistoria` pré-preenchida via serverTime (sem edição)
- iniciar cronômetro
- buscar veículos/motoristas apenas com status ativo
- opção de continuar vistoria em andamento

### Tela 2 - Checklist
- carregar itens filtrados por `idtipovistoria` e `ativo=true`
- ordenar por `sequencia`
- marcar `conforme`, `observacao`
- exigir foto quando necessário
- enviar cada item do checklist para o backend (incremental) e upload de fotos em multipart
- permitir múltiplas fotos por item
- opção de cancelar vistoria

### Tela 3 - Finalizar
- observação geral
- tempo total em minutos
- finalizar vistoria (tempo + observação geral)

## Backlog
### Fase 1 - Cadastros (Backend + Frontend)
- [ ] CRUD `tipovistoria`
- [ ] CRUD `itemvistoriado` (multi-select `tiposvistorias`)
- [ ] Endpoint checklist por tipo (ordenado por `sequencia`)

### Fase 2 - Mobile
- [ ] Fluxo mobile completo (tela inicial, checklist, finalizar)
- [ ] Endpoint `POST /vistoria` (início)
- [ ] Endpoint `POST /vistoria/:id/checklist` (incremental por item)
- [ ] Endpoint `POST /vistoria/:id/checklist/:checklistId/imagens` (multipart)
- [ ] Endpoint `POST /vistoria/:id/finalizar` (tempo + observação)
- [ ] Endpoint `POST /vistoria/:id/cancelar` (status)
- [ ] Endpoint `POST /vistoria/:id/retomar` (status)
- [ ] Endpoint `GET /vistoria?status=EM_ANDAMENTO`
- [ ] Upload/armazenamento de imagens (multipart, múltiplas por item)
- [ ] Validações essenciais (odometro, bateria, tipos, obrigafoto)
- [ ] Permissões no app baseadas nas permissões do backend
- [ ] Status e retomada de vistoria no app (continuar fluxo)

## Concluído
- [x] Regras de negócio definidas
- [x] Decisão: `tiposvistorias` como array de ids em `itemvistoriado`

## Observações
- Túnel DEV: https://api-dev.sistemasfarmamais.com/api
- Túnel PROD: https://api.sistemasfarmamais.com/api
- Emulador e celular físico devem usar túnel DEV durante testes.
