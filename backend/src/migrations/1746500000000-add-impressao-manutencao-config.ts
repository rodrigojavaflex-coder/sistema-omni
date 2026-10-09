import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Configuração global de impressão automática do PDF pós-envio à manutenção.
 */
export class AddImpressaoManutencaoConfig1746500000000
  implements MigrationInterface
{
  name = 'AddImpressaoManutencaoConfig1746500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "configuracoes"
      ADD COLUMN IF NOT EXISTS "impressao_manutencao_config" jsonb NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "configuracoes"
      DROP COLUMN IF EXISTS "impressao_manutencao_config"
    `);
  }
}
