# Atualização Lista de Veículos - Novos Campos

## Mudanças Implementadas

### Frontend - Componente `veiculo-list`

#### `veiculo-list.ts`

**Imports:**
- Adicionado import de `StatusVeiculo`

**Propriedades:**
- `statusFilter: string` - Filtro por status
- `marcaCarroceriaFilter: string` - Filtro por marca da carroceria
- `modeloCarroceriaFilter: string` - Filtro por modelo da carroceria
- `statusOptions: StatusVeiculo[]` - Opções de status para select

**Métodos Atualizados:**
1. `loadItems()` - Adicionados filtros para: status, marcaDaCarroceria, modeloDaCarroceria
2. `clearFilters()` - Limpa os 3 novos filtros
3. `loadAllItemsForExport()` - Inclui os 3 novos filtros na exportação
4. `getExportDataExcel()` - Adicionadas 3 colunas na exportação: Status, Marca Carroceria, Modelo Carroceria
5. `getExportDataPDF()` - Adicionadas 3 colunas na exportação: Status, Marca Carroceria, Modelo Carroceria

#### `veiculo-list.html`

**Filtros Adicionados:**
- Select para filtrar por **Status** (com opções do enum)
- Input text para filtrar por **Marca da Carroceria**
- Input text para filtrar por **Modelo da Carroceria**

**Colunas da Tabela:**
- Adicionada coluna **Status** (exibe '-' se não preenchido)
- Adicionada coluna **Marca Carroceria** (exibe '-' se não preenchido)
- Adicionada coluna **Modelo Carroceria** (exibe '-' se não preenchido)

**Modal de Auditoria:**
- Atualizado `fieldLabels` para incluir os 3 novos campos com suas labels em português

## Funcionalidades

✅ **Filtros Funcionais:**
- Filtrar veículos por Status (ATIVO/INATIVO)
- Filtrar veículos por Marca da Carroceria
- Filtrar veículos por Modelo da Carroceria
- Todos os filtros funcionam em tempo real (com debounce)

✅ **Grid Atualizada:**
- 10 colunas na tabela (antes eram 7)
- Exibe os 3 novos campos de forma clara
- Mantém compatibilidade com veículos antigos (valores vazios mostram '-')

✅ **Exportação:**
- Excel exporta os 10 campos
- PDF exporta os 10 campos
- Filtros são respeitados na exportação

✅ **Auditoria:**
- Modal de auditoria mostra alterações nos 3 novos campos
- Labels em português para melhor legibilidade

## Estrutura de Filtros

```
Filtros Básicos:
├─ Descrição
├─ Placa
├─ Ano
├─ Marca
├─ Modelo
├─ Combustível
├─ Status ⭐ NEW
├─ Marca da Carroceria ⭐ NEW
└─ Modelo da Carroceria ⭐ NEW
```

## Estrutura de Colunas

```
┌─────────────────────────────────────────────────────────────────┐
│ Descrição │ Placa │ Ano │ Chassi │ Marca │ Modelo │ Combustível │
│ Status ⭐ │ Marca Carroceria ⭐ │ Modelo Carroceria ⭐ │ Ações │
└─────────────────────────────────────────────────────────────────┘
```

## Notas

- Sistema pronto para produção
- Sem erros de compilação
- Compatível com dados existentes
- Filtros opcionais (não afetam registros sem os campos preenchidos)
