import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLogoRelatorioBytes1745600000000 implements MigrationInterface {
  name = 'AddLogoRelatorioBytes1745600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "configuracoes"
      ADD COLUMN IF NOT EXISTS "logo_relatorio_bytes" bytea NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "configuracoes"
      ADD COLUMN IF NOT EXISTS "logo_relatorio_mime" varchar(100) NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "configuracoes"
      DROP COLUMN IF EXISTS "logo_relatorio_mime"
    `);
    await queryRunner.query(`
      ALTER TABLE "configuracoes"
      DROP COLUMN IF EXISTS "logo_relatorio_bytes"
    `);
  }
}
