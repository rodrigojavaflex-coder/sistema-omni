import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTipoDaUnidadeMetas1743360000000 implements MigrationInterface {
  name = 'AddTipoDaUnidadeMetas1743360000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "metas"
      ADD COLUMN IF NOT EXISTS "tipoDaUnidade" character varying(30) NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "metas"
      DROP COLUMN IF EXISTS "tipoDaUnidade"
    `);
  }
}
