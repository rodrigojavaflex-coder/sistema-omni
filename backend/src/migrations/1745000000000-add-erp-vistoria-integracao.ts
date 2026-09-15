import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddErpVistoriaIntegracao1745000000000 implements MigrationInterface {
  name = 'AddErpVistoriaIntegracao1745000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "configuracoes"
      ADD COLUMN IF NOT EXISTS "erpVistoriaConfig" jsonb NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "vistorias"
      ADD COLUMN IF NOT EXISTS "erp_status" varchar(20) NOT NULL DEFAULT 'NAO_APLICA'
    `);
    await queryRunner.query(`
      ALTER TABLE "vistorias"
      ADD COLUMN IF NOT EXISTS "erp_numero_vistoria" varchar(50) NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "vistorias"
      ADD COLUMN IF NOT EXISTS "erp_enviado_em" timestamp NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "vistorias"
      ADD COLUMN IF NOT EXISTS "erp_ultimo_erro" text NULL
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_VISTORIA_ERP_STATUS"
      ON "vistorias" ("erp_status")
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_VISTORIA_ERP_NUMERO"
      ON "vistorias" ("erp_numero_vistoria")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_VISTORIA_ERP_NUMERO"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_VISTORIA_ERP_STATUS"`);
    await queryRunner.query(
      `ALTER TABLE "vistorias" DROP COLUMN IF EXISTS "erp_ultimo_erro"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vistorias" DROP COLUMN IF EXISTS "erp_enviado_em"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vistorias" DROP COLUMN IF EXISTS "erp_numero_vistoria"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vistorias" DROP COLUMN IF EXISTS "erp_status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "configuracoes" DROP COLUMN IF EXISTS "erpVistoriaConfig"`,
    );
  }
}
