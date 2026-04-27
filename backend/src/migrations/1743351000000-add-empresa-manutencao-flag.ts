import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmpresaManutencaoFlag1743351000000
  implements MigrationInterface
{
  name = 'AddEmpresaManutencaoFlag1743351000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras"
      ADD COLUMN IF NOT EXISTS "eh_empresa_manutencao" boolean NOT NULL DEFAULT false
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras"
      DROP COLUMN IF EXISTS "eh_empresa_manutencao"
    `);
  }
}
