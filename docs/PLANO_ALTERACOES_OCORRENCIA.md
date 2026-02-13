# Plano de Alterações no Processo de Ocorrência

## Objetivo
Implementar melhorias no cadastro de ocorrências, incluindo novos campos, cadastros auxiliares e ajustes no formulário de motorista.

---

## Parte 1 - Alterações no Frontend (Label do Campo Tipo)

### 1.1 Alterar label "Tipo de Ocorrência" para "Classificação da Ocorrência"
- **Arquivo**: `frontend/src/app/components/ocorrencia-form/ocorrencia-form.html`
- **Ação**: Alterar o label do campo `tipo` de "Tipo de Ocorrência *" para "Classificação da Ocorrência *"

---

## Parte 2 - Novos Cadastros (Backend + Frontend)

### 2.1 Cadastro de Origem da Ocorrência

#### Backend
- **Entidade**: `backend/src/modules/origem-ocorrencia/entities/origem-ocorrencia.entity.ts`
  - Estender `BaseEntity`
  - Campo `descricao` (varchar 300, obrigatório)
  - Índice em `descricao` (único)
- **DTOs**: Create e Update
- **Service**: CRUD completo
- **Controller**: Endpoints REST com permissões
- **Module**: Registrar módulo e importar em `app.module.ts`
- **Migration**: Tabela `origensocorrencia`

#### Frontend
- Componente form + list, service, model, rota
- **Menu**: Item no submenu "Ocorrência"

### 2.2 Cadastro de Categoria da Ocorrência

#### Backend
- **Entidade**: `categoria-ocorrencia` com `descricao`, `idOrigem` (FK), `responsavel`
- **Service**: CRUD + `findByOrigem(idOrigem)`
- **Controller**: GET com query `?origem=ID`
- **Migration**: Tabela `categoriasocorrencia`

#### Frontend
- Componente form + list, filtro por origem
- **Menu**: Item no submenu "Ocorrência"

### 2.3 Cadastro de Empresas Terceiras

#### Backend
- **Entidade**: `empresa-terceira` com `descricao` (BaseEntity)
- **Migration**: Tabela `empresasterceiras`

#### Frontend
- Componente form + list
- **Menu**: Item no submenu "Ocorrência"

---

## Parte 3 - Alterações na Entidade Ocorrência

### 3.1 Campos a adicionar
- `idOrigem` (uuid, FK origensocorrencia)
- `idCategoria` (uuid, FK categoriasocorrencia)
- `processoSei` (varchar 50)
- `numeroOrcamento` (varchar 50)
- `idEmpresaDoMotorista` (uuid, FK empresasterceiras)
- `idUsuario` (uuid, FK usuarios) — setado automaticamente com usuário logado

### 3.2 Regras
- Categoria filtrada pela origem selecionada
- idUsuario setado no backend com usuário logado
- Se motorista tem empresa, usar automaticamente e desabilitar campo

---

## Parte 4 - Formulário de Ocorrência (Frontend)

### 4.1 Novos campos
- idOrigem: combobox (origens)
- idCategoria: combobox (categorias filtradas por origem; habilitar só se origem selecionada)
- processoSei: texto 50 chars
- numeroOrcamento: texto 50 chars
- idEmpresaDoMotorista: combobox (empresas); desabilitado se motorista já tem empresa

---

## Parte 5 - Formulário de Motorista

### 5.1 Backend
- Campo `idEmpresa` (uuid, FK empresasterceiras) na entity Motorista

### 5.2 Frontend
- Combobox Empresa no form motorista

---

## Parte 6 - Permissões e Menu

- Novas permissões: ORIGEMOCORRENCIA_*, CATEGORIAOCORRENCIA_*, EMPRESATERCIRA_*
- Itens no menu Ocorrência: Origem da Ocorrência, Categoria da Ocorrência, Empresas Terceiras

---

## Ordem de Implementação

1. Backend: migrations + módulos Origem, Categoria, Empresa
2. Backend: alterações Ocorrência e Motorista
3. Backend: permissões
4. Frontend: cadastros (Origem, Categoria, Empresa) + menu
5. Frontend: form ocorrência + form motorista
6. Label "Classificação da Ocorrência"

---

## Checklist de Implementação (concluído)

### Backend
- [x] Migration `1739280000000-create-origem-categoria-empresa-ocorrencia.ts` (origensocorrencia, categoriasocorrencia, empresasterceiras + colunas em ocorrencias e motoristas)
- [x] Módulo Origem Ocorrência (entity, DTOs, service, controller, module)
- [x] Módulo Categoria Ocorrência (entity, DTOs, service, controller, module, findByOrigem)
- [x] Módulo Empresa Terceira (entity, DTOs, service, controller, module)
- [x] Permissões ORIGEMOCORRENCIA_*, CATEGORIAOCORRENCIA_*, EMPRESATERCIRA_*
- [x] Entity Ocorrência: idOrigem, idCategoria, processoSei, numeroOrcamento, idEmpresaDoMotorista, idUsuario
- [x] Entity Motorista: idEmpresa
- [x] OcorrenciaService: create(dto, idUsuario), validação categoria/origem, relações no find
- [x] OcorrenciaController: passar req.user.id no create
- [x] MotoristaService: findOne e findAll com relation empresa

### Frontend
- [x] Models e services: origem-ocorrencia, categoria-ocorrencia, empresa-terceira
- [x] Componentes list/form para Origem, Categoria, Empresa
- [x] Rotas e itens no menu Ocorrência
- [x] Permissões no frontend (usuario.model)
- [x] Form Ocorrência: idOrigem, idCategoria (filtrado por origem), processoSei, numeroOrcamento, idEmpresaDoMotorista; motoristaComEmpresa; label "Classificação da Ocorrência"
- [x] Form Motorista: idEmpresa (combobox empresas)
- [x] Model Ocorrencia e CreateOcorrenciaDto com novos campos
- [x] Model Motorista com idEmpresa e empresa
