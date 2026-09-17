import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMapaAvariaModelo1745100000000 implements MigrationInterface {
  name = 'AddMapaAvariaModelo1745100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "modelo_veiculo_vistas" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "criadoEm" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        "atualizadoEm" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        "idmodelo" uuid NOT NULL,
        "descricao" varchar(80) NOT NULL,
        "ordem" integer NOT NULL DEFAULT 0,
        "mime_type" varchar(100) NOT NULL,
        "nome_arquivo" varchar(255) NOT NULL,
        "tamanho" bigint NOT NULL,
        "dados_bytea" bytea NOT NULL,
        "ativo" boolean NOT NULL DEFAULT true
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_MODELO_VEICULO_VISTA_MODELO"
      ON "modelo_veiculo_vistas" ("idmodelo")
    `);
    await queryRunner.query(`
      ALTER TABLE "modelo_veiculo_vistas"
      ADD CONSTRAINT "FK_MODELO_VEICULO_VISTA_MODELO"
      FOREIGN KEY ("idmodelo") REFERENCES "modelos_veiculo"("id") ON DELETE RESTRICT
    `);

    await queryRunner.query(`
      ALTER TABLE "sintomas"
      ADD COLUMN IF NOT EXISTS "exige_marcacao_mapa" boolean NOT NULL DEFAULT false
    `);

    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      ADD COLUMN IF NOT EXISTS "id_vista" uuid NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      ADD COLUMN IF NOT EXISTS "pos_x_pct" numeric(6,3) NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      ADD COLUMN IF NOT EXISTS "pos_y_pct" numeric(6,3) NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      ADD CONSTRAINT "FK_IRREGULARIDADE_VISTA"
      FOREIGN KEY ("id_vista") REFERENCES "modelo_veiculo_vistas"("id") ON DELETE RESTRICT
    `);
    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      ADD CONSTRAINT "CHK_IRREGULARIDADE_MARCACAO"
      CHECK (
        ("id_vista" IS NULL AND "pos_x_pct" IS NULL AND "pos_y_pct" IS NULL)
        OR (
          "id_vista" IS NOT NULL
          AND "pos_x_pct" IS NOT NULL AND "pos_x_pct" >= 0 AND "pos_x_pct" <= 100
          AND "pos_y_pct" IS NOT NULL AND "pos_y_pct" >= 0 AND "pos_y_pct" <= 100
        )
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_IRREGULARIDADE_VISTA"
      ON "irregularidades" ("id_vista")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_IRREGULARIDADE_VISTA"`,
    );
    await queryRunner.query(
      `ALTER TABLE "irregularidades" DROP CONSTRAINT IF EXISTS "CHK_IRREGULARIDADE_MARCACAO"`,
    );
    await queryRunner.query(
      `ALTER TABLE "irregularidades" DROP CONSTRAINT IF EXISTS "FK_IRREGULARIDADE_VISTA"`,
    );
    await queryRunner.query(
      `ALTER TABLE "irregularidades" DROP COLUMN IF EXISTS "pos_y_pct"`,
    );
    await queryRunner.query(
      `ALTER TABLE "irregularidades" DROP COLUMN IF EXISTS "pos_x_pct"`,
    );
    await queryRunner.query(
      `ALTER TABLE "irregularidades" DROP COLUMN IF EXISTS "id_vista"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sintomas" DROP COLUMN IF EXISTS "exige_marcacao_mapa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "modelo_veiculo_vistas" DROP CONSTRAINT IF EXISTS "FK_MODELO_VEICULO_VISTA_MODELO"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_MODELO_VEICULO_VISTA_MODELO"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "modelo_veiculo_vistas"`);
  }
}
