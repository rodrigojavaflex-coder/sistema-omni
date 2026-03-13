import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPermiteNovaIrregularidadeMatriz1739500000000
  implements MigrationInterface
{
  name = 'AddPermiteNovaIrregularidadeMatriz1739500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const tabela = await queryRunner.getTable('matriz_criticidade');
    if (tabela && !tabela.findColumnByName('permite_nova_irregularidade_se_ja_existe')) {
      await queryRunner.query(
        `ALTER TABLE "matriz_criticidade" ADD COLUMN "permite_nova_irregularidade_se_ja_existe" boolean NOT NULL DEFAULT false`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tabela = await queryRunner.getTable('matriz_criticidade');
    if (tabela?.findColumnByName('permite_nova_irregularidade_se_ja_existe')) {
      await queryRunner.query(
        `ALTER TABLE "matriz_criticidade" DROP COLUMN "permite_nova_irregularidade_se_ja_existe"`,
      );
    }
  }
}
