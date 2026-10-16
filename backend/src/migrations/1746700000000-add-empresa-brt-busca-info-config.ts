import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Configuração por empresa da busca periódica de status/insumos BRT (US4.5).
 */
export class AddEmpresaBrtBuscaInfoConfig1746700000000
  implements MigrationInterface
{
  name = 'AddEmpresaBrtBuscaInfoConfig1746700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras"
      ADD COLUMN IF NOT EXISTS "brt_busca_info_ativo" boolean NOT NULL DEFAULT false
    `);
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras"
      ADD COLUMN IF NOT EXISTS "brt_busca_info_intervalo_minutos" integer NULL DEFAULT 10
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras"
      DROP COLUMN IF EXISTS "brt_busca_info_intervalo_minutos"
    `);
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras"
      DROP COLUMN IF EXISTS "brt_busca_info_ativo"
    `);
  }
}
