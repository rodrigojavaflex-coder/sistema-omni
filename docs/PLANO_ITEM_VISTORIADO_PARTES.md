# Plano de desenvolvimento - Item Vistoriado e Partes do Veiculo

## Parte 1 - Desenvolvimento frontend e backend

### 1) Cadastro de Modelo
- Backend
  - Criar entidade/tabela `ModeloVeiculo` com campos de `BaseEntidade` e `descricao`.
  - Criar endpoints CRUD.
- Frontend
  - Tela de cadastro/listagem de modelos (campo `descricao`).

### 2) Vinculo obrigatorio no veiculo
- Backend
  - Manter o campo antigo `modelo` no banco (sem remover por enquanto).
  - Criar `modelo_id` (FK para `ModeloVeiculo`) como obrigatorio.
  - Validar `modelo_id` nas operacoes de veiculo.
- Frontend
  - Remover o campo antigo do formulario.
  - Adicionar select obrigatorio baseado em `ModeloVeiculo`.

### 3) Listagem de veiculo
- Backend
  - Ajustar retorno da listagem para trazer `modelo.descricao`.
- Frontend
  - Exibir `modelo.descricao` na listagem.

### 4) Cadastro de Parte do Modelo
- Backend
  - Criar tabela `ParteDoModelo`:
    - `id`, `modelo_id`, `descricao`, `imagem_da_parte`
  - Criar tabela `ItemVistoriadodaPartedoModelo`:
    - `item_vistoriado_id`, `parte_do_modelo_id`
  - Endpoints CRUD.
- Frontend
  - Tela de cadastro de `ParteDoModelo`.
  - Selecionar modelo e vincular itens vistoriados.

## Parte 2 - Ajustes no checklist

### 1) Regra de busca de partes no checklist
- Checklist carrega `PartesDoModelo` do veiculo.
- Filtra somente as partes vinculadas em `ItemVistoriadodaPartedoModelo` para o item vistoriado.

### 2) Registro da parte no checklist
- Para cada item vistoriado, o app grava as partes do veiculo em `ChecklistItemParte`.
- Exemplo: Item "Avaria" -> partes: lataria, farois, vidros.

### 3) Conformidade (por parte)
- `ChecklistItemParte` armazena `parte_do_modelo_id` e `conformidade`.
- `ChecklistItemFoto` referencia `checklist_item_parte_id` e armazena as fotos.

## Parte 3 - Cadastro de parte no mobile + compatibilidade da foto

### 1) Cadastro de ParteDoModelo no mobile
- Tela no mobile para:
  - Selecionar modelo
  - Informar descricao
  - Capturar foto da parte

### 2) Compatibilidade do tipo de foto
- Backend deve aceitar a foto da parte no mesmo formato das fotos do checklist:
  - Mesmo padrao de upload
  - Mesmo tratamento de compressao/tamanho
  - Mesmo tipo de armazenamento

### 3) Reuso de upload
- Reutilizar a mesma logica de upload do checklist para manter consistencia.
