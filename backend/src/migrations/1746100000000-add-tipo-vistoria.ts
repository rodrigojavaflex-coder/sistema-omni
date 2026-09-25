import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTipoVistoria1746100000000 implements MigrationInterface {
  name = 'AddTipoVistoria1746100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "vistorias"
      ADD COLUMN IF NOT EXISTS "tipo" varchar(20) NULL
    `);
    await queryRunner.query(`
      UPDATE "vistorias"
      SET "tipo" = 'CORRETIVA'
      WHERE "tipo" IS NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "vistorias"
      ALTER COLUMN "tipo" SET DEFAULT 'CORRETIVA'
    `);
    await queryRunner.query(`
      ALTER TABLE "vistorias"
      ALTER COLUMN "tipo" SET NOT NULL
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_VISTORIA_TIPO" ON "vistorias" ("tipo")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_VISTORIA_TIPO"
    `);
    await queryRunner.query(`
      ALTER TABLE "vistorias"
      DROP COLUMN IF EXISTS "tipo"
    `);
  }
}
