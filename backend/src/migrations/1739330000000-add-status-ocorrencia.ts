import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusOcorrencia1739330000000 implements MigrationInterface {
  name = 'AddStatusOcorrencia1739330000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('ocorrencias');
    if (table && !table.findColumnByName('status')) {
      await queryRunner.query(
        `ALTER TABLE "ocorrencias" ADD COLUMN "status" varchar(20) NOT NULL DEFAULT 'Registrada'`,
      );
      await queryRunner.query(
        `CREATE INDEX "IDX_OCORRENCIAS_STATUS" ON "ocorrencias" ("status")`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('ocorrencias');
    if (table?.findColumnByName('status')) {
      await queryRunner.query(
        `DROP INDEX IF EXISTS "IDX_OCORRENCIAS_STATUS"`,
      );
      await queryRunner.query(`ALTER TABLE "ocorrencias" DROP COLUMN "status"`);
    }
  }
}
