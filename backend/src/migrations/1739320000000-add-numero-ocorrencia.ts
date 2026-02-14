import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNumeroOcorrencia1739320000000 implements MigrationInterface {
  name = 'AddNumeroOcorrencia1739320000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('ocorrencias');
    if (table && !table.findColumnByName('numero')) {
      await queryRunner.query(
        `ALTER TABLE "ocorrencias" ADD COLUMN "numero" varchar(20) UNIQUE`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('ocorrencias');
    if (table?.findColumnByName('numero')) {
      await queryRunner.query(`ALTER TABLE "ocorrencias" DROP COLUMN "numero"`);
    }
  }
}
