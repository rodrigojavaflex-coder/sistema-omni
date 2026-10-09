import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddErpCodigoPedidoIrregularidade1746300000000
  implements MigrationInterface
{
  name = 'AddErpCodigoPedidoIrregularidade1746300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      ADD COLUMN IF NOT EXISTS "erp_codigo_pedido" varchar(50) NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      ADD COLUMN IF NOT EXISTS "erp_enviado_em" TIMESTAMP NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      ADD COLUMN IF NOT EXISTS "erp_ultimo_erro" text NULL
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_IRREGULARIDADE_ERP_CODIGO"
      ON "irregularidades" ("erp_codigo_pedido")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_IRREGULARIDADE_ERP_CODIGO"`,
    );
    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      DROP COLUMN IF EXISTS "erp_ultimo_erro"
    `);
    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      DROP COLUMN IF EXISTS "erp_enviado_em"
    `);
    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      DROP COLUMN IF EXISTS "erp_codigo_pedido"
    `);
  }
}
