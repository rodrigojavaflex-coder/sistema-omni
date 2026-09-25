import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOdometroDiffMaxKmConfig1745900000000
  implements MigrationInterface
{
  name = 'AddOdometroDiffMaxKmConfig1745900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "configuracoes"
      ADD COLUMN IF NOT EXISTS "odometro_diff_max_km" integer NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "configuracoes"
      DROP COLUMN IF EXISTS "odometro_diff_max_km"
    `);
  }
}
