import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateVistoriaTables1730000000000 implements MigrationInterface {
  name = 'CreateVistoriaTables1730000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "vistorias_status_enum" AS ENUM ('EM_ANDAMENTO', 'FINALIZADA', 'CANCELADA');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

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

    if (!(await queryRunner.hasTable('vistorias'))) {
      await queryRunner.createTable(
        new Table({
          name: 'vistorias',
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
              name: 'idveiculo',
              type: 'uuid',
            },
            {
              name: 'idmotorista',
              type: 'uuid',
            },
            {
              name: 'idusuario',
              type: 'uuid',
            },
            {
              name: 'odometro',
              type: 'numeric',
              precision: 10,
              scale: 2,
            },
            {
              name: 'porcentagembateria',
              type: 'numeric',
              precision: 5,
              scale: 2,
              isNullable: true,
            },
            {
              name: 'datavistoria',
              type: 'timestamp',
            },
            {
              name: 'tempo',
              type: 'integer',
            },
            {
              name: 'observacao',
              type: 'text',
              isNullable: true,
            },
            {
              name: 'status',
              type: 'enum',
              enumName: 'vistorias_status_enum',
              enum: ['EM_ANDAMENTO', 'FINALIZADA', 'CANCELADA'],
              default: `'EM_ANDAMENTO'`,
            },
          ],
        }),
      );

      await queryRunner.createForeignKeys('vistorias', [
        new TableForeignKey({
          columnNames: ['idveiculo'],
          referencedTableName: 'veiculos',
          referencedColumnNames: ['id'],
        }),
        new TableForeignKey({
          columnNames: ['idmotorista'],
          referencedTableName: 'motoristas',
          referencedColumnNames: ['id'],
        }),
        new TableForeignKey({
          columnNames: ['idusuario'],
          referencedTableName: 'usuarios',
          referencedColumnNames: ['id'],
        }),
      ]);

      await queryRunner.query(
        'CREATE INDEX IF NOT EXISTS idx_vistoria_status_data ON vistorias(status, datavistoria DESC)',
      );
      await queryRunner.query(
        'CREATE INDEX IF NOT EXISTS idx_vistoria_usuario_status_data ON vistorias(idusuario, status, datavistoria DESC)',
      );
      await queryRunner.query(
        'CREATE INDEX IF NOT EXISTS idx_vistoria_veiculo_data ON vistorias(idveiculo, datavistoria DESC)',
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('imagensvistoria')) {
      await queryRunner.dropTable('imagensvistoria');
    }
    if (await queryRunner.hasTable('checklistsvistoria')) {
      await queryRunner.dropTable('checklistsvistoria');
    }
    if (await queryRunner.hasTable('vistorias')) {
      await queryRunner.dropTable('vistorias');
    }
    if (await queryRunner.hasTable('itensvistoriados')) {
      await queryRunner.dropTable('itensvistoriados');
    }
    await queryRunner.query('DROP TYPE IF EXISTS "vistorias_status_enum"');
  }
}
