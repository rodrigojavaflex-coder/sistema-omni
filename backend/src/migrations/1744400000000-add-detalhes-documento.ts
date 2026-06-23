import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDetalhesDocumento1744400000000 implements MigrationInterface {
  name = 'AddDetalhesDocumento1744400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "documentos"
      ADD COLUMN IF NOT EXISTS "detalhesDocumento" text NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "documentos"
      DROP COLUMN IF EXISTS "detalhesDocumento"
    `);
  }
}
