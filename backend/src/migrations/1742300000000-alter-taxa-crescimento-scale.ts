import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTaxaCrescimentoScale1742300000000 implements MigrationInterface {
  name = 'AlterTaxaCrescimentoScale1742300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "metas"
      ALTER COLUMN "taxaDeCrescimento" TYPE numeric(14,4)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "metas"
      ALTER COLUMN "taxaDeCrescimento" TYPE numeric(14,2)
    `);
  }
}
