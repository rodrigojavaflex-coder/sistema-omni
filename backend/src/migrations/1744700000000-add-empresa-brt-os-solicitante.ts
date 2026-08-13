import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmpresaBrtOsSolicitante1744700000000
  implements MigrationInterface
{
  name = 'AddEmpresaBrtOsSolicitante1744700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras"
      ADD COLUMN IF NOT EXISTS "brt_nom_sol" varchar(200) NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras"
      ADD COLUMN IF NOT EXISTS "brt_tel_ctt" varchar(40) NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras"
      ADD COLUMN IF NOT EXISTS "brt_loc_atd" varchar(500) NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras" DROP COLUMN IF EXISTS "brt_loc_atd"
    `);
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras" DROP COLUMN IF EXISTS "brt_tel_ctt"
    `);
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras" DROP COLUMN IF EXISTS "brt_nom_sol"
    `);
  }
}
