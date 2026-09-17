import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMatrizVistasDescricao1745200000000 implements MigrationInterface {
  name = 'AddMatrizVistasDescricao1745200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "matriz_criticidade"
      ADD COLUMN IF NOT EXISTS "vistas_descricao" text[] NOT NULL DEFAULT '{}'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "matriz_criticidade"
      DROP COLUMN IF EXISTS "vistas_descricao"
    `);
  }
}
