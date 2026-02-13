import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateOrigemCategoriaEmpresaOcorrencia1739280000000
  implements MigrationInterface
{
  name = 'CreateOrigemCategoriaEmpresaOcorrencia1739280000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1) Tabela origensocorrencia
    if (!(await queryRunner.hasTable('origensocorrencia'))) {
      await queryRunner.createTable(
        new Table({
          name: 'origensocorrencia',
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
              isNullable: false,
            },
          ],
        }),
      );
      await queryRunner.createIndex(
        'origensocorrencia',
        new TableIndex({
          name: 'IDX_ORIGEMOCORRENCIA_DESCRICAO',
          columnNames: ['descricao'],
          isUnique: true,
        }),
      );
    }

    // 2) Tabela empresasterceiras
    if (!(await queryRunner.hasTable('empresasterceiras'))) {
      await queryRunner.createTable(
        new Table({
          name: 'empresasterceiras',
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
              isNullable: false,
            },
          ],
        }),
      );
      await queryRunner.createIndex(
        'empresasterceiras',
        new TableIndex({
          name: 'IDX_EMPRESATERCIRA_DESCRICAO',
          columnNames: ['descricao'],
          isUnique: true,
        }),
      );
    }

    // 3) Tabela categoriasocorrencia (depende de origensocorrencia)
    if (!(await queryRunner.hasTable('categoriasocorrencia'))) {
      await queryRunner.createTable(
        new Table({
          name: 'categoriasocorrencia',
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
              isNullable: false,
            },
            {
              name: 'idOrigem',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'responsavel',
              type: 'varchar',
              length: '300',
              isNullable: true,
            },
          ],
        }),
      );
      await queryRunner.createForeignKey(
        'categoriasocorrencia',
        new TableForeignKey({
          columnNames: ['idOrigem'],
          referencedTableName: 'origensocorrencia',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );
      await queryRunner.createIndex(
        'categoriasocorrencia',
        new TableIndex({
          name: 'IDX_CATEGORIAOCORRENCIA_ORIGEM',
          columnNames: ['idOrigem'],
        }),
      );
    }

    // 4) Colunas em ocorrencias
    const tabelaOcorrencias = await queryRunner.getTable('ocorrencias');
    if (tabelaOcorrencias) {
      if (!tabelaOcorrencias.findColumnByName('idOrigem')) {
        await queryRunner.query(
          `ALTER TABLE "ocorrencias" ADD COLUMN "idOrigem" uuid`,
        );
        await queryRunner.createForeignKey(
          'ocorrencias',
          new TableForeignKey({
            columnNames: ['idOrigem'],
            referencedTableName: 'origensocorrencia',
            referencedColumnNames: ['id'],
          }),
        );
      }
      if (!tabelaOcorrencias.findColumnByName('idCategoria')) {
        await queryRunner.query(
          `ALTER TABLE "ocorrencias" ADD COLUMN "idCategoria" uuid`,
        );
        await queryRunner.createForeignKey(
          'ocorrencias',
          new TableForeignKey({
            columnNames: ['idCategoria'],
            referencedTableName: 'categoriasocorrencia',
            referencedColumnNames: ['id'],
          }),
        );
      }
      if (!tabelaOcorrencias.findColumnByName('processoSei')) {
        await queryRunner.query(
          `ALTER TABLE "ocorrencias" ADD COLUMN "processoSei" varchar(50)`,
        );
      }
      if (!tabelaOcorrencias.findColumnByName('numeroOrcamento')) {
        await queryRunner.query(
          `ALTER TABLE "ocorrencias" ADD COLUMN "numeroOrcamento" varchar(50)`,
        );
      }
      if (!tabelaOcorrencias.findColumnByName('idEmpresaDoMotorista')) {
        await queryRunner.query(
          `ALTER TABLE "ocorrencias" ADD COLUMN "idEmpresaDoMotorista" uuid`,
        );
        await queryRunner.createForeignKey(
          'ocorrencias',
          new TableForeignKey({
            columnNames: ['idEmpresaDoMotorista'],
            referencedTableName: 'empresasterceiras',
            referencedColumnNames: ['id'],
          }),
        );
      }
      if (!tabelaOcorrencias.findColumnByName('idUsuario')) {
        await queryRunner.query(
          `ALTER TABLE "ocorrencias" ADD COLUMN "idUsuario" uuid`,
        );
        await queryRunner.createForeignKey(
          'ocorrencias',
          new TableForeignKey({
            columnNames: ['idUsuario'],
            referencedTableName: 'usuarios',
            referencedColumnNames: ['id'],
          }),
        );
      }
    }

    // 5) Coluna idEmpresa em motoristas
    const tabelaMotoristas = await queryRunner.getTable('motoristas');
    if (tabelaMotoristas && !tabelaMotoristas.findColumnByName('idEmpresa')) {
      await queryRunner.query(
        `ALTER TABLE "motoristas" ADD COLUMN "idEmpresa" uuid`,
      );
      await queryRunner.createForeignKey(
        'motoristas',
        new TableForeignKey({
          columnNames: ['idEmpresa'],
          referencedTableName: 'empresasterceiras',
          referencedColumnNames: ['id'],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tabelaMotoristas = await queryRunner.getTable('motoristas');
    if (tabelaMotoristas?.findColumnByName('idEmpresa')) {
      const fkMotoristas = tabelaMotoristas.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('idEmpresa') !== -1,
      );
      if (fkMotoristas)
        await queryRunner.dropForeignKey('motoristas', fkMotoristas);
      await queryRunner.query(`ALTER TABLE "motoristas" DROP COLUMN "idEmpresa"`);
    }

    const tabelaOcorrencias = await queryRunner.getTable('ocorrencias');
    if (tabelaOcorrencias) {
      const colsComFk = [
        'idUsuario',
        'idEmpresaDoMotorista',
        'idCategoria',
        'idOrigem',
      ];
      for (const col of colsComFk) {
        if (tabelaOcorrencias.findColumnByName(col)) {
          const fk = tabelaOcorrencias.foreignKeys.find(
            (f) => f.columnNames.indexOf(col) !== -1,
          );
          if (fk) await queryRunner.dropForeignKey('ocorrencias', fk);
        }
      }
      for (const col of [
        ...colsComFk,
        'numeroOrcamento',
        'processoSei',
      ]) {
        if (tabelaOcorrencias.findColumnByName(col)) {
          await queryRunner.query(
            `ALTER TABLE "ocorrencias" DROP COLUMN "${col}"`,
          );
        }
      }
    }

    if (await queryRunner.hasTable('categoriasocorrencia')) {
      await queryRunner.dropTable('categoriasocorrencia');
    }
    if (await queryRunner.hasTable('empresasterceiras')) {
      await queryRunner.dropTable('empresasterceiras');
    }
    if (await queryRunner.hasTable('origensocorrencia')) {
      await queryRunner.dropTable('origensocorrencia');
    }
  }
}
