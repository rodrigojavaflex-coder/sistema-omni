import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNumeroVistoria1739520000000 implements MigrationInterface {
  name = 'AddNumeroVistoria1739520000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vistorias" ADD COLUMN "numero_vistoria" integer`,
    );

    // Backfill: assign year*1000 + row_number per year (ordered by datavistoria)
    await queryRunner.query(`
      WITH ranked AS (
        SELECT id, datavistoria,
               EXTRACT(YEAR FROM "datavistoria")::int AS ano,
               ROW_NUMBER() OVER (PARTITION BY EXTRACT(YEAR FROM "datavistoria") ORDER BY "datavistoria", "criadoEm") AS rn
        FROM vistorias
        WHERE numero_vistoria IS NULL
      )
      UPDATE vistorias v
      SET numero_vistoria = (r.ano * 1000 + r.rn)
      FROM ranked r
      WHERE v.id = r.id
    `);

    await queryRunner.query(
      `ALTER TABLE "vistorias" ALTER COLUMN "numero_vistoria" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vistorias" DROP COLUMN "numero_vistoria"`,
    );
  }
}
