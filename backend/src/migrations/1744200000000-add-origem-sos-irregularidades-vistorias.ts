import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrigemSosIrregularidadesVistorias1744200000000 implements MigrationInterface {
  name = 'AddOrigemSosIrregularidadesVistorias1744200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      ADD COLUMN IF NOT EXISTS "origem_registro" varchar(20) NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "vistorias"
      ADD COLUMN IF NOT EXISTS "origem" varchar(20) NULL
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_IRREGULARIDADE_ORIGEM_REGISTRO"
      ON "irregularidades" ("origem_registro", "status_atual")
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_VISTORIA_ORIGEM"
      ON "vistorias" ("origem")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_VISTORIA_ORIGEM"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_IRREGULARIDADE_ORIGEM_REGISTRO"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vistorias" DROP COLUMN IF EXISTS "origem"`,
    );
    await queryRunner.query(
      `ALTER TABLE "irregularidades" DROP COLUMN IF EXISTS "origem_registro"`,
    );
  }
}
