# 📋 Template Base Backend - Padrões para Novos Módulos

> **Documento de Referência para Criar Novos Módulos NestJS + TypeORM**
>
> Versão: 1.0 | Data: 09/11/2025

---

## 📑 Índice

1. [Estrutura de Diretórios](#estrutura-de-diretórios)
2. [Padrões de Entidades](#padrões-de-entidades)
3. [Padrões de DTOs](#padrões-de-dtos)
4. [Padrões de Serviços](#padrões-de-serviços)
5. [Padrões de Controllers](#padrões-de-controllers)
6. [Padrões de Módulos](#padrões-de-módulos)
7. [Boas Práticas](#boas-práticas)
8. [Checklist de Implementação](#checklist-de-implementação)

---

## 🗂️ Estrutura de Diretórios

```
backend/src/modules/[nome-modulo]/
├── dto/
│   ├── create-[nome].dto.ts
│   └── update-[nome].dto.ts
├── entities/
│   └── [nome].entity.ts
├── [nome].controller.ts
├── [nome].module.ts
└── [nome].service.ts
```

**Exemplo Concreto:**
```
backend/src/modules/veiculo/
├── dto/
│   ├── create-veiculo.dto.ts
│   └── update-veiculo.dto.ts
├── entities/
│   └── veiculo.entity.ts
├── veiculo.controller.ts
├── veiculo.module.ts
└── veiculo.service.ts
```

---

## 🔧 Padrões de Entidades

### ✅ Entity - Boas Práticas

```typescript
// backend/src/modules/[nome]/entities/[nome].entity.ts

import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { OutraEntidade } from '../../outra-entidade/entities/outra-entidade.entity';

@Entity('[nomes-plurais]')
@Index(['status'])
@Index(['atualizadoEm'])
export class [NomeEntidade] extends BaseEntity {
  
  // ===== Atributos Simples =====
  
  @Column({ type: 'varchar', length: 150, nullable: false })
  nome: string;

  @Column({ type: 'text', nullable: true })
  descricao?: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  codigo: string;

  @Column({ 
    type: 'enum', 
    enum: ['ATIVO', 'INATIVO'],
    default: 'ATIVO'
  })
  status: string;

  // ===== Relações =====
  
  /**
   * IMPORTANTE: Usar eager: false (ou não declarar, pois é o padrão)
   * Nunca use eager: true para evitar conflitos com Object.assign() e cache
   */
  @ManyToOne(() => OutraEntidade, { nullable: false, eager: false })
  @JoinColumn({ name: 'idOutraEntidade' })
  outraEntidade: OutraEntidade;

  @Column({ type: 'uuid', nullable: false })
  idOutraEntidade: string;

  // OneToMany não precisa de eager, carrega sob demanda
  @OneToMany(() => EntidadeFilha, (filha) => filha.[nomeEntidade], { lazy: true })
  filhas?: EntidadeFilha[];

  // ===== Métodos Estáticos =====
  
  static get nomeAmigavel(): string {
    return '[Nome Entidade]';
  }
}
```

### ⚠️ Alertas Para Entidades

| ❌ EVITE | ✅ PREFIRA | Por Quê? |
|---------|-----------|---------|
| `eager: true` em relações | `eager: false` ou não declarar | Evita conflito com cache TypeORM |
| Sem índices | Indexar campos de busca | Melhora performance |
| Sem validação de tipo | Usar `type: 'uuid'`, `type: 'varchar'` etc | Type safety |
| Sem comentários | Documentar relações e campos críticos | Facilita manutenção |

---

## 📦 Padrões de DTOs

### ✅ Create DTO

```typescript
// backend/src/modules/[nome]/dto/create-[nome].dto.ts

import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsUUID,
  IsEnum,
  MaxLength,
  MinLength,
  Matches
} from 'class-validator';

export class Create[NomeEntidade]Dto {
  
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MaxLength(150, { message: 'Nome não pode ter mais de 150 caracteres' })
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  nome: string;

  @IsString({ message: 'Descrição deve ser uma string' })
  @IsOptional()
  descricao?: string;

  @IsString({ message: 'Código deve ser uma string' })
  @IsNotEmpty({ message: 'Código é obrigatório' })
  @Matches(/^[A-Z0-9-]+$/, { message: 'Código deve conter apenas letras maiúsculas, números e hífen' })
  codigo: string;

  @IsUUID('4', { message: 'ID da outra entidade inválido' })
  @IsNotEmpty({ message: 'Outra entidade é obrigatória' })
  idOutraEntidade: string;

  @IsEnum(['ATIVO', 'INATIVO'], { message: 'Status inválido' })
  @IsOptional()
  status?: string;
}
```

### ✅ Update DTO

```typescript
// backend/src/modules/[nome]/dto/update-[nome].dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { Create[NomeEntidade]Dto } from './create-[nome].dto';

/**
 * Usar PartialType torna todos os campos opcionais
 * Ideal para PATCH requests
 */
export class Update[NomeEntidade]Dto extends PartialType(Create[NomeEntidade]Dto) {}
```

### ⚠️ Alertas Para DTOs

| ❌ EVITE | ✅ PREFIRA | Por Quê? |
|---------|-----------|---------|
| DTOs muito genéricos | DTOs específicos por operação | Melhor validação e type safety |
| Sem mensagens de erro | Mensagens descritivas | Melhor UX e debug |
| Sem decoradores de validação | Usar `@IsNotEmpty()`, `@IsUUID()` etc | Validação automática |
| Aceitar campos extras | Usar `@Transform()` para sanitizar | Segurança |

---

## 🎯 Padrões de Serviços

### ✅ Service Completo

```typescript
// backend/src/modules/[nome]/[nome].service.ts

import { 
  Injectable, 
  NotFoundException, 
  ConflictException,
  BadRequestException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { [NomeEntidade] } from './entities/[nome].entity';
import { Create[NomeEntidade]Dto } from './dto/create-[nome].dto';
import { Update[NomeEntidade]Dto } from './dto/update-[nome].dto';

@Injectable()
export class [NomeEntidade]Service {
  constructor(
    @InjectRepository([NomeEntidade])
    private readonly repository: Repository<[NomeEntidade]>,
  ) {}

  // ===== CREATE =====
  
  /**
   * Criar nova [NomeEntidade]
   * @param createDto Dados de criação
   * @returns Nova [NomeEntidade] criada
   */
  async create(createDto: Create[NomeEntidade]Dto): Promise<[NomeEntidade]> {
    console.log('🔵 CREATE [NomeEntidade] - Dados recebidos:', createDto);

    // Validar duplicatas se necessário
    const existente = await this.repository.findOne({
      where: { codigo: createDto.codigo }
    });

    if (existente) {
      throw new ConflictException(
        `Já existe uma [NomeEntidade] cadastrada com o código "${createDto.codigo}"`
      );
    }

    const entidade = this.repository.create(createDto);
    const resultado = await this.repository.save(entidade);

    console.log('✅ [NomeEntidade] criada com ID:', resultado.id);
    return resultado;
  }

  // ===== READ =====

  /**
   * Listar todas as [NomeEntidades] com paginação e filtros
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: string
  ): Promise<{ data: [NomeEntidade][]; total: number; page: number; limit: number }> {
    console.log('🔵 FINDALL - Filtros:', { page, limit, search, status });

    const skip = (page - 1) * limit;

    let query = this.repository
      .createQueryBuilder('[nomeMinusculo]')
      .take(limit)
      .skip(skip)
      .orderBy('[nomeMinusculo].atualizadoEm', 'DESC');

    // Filtro por busca
    if (search) {
      query = query.where(
        'LOWER([nomeMinusculo].nome) ILIKE :search OR LOWER([nomeMinusculo].codigo) ILIKE :search',
        { search: `%${search.toLowerCase()}%` }
      );
    }

    // Filtro por status
    if (status) {
      query = query.andWhere('[nomeMinusculo].status = :status', { status });
    }

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  /**
   * Buscar uma [NomeEntidade] por ID com relações
   */
  async findOne(id: string): Promise<[NomeEntidade]> {
    console.log('🔵 FINDONE - ID:', id);

    const entidade = await this.repository.findOne({
      where: { id },
      relations: ['outraEntidade'] // Adicione relações conforme necessário
    });

    if (!entidade) {
      throw new NotFoundException(
        `[NomeEntidade] com ID "${id}" não encontrada`
      );
    }

    return entidade;
  }

  // ===== UPDATE =====

  /**
   * Atualizar uma [NomeEntidade]
   * 
   * ⚠️ IMPORTANTE: Usar createQueryBuilder() para evitar conflitos com cache
   * e relações eager loaded
   */
  async update(
    id: string, 
    updateDto: Update[NomeEntidade]Dto
  ): Promise<[NomeEntidade]> {
    console.log('🔵 UPDATE - ID:', id, 'Dados:', updateDto);

    // 1. Validar se existe
    await this.findOne(id);

    // 2. Validar duplicatas se código está sendo alterado
    if (updateDto.codigo) {
      const existente = await this.repository.findOne({
        where: { codigo: updateDto.codigo }
      });

      if (existente && existente.id !== id) {
        throw new ConflictException(
          `Já existe outra [NomeEntidade] com o código "${updateDto.codigo}"`
        );
      }
    }

    // 3. Atualizar usando QueryBuilder (não use Object.assign + save)
    await this.repository
      .createQueryBuilder()
      .update([NomeEntidade])
      .set(updateDto)
      .where('id = :id', { id })
      .execute();

    console.log('✅ APÓS UPDATE NO BANCO');

    // 4. Recarregar e retornar com relações
    const resultado = await this.findOne(id);

    console.log('✅ APÓS RECARREGAR:', resultado);
    return resultado;
  }

  // ===== DELETE =====

  /**
   * Remover uma [NomeEntidade]
   */
  async remove(id: string): Promise<void> {
    console.log('🔵 REMOVE - ID:', id);

    const entidade = await this.findOne(id);
    await this.repository.remove(entidade);

    console.log('✅ [NomeEntidade] removida');
  }

  // ===== Métodos Auxiliares =====

  /**
   * Verificar se [NomeEntidade] existe
   */
  async exists(id: string): Promise<boolean> {
    const count = await this.repository.count({ where: { id } });
    return count > 0;
  }

  /**
   * Contar total de [NomeEntidades] ativas
   */
  async countAtivos(): Promise<number> {
    return await this.repository.count({ 
      where: { status: 'ATIVO' } 
    });
  }
}
```

### ⚠️ Alertas Para Serviços

| ❌ EVITE | ✅ PREFIRA | Por Quê? |
|---------|-----------|---------|
| `Object.assign()` em UPDATE | `createQueryBuilder().update().set()` | Evita conflito com cache |
| Sem validações | Validar antes de criar/atualizar | Integridade de dados |
| Sem logs | Adicionar console.log em operações críticas | Facilita debug |
| Sem comentários | Documentar métodos públicos | Manutenção |
| Não verificar duplicatas | Verificar antes de CREATE/UPDATE | Evita inconsistências |

---

## 🎤 Padrões de Controllers

### ✅ Controller Completo

```typescript
// backend/src/modules/[nome]/[nome].controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { [NomeEntidade]Service } from './[nome].service';
import { Create[NomeEntidade]Dto } from './dto/create-[nome].dto';
import { Update[NomeEntidade]Dto } from './dto/update-[nome].dto';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';
import { AuditoriaInterceptor } from '../../common/interceptors/auditoria.interceptor';

@Controller('[nomes-plurais]')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@UseInterceptors(AuditoriaInterceptor)
export class [NomeEntidade]Controller {
  constructor(
    private readonly service: [NomeEntidade]Service
  ) {}

  // ===== POST /[nomes-plurais] =====

  @Post()
  @Permissions(Permission.[NOME_MAIUSCULO]_CREATE)
  create(@Body() createDto: Create[NomeEntidade]Dto) {
    return this.service.create(createDto);
  }

  // ===== GET /[nomes-plurais] =====

  @Get()
  @Permissions(Permission.[NOME_MAIUSCULO]_READ)
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.service.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      search,
      status,
    );
  }

  // ===== GET /[nomes-plurais]/:id =====

  @Get(':id')
  @Permissions(Permission.[NOME_MAIUSCULO]_READ)
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // ===== PATCH /[nomes-plurais]/:id =====

  @Patch(':id')
  @Permissions(Permission.[NOME_MAIUSCULO]_UPDATE)
  update(
    @Param('id') id: string,
    @Body() updateDto: Update[NomeEntidade]Dto
  ) {
    return this.service.update(id, updateDto);
  }

  // ===== DELETE /[nomes-plurais]/:id =====

  @Delete(':id')
  @Permissions(Permission.[NOME_MAIUSCULO]_DELETE)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
```

### ⚠️ Alertas Para Controllers

| ❌ EVITE | ✅ PREFIRA | Por Quê? |
|---------|-----------|---------|
| Sem autenticação | Usar `AuthGuard('jwt')` | Segurança |
| Sem permissões | Usar `@Permissions()` | Controle de acesso |
| Sem auditoria | Usar `AuditoriaInterceptor` | Rastreabilidade |
| Sem validação | Usar DTOs com `class-validator` | Validação automática |
| Sem Query parameters | Usar `@Query()` para filtros | Flexibilidade |

---

## 📦 Padrões de Módulos

### ✅ Module

```typescript
// backend/src/modules/[nome]/[nome].module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { [NomeEntidade]Service } from './[nome].service';
import { [NomeEntidade]Controller } from './[nome].controller.ts';
import { [NomeEntidade] } from './entities/[nome].entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    [NomeEntidade],
    // Adicione outras entidades se necessário
  ])],
  controllers: [[NomeEntidade]Controller],
  providers: [[NomeEntidade]Service],
  exports: [[NomeEntidade]Service], // Exportar serviço se usado em outros módulos
})
export class [NomeEntidade]Module {}
```

### ⚠️ Alertas Para Módulos

| ❌ EVITE | ✅ PREFIRA | Por Quê? |
|---------|-----------|---------|
| Não exportar serviços | Exportar serviço se usado externamente | Reutilização |
| Sem comentários | Documentar imports e exports | Manutenção |
| Desordenado | Organizar: imports, controllers, providers, exports | Legibilidade |

---

## 🚀 Boas Práticas Gerais

### 1. **Nomenclatura**

```
✅ Certo:
- veiculo.entity.ts
- create-veiculo.dto.ts
- update-veiculo.dto.ts
- veiculo.service.ts
- veiculo.controller.ts
- veiculo.module.ts

❌ Errado:
- veiculo_entity.ts
- CreateVeiculoDTO.ts
- VeiculoServiceImpl.ts
```

### 2. **Estrutura de Pastas**

```
✅ Certo:
modules/
├── veiculo/
│   ├── dto/
│   │   ├── create-veiculo.dto.ts
│   │   └── update-veiculo.dto.ts
│   ├── entities/
│   │   └── veiculo.entity.ts
│   ├── veiculo.controller.ts
│   ├── veiculo.module.ts
│   └── veiculo.service.ts

❌ Errado:
modules/
└── veiculo/
    ├── veiculo.entity.ts (sem pasta entities)
    ├── veiculo.dto.ts (tudo em um arquivo)
    └── veiculo.service.ts
```

### 3. **Logging Padrão**

```typescript
// OPERAÇÃO INICIADA
console.log('🔵 [OPERAÇÃO] - Dados:', dados);

// OPERAÇÃO CONCLUÍDA
console.log('✅ [OPERAÇÃO] - Resultado:', resultado);

// OPERAÇÃO COM ERRO
console.log('❌ [OPERAÇÃO] - Erro:', erro);

// APÓS PERSISTÊNCIA NO BANCO
console.log('✅ APÓS [OPERAÇÃO] NO BANCO:', resultado);
```

### 4. **Tratamento de Erros**

```typescript
// NotFoundException - Entidade não existe
throw new NotFoundException('Entidade não encontrada');

// ConflictException - Violação de unicidade
throw new ConflictException('Código já existe');

// BadRequestException - Dados inválidos
throw new BadRequestException('Descrição inválida');

// ForbiddenException - Sem permissão
throw new ForbiddenException('Acesso negado');
```

### 5. **Validação de Relações Estrangeiras**

```typescript
// Se seu DTO tem idOutraEntidade, valide:
async create(createDto: CreateVeiculoDto): Promise<Veiculo> {
  // Validar se a entidade relacionada existe
  if (createDto.idMarca) {
    const marca = await this.marcaService.findOne(createDto.idMarca);
    if (!marca) {
      throw new NotFoundException('Marca não encontrada');
    }
  }

  // Agora criar
  return await this.repository.create(createDto);
}
```

### 6. **Índices no Banco**

```typescript
// Indexar campos frequentemente usados em WHERE e ORDER BY
@Entity()
@Index(['status'])
@Index(['codigo'])
@Index(['dataHora'])
export class MinhaEntidade extends BaseEntity {
  // ...
}
```

### 7. **Soft Delete (Opcional)**

```typescript
// Se usar soft delete (recomendado para auditoria)
import { DeleteDateColumn } from 'typeorm';

export class MinhaEntidade extends BaseEntity {
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletadoEm?: Date;

  // E no service:
  async remove(id: string): Promise<void> {
    await this.repository.softRemove({ id });
  }
}
```

---

## ✅ Checklist de Implementação

Use este checklist ao criar um novo módulo:

### Entity
- [ ] Estende `BaseEntity`
- [ ] Usa `@Entity()` com nome em plural
- [ ] Todos os campos têm `type` definido
- [ ] Relações usam `eager: false` (ou não declaradas)
- [ ] Campos únicos têm `unique: true`
- [ ] Campos obrigatórios têm `nullable: false`
- [ ] Tem índices para campos de busca
- [ ] Tem `static nomeAmigavel: string`

### Create DTO
- [ ] Todos os campos `@IsNotEmpty()` obrigatórios têm validador
- [ ] Campos UUID usam `@IsUUID()`
- [ ] Campos string usam `@MaxLength()` e `@MinLength()`
- [ ] Campos enum usam `@IsEnum()`
- [ ] Todas as mensagens de erro são descritivas
- [ ] Campos opcionais têm `@IsOptional()`

### Update DTO
- [ ] Estende `PartialType(CreateDto)`
- [ ] Todos os campos são opcionais
- [ ] Validadores são os mesmos do CreateDto

### Service
- [ ] Método `create()` valida duplicatas
- [ ] Método `findAll()` suporta paginação e filtros
- [ ] Método `findOne()` lança `NotFoundException`
- [ ] Método `update()` usa `createQueryBuilder().update().set()`
- [ ] Método `update()` valida entidade existente antes
- [ ] Método `remove()` existe
- [ ] Todos os métodos têm `console.log()` de logging
- [ ] Todos os métodos públicos têm comentários JSDoc

### Controller
- [ ] Usa `@UseGuards(AuthGuard('jwt'), PermissionsGuard)`
- [ ] Usa `@UseInterceptors(AuditoriaInterceptor)`
- [ ] Todos os endpoints têm `@Permissions()`
- [ ] POST usa `Create...Dto`
- [ ] PATCH usa `Update...Dto`
- [ ] GET tem query params de paginação/filtro
- [ ] Paths seguem padrão RESTful

### Module
- [ ] Importa `TypeOrmModule.forFeature([Entity])`
- [ ] Exporta o service
- [ ] Registra service nos `providers`
- [ ] Registra controller nos `controllers`

### Arquivo principal do app
- [ ] Módulo está importado em `app.module.ts`

---

## 📚 Exemplo Prático Completo

Vamos usar como exemplo criar um módulo `Marca` (para veículos):

### 1. Entity

```typescript
// backend/src/modules/marca/entities/marca.entity.ts

import { Entity, Column, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Veiculo } from '../../veiculo/entities/veiculo.entity';

@Entity('marcas')
@Index(['status'])
export class Marca extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  nome: string;

  @Column({ type: 'text', nullable: true })
  descricao?: string;

  @Column({ 
    type: 'enum', 
    enum: ['ATIVO', 'INATIVO'],
    default: 'ATIVO'
  })
  status: string;

  @OneToMany(() => Veiculo, (veiculo) => veiculo.marca, { lazy: true })
  veiculos?: Veiculo[];

  static get nomeAmigavel(): string {
    return 'Marca';
  }
}
```

### 2. DTOs

```typescript
// backend/src/modules/marca/dto/create-marca.dto.ts

import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateMarcaDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MaxLength(100, { message: 'Nome não pode ter mais de 100 caracteres' })
  nome: string;

  @IsString()
  @IsOptional()
  descricao?: string;
}
```

```typescript
// backend/src/modules/marca/dto/update-marca.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateMarcaDto } from './create-marca.dto';

export class UpdateMarcaDto extends PartialType(CreateMarcaDto) {}
```

### 3. Service

```typescript
// backend/src/modules/marca/marca.service.ts

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Marca } from './entities/marca.entity';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';

@Injectable()
export class MarcaService {
  constructor(
    @InjectRepository(Marca)
    private readonly repository: Repository<Marca>,
  ) {}

  async create(createDto: CreateMarcaDto): Promise<Marca> {
    console.log('🔵 CREATE Marca - Dados recebidos:', createDto);

    const existente = await this.repository.findOne({
      where: { nome: createDto.nome }
    });

    if (existente) {
      throw new ConflictException(`Marca "${createDto.nome}" já existe`);
    }

    const marca = this.repository.create(createDto);
    const resultado = await this.repository.save(marca);

    console.log('✅ Marca criada com ID:', resultado.id);
    return resultado;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: string
  ): Promise<{ data: Marca[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    let query = this.repository
      .createQueryBuilder('marca')
      .take(limit)
      .skip(skip)
      .orderBy('marca.atualizadoEm', 'DESC');

    if (search) {
      query = query.where('LOWER(marca.nome) ILIKE :search', { search: `%${search.toLowerCase()}%` });
    }

    if (status) {
      query = query.andWhere('marca.status = :status', { status });
    }

    const [data, total] = await query.getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Marca> {
    const marca = await this.repository.findOne({ where: { id } });

    if (!marca) {
      throw new NotFoundException(`Marca com ID "${id}" não encontrada`);
    }

    return marca;
  }

  async update(id: string, updateDto: UpdateMarcaDto): Promise<Marca> {
    console.log('🔵 UPDATE Marca - ID:', id, 'Dados:', updateDto);

    await this.findOne(id);

    await this.repository
      .createQueryBuilder()
      .update(Marca)
      .set(updateDto)
      .where('id = :id', { id })
      .execute();

    const resultado = await this.findOne(id);

    console.log('✅ Marca atualizada');
    return resultado;
  }

  async remove(id: string): Promise<void> {
    const marca = await this.findOne(id);
    await this.repository.remove(marca);
  }
}
```

### 4. Controller

```typescript
// backend/src/modules/marca/marca.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MarcaService } from './marca.service';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';
import { AuditoriaInterceptor } from '../../common/interceptors/auditoria.interceptor';

@Controller('marcas')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@UseInterceptors(AuditoriaInterceptor)
export class MarcaController {
  constructor(private readonly service: MarcaService) {}

  @Post()
  @Permissions(Permission.MARCA_CREATE)
  create(@Body() createDto: CreateMarcaDto) {
    return this.service.create(createDto);
  }

  @Get()
  @Permissions(Permission.MARCA_READ)
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.service.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      search,
      status,
    );
  }

  @Get(':id')
  @Permissions(Permission.MARCA_READ)
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Permissions(Permission.MARCA_UPDATE)
  update(@Param('id') id: string, @Body() updateDto: UpdateMarcaDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @Permissions(Permission.MARCA_DELETE)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
```

### 5. Module

```typescript
// backend/src/modules/marca/marca.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarcaService } from './marca.service';
import { MarcaController } from './marca.controller';
import { Marca } from './entities/marca.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Marca])],
  controllers: [MarcaController],
  providers: [MarcaService],
  exports: [MarcaService],
})
export class MarcaModule {}
```

### 6. Registrar no app.module.ts

```typescript
// backend/src/app.module.ts

import { MarcaModule } from './modules/marca/marca.module';

@Module({
  imports: [
    // ... outros imports
    MarcaModule,
  ],
})
export class AppModule {}
```

---

## 🎓 Resumo Final

| Tipo | Arquivo | Responsabilidade |
|------|---------|------------------|
| **Entity** | `[nome].entity.ts` | Estrutura do banco de dados |
| **Create DTO** | `create-[nome].dto.ts` | Validação de entrada para criação |
| **Update DTO** | `update-[nome].dto.ts` | Validação de entrada para atualização |
| **Service** | `[nome].service.ts` | Lógica de negócio (CRUD + validações) |
| **Controller** | `[nome].controller.ts` | Endpoints HTTP e autenticação |
| **Module** | `[nome].module.ts` | Agregação do módulo |

---

## 🔗 Referências

- [NestJS Docs](https://docs.nestjs.com/)
- [TypeORM Docs](https://typeorm.io/)
- [class-validator](https://github.com/typestack/class-validator)
- [class-transformer](https://github.com/typestack/class-transformer)

---

**Última atualização:** 09/11/2025  
**Autor:** Template System  
**Status:** ✅ Completo e Pronto para Uso
