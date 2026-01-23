# Plano de Desenvolvimento - Vistoria (Mobile/Backend/Frontend)

## Fases
1) Migração: criação das tabelas e vínculos.
2) Cadastro: TipoVistoria + ItensVistoriados (backend + frontend).
3) Mobile: fluxo completo de vistoria.

## Escopo e Regras de Negócio
- Mostrar itens do checklist por `sequencia`.
- Exibir apenas itens cujo `tiposvistorias` contenha o `idtipovistoria` da vistoria.
- Se `conforme=false` e `obrigafoto=true`, foto é obrigatória.
- `datavistoria` é carregada automaticamente no app (data e hora) e o usuário pode editar.
- `tempo` é calculado no app (em minutos).

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

### imagensvistoria
- nome_arquivo (varchar 255)
- tamanho (bigint)
- dados_bytea (bytea)

### checklistvistoria
- idvistoria (FK → vistoria)
- iditemvistoriado
- conforme (booleano)
- observacao (texto)
- idimagensvistoria (FK)

## Índices e Validações
- Índice GIN em `itemvistoriado.tiposvistorias`.
- Validar `tiposvistorias` (array não vazio e ids válidos).
- `odometro` > 0.
- `porcentagembateria` entre 0 e 100.
- `sequencia` numérica e consistente por tipo.

## Matriz de Validações
### Vistoria
- idveiculo: obrigatório (uuid válido)
- idmotorista: obrigatório (uuid válido)
- odometro: obrigatório, > 0
- porcentagembateria: obrigatório, 0–100
- idtipovistoria: obrigatório (uuid válido)
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
- idimagensvistoria: obrigatório se conforme=false e obrigafoto=true

### ImagensVistoria
- nome_arquivo: obrigatório
- tamanho: obrigatório (>0)
- dados_bytea: obrigatório

## Endpoints (mínimos)
- `GET /tipovistoria`
- `POST /tipovistoria`
- `GET /itemvistoriado?tipovistoria=ID`
- `POST /itemvistoriado`
- `POST /vistoria` (inclui checklist + imagens)
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
- `datavistoria` pré-preenchida (data/hora atual) com opção de editar
- iniciar cronômetro

### Tela 2 - Checklist
- carregar itens filtrados por `idtipovistoria`
- ordenar por `sequencia`
- marcar `conforme`, `observacao`
- exigir foto quando necessário

### Tela 3 - Finalizar
- observação geral
- tempo total em minutos
- enviar vistoria + checklist + imagens

## Backlog
### Fase 1 - Migração
- [ ] Definir entidades e migrations
- [ ] Criar índice GIN para `tiposvistorias`

### Fase 2 - Cadastros (Backend + Frontend)
- [ ] CRUD `tipovistoria`
- [ ] CRUD `itemvistoriado` (multi-select `tiposvistorias`)
- [ ] Endpoint checklist por tipo (ordenado por `sequencia`)

### Fase 3 - Mobile
- [ ] Fluxo mobile completo (tela inicial, checklist, finalizar)
- [ ] Endpoint `POST /vistoria` com checklist e imagens
- [ ] Upload/armazenamento de imagens
- [ ] Validações essenciais (odometro, bateria, tipos, obrigafoto)

## Concluído
- [x] Regras de negócio definidas
- [x] Decisão: `tiposvistorias` como array de ids em `itemvistoriado`

## Observações
- Túnel DEV: https://api-dev.sistemasfarmamais.com/api
- Túnel PROD: https://api.sistemasfarmamais.com/api
- Emulador e celular físico devem usar túnel DEV durante testes.
