import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
  TableUnique,
} from 'typeorm';

export class CreateIndicadores1747700000000 implements MigrationInterface {
  name = 'CreateIndicadores1747700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS indicadores_codigo_seq START WITH 1 INCREMENT BY 1`,
    );

    if (!(await queryRunner.hasTable('indicadores'))) {
      await queryRunner.createTable(
        new Table({
          name: 'indicadores',
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
              name: 'codigoIndicador',
              type: 'int',
              isNullable: false,
              isUnique: true,
            },
            {
              name: 'nomeIndicador',
              type: 'varchar',
              length: '200',
              isNullable: false,
            },
            {
              name: 'departamentoId',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'unidadeMedida',
              type: 'varchar',
              length: '50',
              isNullable: false,
            },
            {
              name: 'tipoIndicador',
              type: 'varchar',
              length: '30',
              isNullable: false,
            },
            {
              name: 'detalheIndicador',
              type: 'text',
              isNullable: true,
            },
            {
              name: 'ativo',
              type: 'boolean',
              isNullable: false,
              default: true,
            },
            {
              name: 'ordemExibicao',
              type: 'int',
              isNullable: true,
            },
          ],
        }),
      );

      await queryRunner.createIndex(
        'indicadores',
        new TableIndex({
          name: 'IDX_indicadores_nomeIndicador',
          columnNames: ['nomeIndicador'],
        }),
      );
      await queryRunner.createIndex(
        'indicadores',
        new TableIndex({
          name: 'IDX_indicadores_departamentoId',
          columnNames: ['departamentoId'],
        }),
      );
      await queryRunner.createForeignKey(
        'indicadores',
        new TableForeignKey({
          name: 'FK_indicadores_departamento',
          columnNames: ['departamentoId'],
          referencedTableName: 'departamentos',
          referencedColumnNames: ['id'],
          onDelete: 'RESTRICT',
        }),
      );
    }

    if (!(await queryRunner.hasTable('indicador_execucoes'))) {
      await queryRunner.createTable(
        new Table({
          name: 'indicador_execucoes',
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
              name: 'indicadorId',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'dataReferencia',
              type: 'date',
              isNullable: false,
            },
            {
              name: 'valor',
              type: 'numeric',
              precision: 18,
              scale: 4,
              isNullable: false,
            },
            {
              name: 'justificativa',
              type: 'text',
              isNullable: true,
            },
          ],
        }),
      );

      await queryRunner.createUniqueConstraint(
        'indicador_execucoes',
        new TableUnique({
          name: 'UQ_indicador_execucao_periodo',
          columnNames: ['indicadorId', 'dataReferencia'],
        }),
      );
      await queryRunner.createIndex(
        'indicador_execucoes',
        new TableIndex({
          name: 'IDX_indicador_execucoes_indicador_data',
          columnNames: ['indicadorId', 'dataReferencia'],
        }),
      );
      await queryRunner.createForeignKey(
        'indicador_execucoes',
        new TableForeignKey({
          name: 'FK_indicador_execucoes_indicador',
          columnNames: ['indicadorId'],
          referencedTableName: 'indicadores',
          referencedColumnNames: ['id'],
          onDelete: 'RESTRICT',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('indicador_execucoes')) {
      await queryRunner.dropTable('indicador_execucoes');
    }
    if (await queryRunner.hasTable('indicadores')) {
      await queryRunner.dropTable('indicadores');
    }
    await queryRunner.query(`DROP SEQUENCE IF EXISTS indicadores_codigo_seq`);
  }
}
