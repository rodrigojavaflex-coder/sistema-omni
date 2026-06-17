import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateDocumentos1744300000000 implements MigrationInterface {
  name = 'CreateDocumentos1744300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable('tipos_documento'))) {
      await queryRunner.createTable(
        new Table({
          name: 'tipos_documento',
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
              length: '150',
              isNullable: false,
            },
            {
              name: 'descricao',
              type: 'text',
              isNullable: true,
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
        'tipos_documento',
        new TableIndex({
          name: 'IDX_TIPOS_DOCUMENTO_NOME',
          columnNames: ['nome'],
          isUnique: true,
        }),
      );
    }

    if (!(await queryRunner.hasTable('documentos'))) {
      await queryRunner.createTable(
        new Table({
          name: 'documentos',
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
              name: 'nomeDocumento',
              type: 'varchar',
              length: '300',
              isNullable: false,
            },
            {
              name: 'tipoDocumentoId',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'departamentoId',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'responsavelId',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'status',
              type: 'varchar',
              length: '30',
              isNullable: false,
              default: `'ATIVO'`,
            },
            {
              name: 'nomeArquivo',
              type: 'varchar',
              length: '255',
              isNullable: false,
            },
            {
              name: 'mimeType',
              type: 'varchar',
              length: '100',
              isNullable: false,
            },
            {
              name: 'tamanho',
              type: 'bigint',
              isNullable: false,
            },
            {
              name: 'dadosBytea',
              type: 'bytea',
              isNullable: false,
            },
            {
              name: 'compartilhamentoAtivo',
              type: 'boolean',
              default: false,
            },
            {
              name: 'tokenPublico',
              type: 'varchar',
              length: '64',
              isNullable: true,
            },
            {
              name: 'compartilhamentoExpiraEm',
              type: 'timestamp',
              isNullable: true,
            },
            {
              name: 'compartilhamentoGeradoEm',
              type: 'timestamp',
              isNullable: true,
            },
          ],
        }),
      );

      await queryRunner.createForeignKey(
        'documentos',
        new TableForeignKey({
          name: 'FK_documentos_tipoDocumentoId',
          columnNames: ['tipoDocumentoId'],
          referencedTableName: 'tipos_documento',
          referencedColumnNames: ['id'],
          onDelete: 'RESTRICT',
        }),
      );

      await queryRunner.createForeignKey(
        'documentos',
        new TableForeignKey({
          name: 'FK_documentos_departamentoId',
          columnNames: ['departamentoId'],
          referencedTableName: 'departamentos',
          referencedColumnNames: ['id'],
          onDelete: 'RESTRICT',
        }),
      );

      await queryRunner.createForeignKey(
        'documentos',
        new TableForeignKey({
          name: 'FK_documentos_responsavelId',
          columnNames: ['responsavelId'],
          referencedTableName: 'usuarios',
          referencedColumnNames: ['id'],
          onDelete: 'RESTRICT',
        }),
      );

      await queryRunner.createIndex(
        'documentos',
        new TableIndex({
          name: 'IDX_documentos_status',
          columnNames: ['status'],
        }),
      );

      await queryRunner.createIndex(
        'documentos',
        new TableIndex({
          name: 'IDX_documentos_tipoDocumentoId',
          columnNames: ['tipoDocumentoId'],
        }),
      );

      await queryRunner.createIndex(
        'documentos',
        new TableIndex({
          name: 'IDX_documentos_departamentoId',
          columnNames: ['departamentoId'],
        }),
      );

      await queryRunner.createIndex(
        'documentos',
        new TableIndex({
          name: 'IDX_documentos_responsavelId',
          columnNames: ['responsavelId'],
        }),
      );

      await queryRunner.createIndex(
        'documentos',
        new TableIndex({
          name: 'UQ_documentos_tokenPublico',
          columnNames: ['tokenPublico'],
          isUnique: true,
          where: '"tokenPublico" IS NOT NULL',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('documentos')) {
      await queryRunner.dropTable('documentos');
    }
    if (await queryRunner.hasTable('tipos_documento')) {
      await queryRunner.dropTable('tipos_documento');
    }
  }
}
