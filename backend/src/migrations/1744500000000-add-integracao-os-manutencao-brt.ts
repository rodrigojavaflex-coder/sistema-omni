import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIntegracaoOsManutencaoBrt1744500000000
  implements MigrationInterface
{
  name = 'AddIntegracaoOsManutencaoBrt1744500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras"
      ADD COLUMN IF NOT EXISTS "integracao_manutencao" varchar(20) NOT NULL DEFAULT 'NENHUMA'
    `);
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras"
      ADD COLUMN IF NOT EXISTS "enviar_email_relatorio" boolean NOT NULL DEFAULT true
    `);
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras"
      ADD COLUMN IF NOT EXISTS "brt_url_base" varchar(500) NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras"
      ADD COLUMN IF NOT EXISTS "brt_ten_emp" varchar(120) NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras"
      ADD COLUMN IF NOT EXISTS "brt_token" text NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras"
      ADD COLUMN IF NOT EXISTS "brt_ambiente" varchar(20) NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      ADD COLUMN IF NOT EXISTS "controle_integracao_api" boolean NOT NULL DEFAULT false
    `);
    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      ADD COLUMN IF NOT EXISTS "os_orig_atual" varchar(80) NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      ADD COLUMN IF NOT EXISTS "num_os_externo_atual" integer NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      ADD COLUMN IF NOT EXISTS "ultimo_erro_integracao" text NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      ADD COLUMN IF NOT EXISTS "ultimo_erro_integracao_em" timestamp NULL
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "irregularidades_os_externas" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "criadoEm" TIMESTAMP NOT NULL DEFAULT now(),
        "atualizadoEm" TIMESTAMP NOT NULL DEFAULT now(),
        "id_irregularidade" uuid NOT NULL,
        "os_orig" varchar(80) NOT NULL,
        "num_os_externo" integer NULL,
        "integrador" varchar(30) NOT NULL DEFAULT 'BRT',
        "sucesso" boolean NOT NULL DEFAULT false,
        "codigo_erro" varchar(80) NULL,
        "mensagem_erro" text NULL,
        "http_status" integer NULL,
        CONSTRAINT "PK_irregularidades_os_externas" PRIMARY KEY ("id"),
        CONSTRAINT "FK_irreg_os_ext_irregularidade"
          FOREIGN KEY ("id_irregularidade") REFERENCES "irregularidades"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_IRREG_OS_EXT_IRREG"
      ON "irregularidades_os_externas" ("id_irregularidade")
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_IRREG_OS_EXT_OS_ORIG"
      ON "irregularidades_os_externas" ("os_orig")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_IRREG_OS_EXT_OS_ORIG"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_IRREG_OS_EXT_IRREG"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "irregularidades_os_externas"`);

    await queryRunner.query(`
      ALTER TABLE "irregularidades" DROP COLUMN IF EXISTS "ultimo_erro_integracao_em"
    `);
    await queryRunner.query(`
      ALTER TABLE "irregularidades" DROP COLUMN IF EXISTS "ultimo_erro_integracao"
    `);
    await queryRunner.query(`
      ALTER TABLE "irregularidades" DROP COLUMN IF EXISTS "num_os_externo_atual"
    `);
    await queryRunner.query(`
      ALTER TABLE "irregularidades" DROP COLUMN IF EXISTS "os_orig_atual"
    `);
    await queryRunner.query(`
      ALTER TABLE "irregularidades" DROP COLUMN IF EXISTS "controle_integracao_api"
    `);

    await queryRunner.query(`
      ALTER TABLE "empresasterceiras" DROP COLUMN IF EXISTS "brt_ambiente"
    `);
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras" DROP COLUMN IF EXISTS "brt_token"
    `);
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras" DROP COLUMN IF EXISTS "brt_ten_emp"
    `);
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras" DROP COLUMN IF EXISTS "brt_url_base"
    `);
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras" DROP COLUMN IF EXISTS "enviar_email_relatorio"
    `);
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras" DROP COLUMN IF EXISTS "integracao_manutencao"
    `);
  }
}
