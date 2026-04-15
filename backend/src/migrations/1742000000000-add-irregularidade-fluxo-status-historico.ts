import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class AddIrregularidadeFluxoStatusHistorico1742000000000
  implements MigrationInterface
{
  name = 'AddIrregularidadeFluxoStatusHistorico1742000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      ADD COLUMN IF NOT EXISTS "status_atual" varchar(30) NOT NULL DEFAULT 'REGISTRADA'
    `);
    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      ADD COLUMN IF NOT EXISTS "idempresa_manutencao" uuid NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      ADD COLUMN IF NOT EXISTS "motivo_cancelamento" text NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      ADD COLUMN IF NOT EXISTS "motivo_nao_procede" text NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      ADD COLUMN IF NOT EXISTS "iniciada_manutencao_em" timestamp NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      ADD COLUMN IF NOT EXISTS "concluida_manutencao_em" timestamp NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      ADD COLUMN IF NOT EXISTS "validada_em" timestamp NULL
    `);

    await queryRunner.query(`
      UPDATE "irregularidades"
      SET "status_atual" = CASE
        WHEN "resolvido" = true THEN 'VALIDADA'
        ELSE 'REGISTRADA'
      END
      WHERE "status_atual" IS NULL OR "status_atual" = ''
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_IRREGULARIDADE_STATUS"
      ON "irregularidades" ("status_atual")
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_IRREGULARIDADE_EMPRESA_MANUT"
      ON "irregularidades" ("idempresa_manutencao")
    `);

    if (!(await queryRunner.hasTable('irregularidade_historico'))) {
      await queryRunner.createTable(
        new Table({
          name: 'irregularidade_historico',
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
              name: 'idIrregularidade',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'statusOrigem',
              type: 'varchar',
              length: '30',
              isNullable: true,
            },
            {
              name: 'statusDestino',
              type: 'varchar',
              length: '30',
              isNullable: false,
            },
            {
              name: 'acao',
              type: 'varchar',
              length: '60',
              isNullable: false,
            },
            {
              name: 'idUsuario',
              type: 'uuid',
              isNullable: true,
            },
            {
              name: 'idEmpresaEvento',
              type: 'uuid',
              isNullable: true,
            },
            {
              name: 'dataEvento',
              type: 'timestamp',
              isNullable: false,
            },
            {
              name: 'observacao',
              type: 'text',
              isNullable: true,
            },
            {
              name: 'correlationId',
              type: 'varchar',
              length: '120',
              isNullable: true,
            },
          ],
        }),
      );

      await queryRunner.createForeignKeys('irregularidade_historico', [
        new TableForeignKey({
          columnNames: ['idIrregularidade'],
          referencedTableName: 'irregularidades',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
        new TableForeignKey({
          columnNames: ['idUsuario'],
          referencedTableName: 'usuarios',
          referencedColumnNames: ['id'],
          onDelete: 'SET NULL',
        }),
      ]);

      await queryRunner.createIndex(
        'irregularidade_historico',
        new TableIndex({
          name: 'IDX_IRREG_HIST_IRREGULARIDADE_DATA',
          columnNames: ['idIrregularidade', 'dataEvento'],
        }),
      );
      await queryRunner.createIndex(
        'irregularidade_historico',
        new TableIndex({
          name: 'IDX_IRREG_HIST_STATUS_DATA',
          columnNames: ['statusDestino', 'dataEvento'],
        }),
      );
    }

    await queryRunner.query(`
      INSERT INTO "irregularidade_historico"
      ("id", "criadoEm", "atualizadoEm", "idIrregularidade", "statusOrigem", "statusDestino", "acao", "idUsuario", "idEmpresaEvento", "dataEvento", "observacao", "correlationId")
      SELECT
        uuid_generate_v4(),
        NOW(),
        NOW(),
        i.id,
        NULL,
        i.status_atual,
        'migracao_inicial',
        NULL,
        i.idempresa_manutencao,
        COALESCE(i."criadoEm", NOW()),
        'Evento inicial criado pela migration',
        NULL
      FROM "irregularidades" i
      WHERE NOT EXISTS (
        SELECT 1
        FROM "irregularidade_historico" h
        WHERE h."idIrregularidade" = i.id
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "usuarios"
      ADD COLUMN IF NOT EXISTS "idEmpresa" uuid NULL
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'FK_usuarios_idEmpresa_empresasterceiras'
        ) THEN
          ALTER TABLE "usuarios"
          ADD CONSTRAINT "FK_usuarios_idEmpresa_empresasterceiras"
          FOREIGN KEY ("idEmpresa") REFERENCES "empresasterceiras"("id")
          ON DELETE SET NULL;
        END IF;
      END
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "usuarios"
      DROP CONSTRAINT IF EXISTS "FK_usuarios_idEmpresa_empresasterceiras"
    `);
    await queryRunner.query(`
      ALTER TABLE "usuarios"
      DROP COLUMN IF EXISTS "idEmpresa"
    `);

    if (await queryRunner.hasTable('irregularidade_historico')) {
      await queryRunner.dropTable('irregularidade_historico');
    }

    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_IRREGULARIDADE_EMPRESA_MANUT"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_IRREGULARIDADE_STATUS"`,
    );
    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      DROP COLUMN IF EXISTS "validada_em"
    `);
    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      DROP COLUMN IF EXISTS "concluida_manutencao_em"
    `);
    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      DROP COLUMN IF EXISTS "iniciada_manutencao_em"
    `);
    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      DROP COLUMN IF EXISTS "motivo_nao_procede"
    `);
    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      DROP COLUMN IF EXISTS "motivo_cancelamento"
    `);
    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      DROP COLUMN IF EXISTS "idempresa_manutencao"
    `);
    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      DROP COLUMN IF EXISTS "status_atual"
    `);
  }
}

