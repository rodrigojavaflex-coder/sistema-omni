import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Remove a coluna idtipovistoria da tabela vistorias.
 * O tipo de vistoria foi removido do sistema; o mobile e a API não enviam mais esse campo.
 */
export class DropIdtipovistoriaVistorias1739420000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('vistorias');
    const column = table?.findColumnByName('idtipovistoria');
    if (column) {
      await queryRunner.query(
        `ALTER TABLE "vistorias" DROP COLUMN IF EXISTS "idtipovistoria" CASCADE`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('vistorias');
    const column = table?.findColumnByName('idtipovistoria');
    if (!column) {
      await queryRunner.query(
        `ALTER TABLE "vistorias" ADD COLUMN "idtipovistoria" uuid`,
      );
    }
  }
}
