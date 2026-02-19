import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateHistoricoOcorrencias1739331000000
  implements MigrationInterface
{
  name = 'CreateHistoricoOcorrencias1739331000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    if (!(await queryRunner.hasTable('historicoocorrencias'))) {
      await queryRunner.createTable(
        new Table({
          name: 'historicoocorrencias',
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
              name: 'idOcorrencia',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'statusAnterior',
              type: 'varchar',
              length: '20',
              isNullable: true,
            },
            {
              name: 'statusNovo',
              type: 'varchar',
              length: '20',
              isNullable: false,
            },
            {
              name: 'dataAlteracao',
              type: 'timestamp',
              isNullable: false,
            },
            {
              name: 'observacao',
              type: 'text',
              isNullable: true,
            },
            {
              name: 'idUsuario',
              type: 'uuid',
              isNullable: true,
            },
          ],
        }),
      );

      await queryRunner.createForeignKey(
        'historicoocorrencias',
        new TableForeignKey({
          columnNames: ['idOcorrencia'],
          referencedTableName: 'ocorrencias',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.createForeignKey(
        'historicoocorrencias',
        new TableForeignKey({
          columnNames: ['idUsuario'],
          referencedTableName: 'usuarios',
          referencedColumnNames: ['id'],
          onDelete: 'SET NULL',
        }),
      );

      await queryRunner.createIndex(
        'historicoocorrencias',
        new TableIndex({
          name: 'IDX_HISTORICO_OCORRENCIA',
          columnNames: ['idOcorrencia'],
        }),
      );

      await queryRunner.createIndex(
        'historicoocorrencias',
        new TableIndex({
          name: 'IDX_HISTORICO_DATA_ALTERACAO',
          columnNames: ['dataAlteracao'],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('historicoocorrencias')) {
      await queryRunner.dropTable('historicoocorrencias');
    }
  }
}
