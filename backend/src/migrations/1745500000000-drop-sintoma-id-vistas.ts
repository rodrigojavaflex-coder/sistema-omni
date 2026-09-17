import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropSintomaIdVistas1745500000000 implements MigrationInterface {
  name = 'DropSintomaIdVistas1745500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "sintomas" DROP COLUMN IF EXISTS "id_vistas"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "sintomas"
      ADD COLUMN IF NOT EXISTS "id_vistas" uuid[] NOT NULL DEFAULT '{}'
    `);
  }
}
