import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMetaCamposNovos1742100000000 implements MigrationInterface {
  name = 'AddMetaCamposNovos1742100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "metas"
      ADD COLUMN IF NOT EXISTS "valorMetaMensal" numeric(14,2) NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "metas"
      ADD COLUMN IF NOT EXISTS "taxaDeCrescimento" numeric(14,2) NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "metas"
      ADD COLUMN IF NOT EXISTS "valorMetaInicial" numeric(14,2) NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "metas"
      DROP COLUMN IF EXISTS "valorMetaInicial"
    `);
    await queryRunner.query(`
      ALTER TABLE "metas"
      DROP COLUMN IF EXISTS "taxaDeCrescimento"
    `);
    await queryRunner.query(`
      ALTER TABLE "metas"
      DROP COLUMN IF EXISTS "valorMetaMensal"
    `);
  }
}
