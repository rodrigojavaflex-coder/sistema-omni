import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailConfigAndEmpresaEmails1743350000000
  implements MigrationInterface
{
  name = 'AddEmailConfigAndEmpresaEmails1743350000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "configuracoes"
      ADD COLUMN IF NOT EXISTS "emailEnvioConfig" jsonb NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "empresasterceiras"
      ADD COLUMN IF NOT EXISTS "emails_relatorio" text NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras"
      DROP COLUMN IF EXISTS "emails_relatorio"
    `);

    await queryRunner.query(`
      ALTER TABLE "configuracoes"
      DROP COLUMN IF EXISTS "emailEnvioConfig"
    `);
  }
}

