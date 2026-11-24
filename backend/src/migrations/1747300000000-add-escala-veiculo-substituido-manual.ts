import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEscalaVeiculoSubstituidoManual1747300000000
  implements MigrationInterface
{
  name = 'AddEscalaVeiculoSubstituidoManual1747300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "veiculo_escala_dia"
      ADD COLUMN IF NOT EXISTS "veiculo_substituido_manual" boolean NOT NULL DEFAULT false
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "veiculo_escala_dia"
      DROP COLUMN IF EXISTS "veiculo_substituido_manual"
    `);
  }
}
