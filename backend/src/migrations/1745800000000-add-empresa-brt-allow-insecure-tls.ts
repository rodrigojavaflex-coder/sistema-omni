import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmpresaBrtAllowInsecureTls1745800000000
  implements MigrationInterface
{
  name = 'AddEmpresaBrtAllowInsecureTls1745800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras"
      ADD COLUMN IF NOT EXISTS "brt_allow_insecure_tls" boolean NOT NULL DEFAULT false
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras"
      DROP COLUMN IF EXISTS "brt_allow_insecure_tls"
    `);
  }
}
