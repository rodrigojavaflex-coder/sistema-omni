import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adiciona descricao_detalhada em modelos_veiculo e copia o nome atual
 * para o novo campo (backfill). O nome permanece como identificador curto.
 */
export class AddModeloVeiculoDescricaoDetalhada1747000000000
  implements MigrationInterface
{
  name = 'AddModeloVeiculoDescricaoDetalhada1747000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable('modelos_veiculo'))) {
      return;
    }

    if (!(await queryRunner.hasColumn('modelos_veiculo', 'descricao_detalhada'))) {
      await queryRunner.query(`
        ALTER TABLE "modelos_veiculo"
        ADD COLUMN "descricao_detalhada" text NULL
      `);
    }

    await queryRunner.query(`
      UPDATE "modelos_veiculo"
      SET "descricao_detalhada" = "nome"
      WHERE "descricao_detalhada" IS NULL
        AND "nome" IS NOT NULL
        AND TRIM("nome") <> ''
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable('modelos_veiculo'))) {
      return;
    }
    if (await queryRunner.hasColumn('modelos_veiculo', 'descricao_detalhada')) {
      await queryRunner.query(`
        ALTER TABLE "modelos_veiculo"
        DROP COLUMN "descricao_detalhada"
      `);
    }
  }
}
