import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Escopo de atendimento da empresa de manutenção:
 * combustíveis e áreas que ela pode receber no envio.
 * Listas vazias = sem restrição (compatibilidade com empresas já cadastradas).
 */
export class AddEmpresaEscopoManutencao1746600000000
  implements MigrationInterface
{
  name = 'AddEmpresaEscopoManutencao1746600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras"
      ADD COLUMN IF NOT EXISTS "combustiveis_atendidos" jsonb NOT NULL DEFAULT '[]'::jsonb
    `);
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras"
      ADD COLUMN IF NOT EXISTS "ids_areas_atendidas" jsonb NOT NULL DEFAULT '[]'::jsonb
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras"
      DROP COLUMN IF EXISTS "ids_areas_atendidas"
    `);
    await queryRunner.query(`
      ALTER TABLE "empresasterceiras"
      DROP COLUMN IF EXISTS "combustiveis_atendidos"
    `);
  }
}
