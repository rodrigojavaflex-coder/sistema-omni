import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Remove a coluna permite_nova_irregularidade_se_ja_existe de matriz_criticidade.
 * A regra de bloqueio por pendência foi descontinuada.
 */
export class DropPermiteNovaIrregularidadeMatriz1739530000000
  implements MigrationInterface
{
  name = 'DropPermiteNovaIrregularidadeMatriz1739530000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const tabela = await queryRunner.getTable('matriz_criticidade');
    if (tabela?.findColumnByName('permite_nova_irregularidade_se_ja_existe')) {
      await queryRunner.query(
        `ALTER TABLE "matriz_criticidade" DROP COLUMN "permite_nova_irregularidade_se_ja_existe"`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tabela = await queryRunner.getTable('matriz_criticidade');
    if (tabela && !tabela.findColumnByName('permite_nova_irregularidade_se_ja_existe')) {
      await queryRunner.query(
        `ALTER TABLE "matriz_criticidade" ADD COLUMN "permite_nova_irregularidade_se_ja_existe" boolean NOT NULL DEFAULT false`,
      );
    }
  }
}
