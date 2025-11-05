# Adição de Novos Campos à Tabela Veiculos

## Resumo das Mudanças

### Backend

#### 1. Novo Enum: `status-veiculo.enum.ts`
- Criado em: `src/common/enums/status-veiculo.enum.ts`
- Valores: `ATIVO`, `INATIVO`

#### 2. Entidade Veiculo (`veiculo.entity.ts`)
Adicionados 3 novos campos:
- `status` (StatusVeiculo, default: ATIVO)
- `marcaDaCarroceria` (varchar 50, nullable)
- `modeloDaCarroceria` (varchar 50, nullable)

#### 3. DTO de Criação (`create-veiculo.dto.ts`)
- Adicionado import do enum `StatusVeiculo`
- Adicionados validadores para os 3 novos campos
- `status`: enum, opcional (default ATIVO)
- `marcaDaCarroceria`: string opcional, máx 50 caracteres
- `modeloDaCarroceria`: string opcional, máx 50 caracteres

#### 4. DTO de Busca (`find-veiculo.dto.ts`)
- Adicionado import do enum `StatusVeiculo`
- Adicionadas propriedades de filtro para os 3 novos campos

#### 5. DTO de Atualização (`update-veiculo.dto.ts`)
- Herda automaticamente via `PartialType` do CreateVeiculoDto

#### 6. Script SQL Manual (`migration-manual.sql`)
```sql
ALTER TABLE veiculos ADD COLUMN status character varying(20) DEFAULT 'ATIVO' NOT NULL;
ALTER TABLE veiculos ADD COLUMN "marcaDaCarroceria" character varying(50);
ALTER TABLE veiculos ADD COLUMN "modeloDaCarroceria" character varying(50);
CREATE INDEX IDX_VEICULO_STATUS ON veiculos(status);
```

### Frontend

#### 1. Modelo Veiculo (`veiculo.model.ts`)
- Adicionado enum `StatusVeiculo`
- Adicionadas propriedades aos interfaces: `Veiculo`, `CreateVeiculoDto`, `UpdateVeiculoDto`, `FindVeiculoDto`

#### 2. Componente Formulário (`veiculo-form.ts`)
- Adicionado import de `StatusVeiculo`
- Adicionada property `statusOptions`
- Adicionados campos ao form: `status`, `marcaDaCarroceria`, `modeloDaCarroceria`
- Adicionados getters para os novos campos
- Atualizado `loadEntityById` para popular os novos campos

#### 3. Template Formulário (`veiculo-form.html`)
- Adicionado select para `status` com os valores do enum
- Adicionado input text para `marcaDaCarroceria`
- Adicionado input text para `modeloDaCarroceria`

## Próximas Ações

1. **Executar Script SQL** no banco de dados para adicionar os campos
2. **Atualizar Backend** para usar as mudanças (já feito)
3. **Testar API** com os novos campos
4. **Atualizar Lista de Veículos** (veiculo-list.ts/html) para exibir os novos campos se necessário
5. **Atualizar Filtros** na lista se quiser filtrar por status, marca ou modelo da carroceria

## Notas

- **Sem Migração TypeORM**: As mudanças foram feitas sem criar arquivos de migração (conforme solicitado)
- **Script SQL Manual**: Deve ser executado manualmente no banco de dados
- **Compatibilidade**: As mudanças são retrocompatíveis - campos opcionais não quebram dados existentes
- **Status Padrão**: Novo campo `status` tem valor padrão `ATIVO`
- **Nullable**: `marcaDaCarroceria` e `modeloDaCarroceria` são opcionais (nullable)
