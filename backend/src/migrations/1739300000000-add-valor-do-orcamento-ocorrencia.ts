import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddValorDoOrcamentoOcorrencia1739300000000
  implements MigrationInterface
{
  name = 'AddValorDoOrcamentoOcorrencia1739300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const tabela = await queryRunner.getTable('ocorrencias');
    if (tabela && !tabela.findColumnByName('valorDoOrcamento')) {
      await queryRunner.query(
        `ALTER TABLE "ocorrencias" ADD COLUMN "valorDoOrcamento" decimal(15,2)`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tabela = await queryRunner.getTable('ocorrencias');
    if (tabela?.findColumnByName('valorDoOrcamento')) {
      await queryRunner.query(
        `ALTER TABLE "ocorrencias" DROP COLUMN "valorDoOrcamento"`,
      );
    }
  }
}
