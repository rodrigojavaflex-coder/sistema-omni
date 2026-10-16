import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Retorno integrado BRT (US4.5): timestamp do último poll na empresa,
 * snapshot de status BRT na irregularidade, timeline e insumos da OS.
 */
export class AddBrtPollStatusInsumos1746800000000
  implements MigrationInterface
{
  name = 'AddBrtPollStatusInsumos1746800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras"
      ADD COLUMN IF NOT EXISTS "brt_busca_info_ultimo_poll_em" TIMESTAMP NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      ADD COLUMN IF NOT EXISTS "status_brt_atual" varchar(80) NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      ADD COLUMN IF NOT EXISTS "status_brt_atualizado_em" TIMESTAMP NULL
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "os_externa_status_eventos" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "integrador" varchar(30) NOT NULL DEFAULT 'BRT',
        "os_orig" varchar(80) NOT NULL,
        "num_os_externo" integer NOT NULL,
        "status_brt" varchar(80) NOT NULL,
        "comentario" text NULL,
        "data_evento_brt" TIMESTAMP NULL,
        "recebido_em" TIMESTAMP NOT NULL DEFAULT now(),
        "criadoEm" TIMESTAMP NOT NULL DEFAULT now(),
        "atualizadoEm" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_os_externa_status_eventos" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_os_ext_status_evt_natural"
      ON "os_externa_status_eventos" ("integrador", "num_os_externo", "status_brt", "data_evento_brt")
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_os_ext_status_evt_num_os"
      ON "os_externa_status_eventos" ("num_os_externo")
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "os_externa_insumos" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "integrador" varchar(30) NOT NULL DEFAULT 'BRT',
        "os_orig" varchar(80) NULL,
        "num_os_externo" integer NOT NULL,
        "nome_insumo" varchar(300) NOT NULL,
        "quantidade" numeric(12,3) NULL,
        "valor" numeric(14,2) NULL,
        "descricao" text NULL,
        "data_alteracao_brt" TIMESTAMP NULL,
        "sincronizado_em" TIMESTAMP NOT NULL DEFAULT now(),
        "criadoEm" TIMESTAMP NOT NULL DEFAULT now(),
        "atualizadoEm" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_os_externa_insumos" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_os_ext_insumos_num_os"
      ON "os_externa_insumos" ("num_os_externo")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "os_externa_insumos"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "os_externa_status_eventos"`);
    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      DROP COLUMN IF EXISTS "status_brt_atualizado_em"
    `);
    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      DROP COLUMN IF EXISTS "status_brt_atual"
    `);
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras"
      DROP COLUMN IF EXISTS "brt_busca_info_ultimo_poll_em"
    `);
  }
}
