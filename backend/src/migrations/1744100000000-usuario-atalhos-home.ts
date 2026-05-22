import { MigrationInterface, QueryRunner } from 'typeorm';

export class UsuarioAtalhosHome1744100000000 implements MigrationInterface {
  name = 'UsuarioAtalhosHome1744100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "usuarios"
      ADD COLUMN IF NOT EXISTS "atalhos_home" jsonb NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "usuarios"
      DROP COLUMN IF EXISTS "atalhos_home"
    `);
  }
}
