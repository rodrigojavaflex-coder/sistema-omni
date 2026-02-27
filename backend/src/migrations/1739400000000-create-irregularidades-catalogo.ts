import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateIrregularidadesCatalogo1739400000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('imagensvistoria')) {
      await queryRunner.dropTable('imagensvistoria');
    }
    if (await queryRunner.hasTable('checklistsvistoria')) {
      await queryRunner.dropTable('checklistsvistoria');
    }
    if (await queryRunner.hasTable('itensvistoriados')) {
      await queryRunner.dropTable('itensvistoriados');
    }

    if (!(await queryRunner.hasTable('areas_vistoriadas'))) {
      await queryRunner.createTable(
        new Table({
          name: 'areas_vistoriadas',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              default: 'uuid_generate_v4()',
            },
            {
              name: 'criadoEm',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP(6)',
            },
            {
              name: 'atualizadoEm',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP(6)',
            },
            {
              name: 'nome',
              type: 'varchar',
              length: '100',
            },
            {
              name: 'ordem_visual',
              type: 'integer',
              default: 0,
            },
            {
              name: 'ativo',
              type: 'boolean',
              default: true,
            },
          ],
        }),
      );
      await queryRunner.query(
        'CREATE INDEX IF NOT EXISTS idx_area_vistoriada_nome ON areas_vistoriadas(nome)',
      );
    }

    if (!(await queryRunner.hasTable('areas_modelos'))) {
      await queryRunner.createTable(
        new Table({
          name: 'areas_modelos',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              default: 'uuid_generate_v4()',
            },
            {
              name: 'criadoEm',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP(6)',
            },
            {
              name: 'atualizadoEm',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP(6)',
            },
            {
              name: 'idarea',
              type: 'uuid',
            },
            {
              name: 'modelo',
              type: 'varchar',
              length: '50',
            },
          ],
        }),
      );
      await queryRunner.createForeignKey(
        'areas_modelos',
        new TableForeignKey({
          columnNames: ['idarea'],
          referencedTableName: 'areas_vistoriadas',
          referencedColumnNames: ['id'],
          onDelete: 'RESTRICT',
        }),
      );
      await queryRunner.query(
        'CREATE INDEX IF NOT EXISTS idx_areas_modelos_area ON areas_modelos(idarea)',
      );
      await queryRunner.query(
        'CREATE INDEX IF NOT EXISTS idx_areas_modelos_modelo ON areas_modelos(modelo)',
      );
    }

    if (!(await queryRunner.hasTable('componentes'))) {
      await queryRunner.createTable(
        new Table({
          name: 'componentes',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              default: 'uuid_generate_v4()',
            },
            {
              name: 'criadoEm',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP(6)',
            },
            {
              name: 'atualizadoEm',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP(6)',
            },
            {
              name: 'nome',
              type: 'varchar',
              length: '100',
            },
            {
              name: 'ativo',
              type: 'boolean',
              default: true,
            },
          ],
        }),
      );
      await queryRunner.query(
        'CREATE INDEX IF NOT EXISTS idx_componentes_nome ON componentes(nome)',
      );
    }

    if (!(await queryRunner.hasTable('areas_componentes'))) {
      await queryRunner.createTable(
        new Table({
          name: 'areas_componentes',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              default: 'uuid_generate_v4()',
            },
            {
              name: 'criadoEm',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP(6)',
            },
            {
              name: 'atualizadoEm',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP(6)',
            },
            {
              name: 'idarea',
              type: 'uuid',
            },
            {
              name: 'idcomponente',
              type: 'uuid',
            },
            {
              name: 'ordem_visual',
              type: 'integer',
              default: 0,
            },
          ],
        }),
      );
      await queryRunner.createForeignKeys('areas_componentes', [
        new TableForeignKey({
          columnNames: ['idarea'],
          referencedTableName: 'areas_vistoriadas',
          referencedColumnNames: ['id'],
          onDelete: 'RESTRICT',
        }),
        new TableForeignKey({
          columnNames: ['idcomponente'],
          referencedTableName: 'componentes',
          referencedColumnNames: ['id'],
          onDelete: 'RESTRICT',
        }),
      ]);
      await queryRunner.query(
        'CREATE INDEX IF NOT EXISTS idx_areas_componentes_area ON areas_componentes(idarea)',
      );
      await queryRunner.query(
        'CREATE INDEX IF NOT EXISTS idx_areas_componentes_componente ON areas_componentes(idcomponente)',
      );
      await queryRunner.query(
        'CREATE UNIQUE INDEX IF NOT EXISTS UQ_areas_componentes_idcomponente ON areas_componentes(idcomponente)',
      );
    }

    if (!(await queryRunner.hasTable('sintomas'))) {
      await queryRunner.createTable(
        new Table({
          name: 'sintomas',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              default: 'uuid_generate_v4()',
            },
            {
              name: 'criadoEm',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP(6)',
            },
            {
              name: 'atualizadoEm',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP(6)',
            },
            {
              name: 'descricao',
              type: 'varchar',
              length: '150',
            },
            {
              name: 'ativo',
              type: 'boolean',
              default: true,
            },
          ],
        }),
      );
      await queryRunner.query(
        'CREATE INDEX IF NOT EXISTS idx_sintomas_descricao ON sintomas(descricao)',
      );
    }

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'matriz_criticidade_gravidade_enum') THEN
          CREATE TYPE "matriz_criticidade_gravidade_enum" AS ENUM ('VERDE','AMARELO','VERMELHO');
        END IF;
      END
      $$;
    `);

    if (!(await queryRunner.hasTable('matriz_criticidade'))) {
      await queryRunner.createTable(
        new Table({
          name: 'matriz_criticidade',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              default: 'uuid_generate_v4()',
            },
            {
              name: 'criadoEm',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP(6)',
            },
            {
              name: 'atualizadoEm',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP(6)',
            },
            {
              name: 'idcomponente',
              type: 'uuid',
            },
            {
              name: 'idsintoma',
              type: 'uuid',
            },
            {
              name: 'gravidade',
              type: 'enum',
              enumName: 'matriz_criticidade_gravidade_enum',
            },
            {
              name: 'exige_foto',
              type: 'boolean',
              default: false,
            },
            {
              name: 'permite_audio',
              type: 'boolean',
              default: false,
            },
          ],
        }),
      );
      await queryRunner.createForeignKeys('matriz_criticidade', [
        new TableForeignKey({
          columnNames: ['idcomponente'],
          referencedTableName: 'componentes',
          referencedColumnNames: ['id'],
          onDelete: 'RESTRICT',
        }),
        new TableForeignKey({
          columnNames: ['idsintoma'],
          referencedTableName: 'sintomas',
          referencedColumnNames: ['id'],
          onDelete: 'RESTRICT',
        }),
      ]);
      await queryRunner.query(
        'CREATE INDEX IF NOT EXISTS idx_matriz_componente ON matriz_criticidade(idcomponente)',
      );
      await queryRunner.query(
        'CREATE INDEX IF NOT EXISTS idx_matriz_sintoma ON matriz_criticidade(idsintoma)',
      );
      await queryRunner.query(
        'CREATE UNIQUE INDEX IF NOT EXISTS UQ_matriz_componente_sintoma ON matriz_criticidade(idcomponente, idsintoma)',
      );
    }

    if (!(await queryRunner.hasTable('irregularidades'))) {
      await queryRunner.createTable(
        new Table({
          name: 'irregularidades',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              default: 'uuid_generate_v4()',
            },
            {
              name: 'criadoEm',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP(6)',
            },
            {
              name: 'atualizadoEm',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP(6)',
            },
            {
              name: 'idvistoria',
              type: 'uuid',
            },
            {
              name: 'idarea',
              type: 'uuid',
            },
            {
              name: 'idcomponente',
              type: 'uuid',
            },
            {
              name: 'idsintoma',
              type: 'uuid',
            },
            {
              name: 'observacao',
              type: 'text',
              isNullable: true,
            },
            {
              name: 'resolvido',
              type: 'boolean',
              default: false,
            },
            {
              name: 'audio_nome_arquivo',
              type: 'varchar',
              length: '255',
              isNullable: true,
            },
            {
              name: 'audio_mime_type',
              type: 'varchar',
              length: '100',
              isNullable: true,
            },
            {
              name: 'audio_tamanho',
              type: 'bigint',
              isNullable: true,
            },
            {
              name: 'audio_duracao_ms',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'audio_dados_bytea',
              type: 'bytea',
              isNullable: true,
            },
          ],
        }),
      );
      await queryRunner.createForeignKeys('irregularidades', [
        new TableForeignKey({
          columnNames: ['idvistoria'],
          referencedTableName: 'vistorias',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
        new TableForeignKey({
          columnNames: ['idarea'],
          referencedTableName: 'areas_vistoriadas',
          referencedColumnNames: ['id'],
        }),
        new TableForeignKey({
          columnNames: ['idcomponente'],
          referencedTableName: 'componentes',
          referencedColumnNames: ['id'],
        }),
        new TableForeignKey({
          columnNames: ['idsintoma'],
          referencedTableName: 'sintomas',
          referencedColumnNames: ['id'],
        }),
      ]);
      await queryRunner.query(
        'CREATE INDEX IF NOT EXISTS idx_irregularidades_vistoria ON irregularidades(idvistoria)',
      );
    }

    if (!(await queryRunner.hasTable('irregularidades_imagens'))) {
      await queryRunner.createTable(
        new Table({
          name: 'irregularidades_imagens',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              default: 'uuid_generate_v4()',
            },
            {
              name: 'criadoEm',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP(6)',
            },
            {
              name: 'atualizadoEm',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP(6)',
            },
            {
              name: 'nome_arquivo',
              type: 'varchar',
              length: '255',
            },
            {
              name: 'tamanho',
              type: 'bigint',
            },
            {
              name: 'dados_bytea',
              type: 'bytea',
            },
            {
              name: 'idirregularidade',
              type: 'uuid',
            },
          ],
        }),
      );
      await queryRunner.createForeignKey(
        'irregularidades_imagens',
        new TableForeignKey({
          columnNames: ['idirregularidade'],
          referencedTableName: 'irregularidades',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );
      await queryRunner.query(
        'CREATE INDEX IF NOT EXISTS idx_irregularidades_imagens_irreg ON irregularidades_imagens(idirregularidade)',
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('irregularidades_imagens')) {
      await queryRunner.dropTable('irregularidades_imagens');
    }
    if (await queryRunner.hasTable('irregularidades')) {
      await queryRunner.dropTable('irregularidades');
    }
    if (await queryRunner.hasTable('matriz_criticidade')) {
      await queryRunner.dropTable('matriz_criticidade');
    }
    await queryRunner.query('DROP TYPE IF EXISTS "matriz_criticidade_gravidade_enum"');
    if (await queryRunner.hasTable('sintomas')) {
      await queryRunner.dropTable('sintomas');
    }
    if (await queryRunner.hasTable('areas_componentes')) {
      await queryRunner.dropTable('areas_componentes');
    }
    if (await queryRunner.hasTable('componentes')) {
      await queryRunner.dropTable('componentes');
    }
    if (await queryRunner.hasTable('areas_modelos')) {
      await queryRunner.dropTable('areas_modelos');
    }
    if (await queryRunner.hasTable('areas_vistoriadas')) {
      await queryRunner.dropTable('areas_vistoriadas');
    }

    if (!(await queryRunner.hasTable('itensvistoriados'))) {
      await queryRunner.createTable(
        new Table({
          name: 'itensvistoriados',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              default: 'uuid_generate_v4()',
            },
            {
              name: 'criadoEm',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP(6)',
            },
            {
              name: 'atualizadoEm',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP(6)',
            },
            {
              name: 'descricao',
              type: 'varchar',
              length: '300',
            },
            {
              name: 'sequencia',
              type: 'integer',
            },
            {
              name: 'tiposvistorias',
              type: 'uuid',
              isArray: true,
            },
            {
              name: 'obrigafoto',
              type: 'boolean',
              default: false,
            },
            {
              name: 'permitirfotoconforme',
              type: 'boolean',
              default: true,
            },
            {
              name: 'ativo',
              type: 'boolean',
              default: true,
            },
          ],
        }),
      );
      await queryRunner.createIndex(
        'itensvistoriados',
        new TableIndex({
          name: 'IDX_ITEMVISTORIADO_SEQUENCIA',
          columnNames: ['sequencia'],
        }),
      );
      await queryRunner.createIndex(
        'itensvistoriados',
        new TableIndex({
          name: 'IDX_ITEMVISTORIADO_TIPOSVISTORIAS',
          columnNames: ['tiposvistorias'],
        }),
      );
    }

    if (!(await queryRunner.hasTable('checklistsvistoria'))) {
      await queryRunner.createTable(
        new Table({
          name: 'checklistsvistoria',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              default: 'uuid_generate_v4()',
            },
            {
              name: 'criadoEm',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP(6)',
            },
            {
              name: 'atualizadoEm',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP(6)',
            },
            {
              name: 'idvistoria',
              type: 'uuid',
            },
            {
              name: 'iditemvistoriado',
              type: 'uuid',
            },
            {
              name: 'conforme',
              type: 'boolean',
              default: true,
            },
            {
              name: 'observacao',
              type: 'text',
              isNullable: true,
            },
          ],
        }),
      );

      await queryRunner.createForeignKeys('checklistsvistoria', [
        new TableForeignKey({
          columnNames: ['idvistoria'],
          referencedTableName: 'vistorias',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
        new TableForeignKey({
          columnNames: ['iditemvistoriado'],
          referencedTableName: 'itensvistoriados',
          referencedColumnNames: ['id'],
        }),
      ]);

      await queryRunner.query(
        'CREATE INDEX IF NOT EXISTS idx_checklist_vistoria ON checklistsvistoria(idvistoria)',
      );
      await queryRunner.query(
        'CREATE INDEX IF NOT EXISTS idx_checklist_item ON checklistsvistoria(iditemvistoriado)',
      );
    }

    if (!(await queryRunner.hasTable('imagensvistoria'))) {
      await queryRunner.createTable(
        new Table({
          name: 'imagensvistoria',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              default: 'uuid_generate_v4()',
            },
            {
              name: 'criadoEm',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP(6)',
            },
            {
              name: 'atualizadoEm',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP(6)',
            },
            {
              name: 'nome_arquivo',
              type: 'varchar',
              length: '255',
            },
            {
              name: 'tamanho',
              type: 'bigint',
            },
            {
              name: 'dados_bytea',
              type: 'bytea',
            },
            {
              name: 'idchecklistvistoria',
              type: 'uuid',
            },
          ],
        }),
      );

      await queryRunner.createForeignKey(
        'imagensvistoria',
        new TableForeignKey({
          columnNames: ['idchecklistvistoria'],
          referencedTableName: 'checklistsvistoria',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.query(
        'CREATE INDEX IF NOT EXISTS idx_imagens_checklist ON imagensvistoria(idchecklistvistoria)',
      );
    }
  }
}
