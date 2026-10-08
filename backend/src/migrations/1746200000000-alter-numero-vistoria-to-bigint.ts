import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Amplia numero_vistoria para bigint (mesmo padrão de numero_irregularidade),
 * permitindo sequência sem teto de 999 (ex.: 20261000+).
 * Não remedia duplicatas históricas 2027000.
 */
export class AlterNumeroVistoriaToBigint1746200000000
  implements MigrationInterface
{
  name = 'AlterNumeroVistoriaToBigint1746200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vistorias" ALTER COLUMN "numero_vistoria" TYPE bigint USING "numero_vistoria"::bigint`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vistorias" ALTER COLUMN "numero_vistoria" TYPE integer USING "numero_vistoria"::integer`,
    );
  }
}
