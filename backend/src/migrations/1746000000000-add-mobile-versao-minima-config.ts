import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMobileVersaoMinimaConfig1746000000000
  implements MigrationInterface
{
  name = 'AddMobileVersaoMinimaConfig1746000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "configuracoes"
      ADD COLUMN IF NOT EXISTS "mobile_versao_minima" varchar(20) NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "configuracoes"
      DROP COLUMN IF EXISTS "mobile_versao_minima"
    `);
  }
}
