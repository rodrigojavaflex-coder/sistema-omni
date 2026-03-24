import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Remove a coluna legada `modelo` da tabela `veiculos`.
 * O nome do modelo passa a vir apenas de `modelos_veiculo` via `idmodelo`.
 */
export class DropModeloVeiculos1739540000000 implements MigrationInterface {
  name = 'DropModeloVeiculos1739540000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('veiculos');
    const column = table?.findColumnByName('modelo');
    if (column) {
      await queryRunner.query(
        `ALTER TABLE "veiculos" DROP COLUMN IF EXISTS "modelo"`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('veiculos');
    const column = table?.findColumnByName('modelo');
    if (!column) {
      await queryRunner.query(
        `ALTER TABLE "veiculos" ADD COLUMN "modelo" character varying(50)`,
      );
    }
  }
}
