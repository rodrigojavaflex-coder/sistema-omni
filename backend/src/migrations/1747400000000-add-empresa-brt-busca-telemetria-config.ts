import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Configuração por empresa da busca periódica de telemetria BRT (tempo_real).
 */
export class AddEmpresaBrtBuscaTelemetriaConfig1747400000000
  implements MigrationInterface
{
  name = 'AddEmpresaBrtBuscaTelemetriaConfig1747400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras"
      ADD COLUMN IF NOT EXISTS "brt_busca_telemetria_ativo" boolean NOT NULL DEFAULT false
    `);
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras"
      ADD COLUMN IF NOT EXISTS "brt_busca_telemetria_intervalo_minutos" integer NULL DEFAULT 10
    `);
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras"
      ADD COLUMN IF NOT EXISTS "brt_busca_telemetria_ultimo_poll_em" TIMESTAMP NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras"
      DROP COLUMN IF EXISTS "brt_busca_telemetria_ultimo_poll_em"
    `);
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras"
      DROP COLUMN IF EXISTS "brt_busca_telemetria_intervalo_minutos"
    `);
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras"
      DROP COLUMN IF EXISTS "brt_busca_telemetria_ativo"
    `);
  }
}
