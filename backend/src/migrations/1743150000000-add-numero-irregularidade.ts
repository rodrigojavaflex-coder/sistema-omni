import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNumeroIrregularidade1743150000000 implements MigrationInterface {
  name = 'AddNumeroIrregularidade1743150000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "irregularidades" ADD COLUMN "numero_irregularidade" bigint`,
    );

    await queryRunner.query(`
      WITH ranked AS (
        SELECT
          id,
          EXTRACT(YEAR FROM COALESCE("criadoEm", NOW()))::int AS ano,
          ROW_NUMBER() OVER (
            PARTITION BY EXTRACT(YEAR FROM COALESCE("criadoEm", NOW()))
            ORDER BY COALESCE("criadoEm", NOW()), id
          ) AS rn
        FROM irregularidades
        WHERE numero_irregularidade IS NULL
      )
      UPDATE irregularidades i
      SET numero_irregularidade = ((r.ano::text || r.rn::text)::bigint)
      FROM ranked r
      WHERE i.id = r.id
    `);

    await queryRunner.query(
      `ALTER TABLE "irregularidades" ALTER COLUMN "numero_irregularidade" SET NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_IRREGULARIDADE_NUMERO" ON "irregularidades" ("numero_irregularidade")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."UQ_IRREGULARIDADE_NUMERO"`,
    );
    await queryRunner.query(
      `ALTER TABLE "irregularidades" DROP COLUMN "numero_irregularidade"`,
    );
  }
}
