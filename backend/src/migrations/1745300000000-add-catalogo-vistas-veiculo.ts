import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCatalogoVistasVeiculo1745300000000 implements MigrationInterface {
  name = 'AddCatalogoVistasVeiculo1745300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "vistas_veiculo" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "criadoEm" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        "atualizadoEm" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        "descricao" varchar(80) NOT NULL,
        "ativo" boolean NOT NULL DEFAULT true,
        "ordem" integer NOT NULL DEFAULT 0
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_VISTA_VEICULO_DESCRICAO"
      ON "vistas_veiculo" ("descricao")
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_VISTA_VEICULO_DESCRICAO_LOWER"
      ON "vistas_veiculo" (lower(trim("descricao")))
    `);

    await queryRunner.query(`
      INSERT INTO "vistas_veiculo" ("id", "criadoEm", "atualizadoEm", "descricao", "ativo", "ordem")
      SELECT uuid_generate_v4(), CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), d.descricao, true, 0
      FROM (
        SELECT DISTINCT ON (lower(trim(mv."descricao"))) trim(mv."descricao") AS descricao
        FROM "modelo_veiculo_vistas" mv
        WHERE trim(mv."descricao") <> ''
        ORDER BY lower(trim(mv."descricao")), mv."criadoEm" ASC
      ) d
      WHERE NOT EXISTS (
        SELECT 1 FROM "vistas_veiculo" v
        WHERE lower(trim(v."descricao")) = lower(d.descricao)
      )
    `);

    await queryRunner.query(`
      INSERT INTO "vistas_veiculo" ("id", "criadoEm", "atualizadoEm", "descricao", "ativo", "ordem")
      SELECT uuid_generate_v4(), CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), d.descricao, true, 0
      FROM (
        SELECT DISTINCT ON (lower(trim(x.descricao))) trim(x.descricao) AS descricao
        FROM "matriz_criticidade" m
        CROSS JOIN LATERAL unnest(COALESCE(m."vistas_descricao", '{}')) AS x(descricao)
        WHERE trim(x.descricao) <> ''
        ORDER BY lower(trim(x.descricao))
      ) d
      WHERE NOT EXISTS (
        SELECT 1 FROM "vistas_veiculo" v
        WHERE lower(trim(v."descricao")) = lower(d.descricao)
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "modelo_veiculo_vistas"
      ADD COLUMN IF NOT EXISTS "id_catalogo" uuid NULL
    `);
    await queryRunner.query(`
      UPDATE "modelo_veiculo_vistas" mv
      SET "id_catalogo" = v."id"
      FROM "vistas_veiculo" v
      WHERE mv."id_catalogo" IS NULL
        AND lower(trim(mv."descricao")) = lower(trim(v."descricao"))
    `);
    await queryRunner.query(`
      INSERT INTO "vistas_veiculo" ("id", "criadoEm", "atualizadoEm", "descricao", "ativo", "ordem")
      SELECT uuid_generate_v4(), CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), 'Sem descrição', true, 0
      WHERE EXISTS (
        SELECT 1 FROM "modelo_veiculo_vistas" WHERE "id_catalogo" IS NULL
      )
      AND NOT EXISTS (
        SELECT 1 FROM "vistas_veiculo" v
        WHERE lower(trim(v."descricao")) = lower('Sem descrição')
      )
    `);
    await queryRunner.query(`
      UPDATE "modelo_veiculo_vistas" mv
      SET "id_catalogo" = v."id"
      FROM "vistas_veiculo" v
      WHERE mv."id_catalogo" IS NULL
        AND lower(trim(v."descricao")) = lower('Sem descrição')
    `);
    await queryRunner.query(`
      DELETE FROM "modelo_veiculo_vistas" a
      USING "modelo_veiculo_vistas" b
      WHERE a."id_catalogo" IS NOT NULL
        AND a."id_catalogo" = b."id_catalogo"
        AND a."idmodelo" = b."idmodelo"
        AND a."criadoEm" > b."criadoEm"
        AND NOT EXISTS (
          SELECT 1 FROM "irregularidades" i WHERE i."id_vista" = a."id"
        )
    `);
    await queryRunner.query(`
      ALTER TABLE "modelo_veiculo_vistas"
      ALTER COLUMN "id_catalogo" SET NOT NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "modelo_veiculo_vistas"
      ADD CONSTRAINT "FK_MODELO_VEICULO_VISTA_CATALOGO"
      FOREIGN KEY ("id_catalogo") REFERENCES "vistas_veiculo"("id") ON DELETE RESTRICT
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_MODELO_VEICULO_VISTA_CATALOGO"
      ON "modelo_veiculo_vistas" ("idmodelo", "id_catalogo")
    `);

    await queryRunner.query(`
      ALTER TABLE "matriz_criticidade"
      ADD COLUMN IF NOT EXISTS "id_vistas" uuid[] NOT NULL DEFAULT '{}'
    `);
    await queryRunner.query(`
      UPDATE "matriz_criticidade" m
      SET "id_vistas" = COALESCE((
        SELECT array_agg(DISTINCT v."id")
        FROM unnest(COALESCE(m."vistas_descricao", '{}')) AS d(descricao)
        JOIN "vistas_veiculo" v
          ON lower(trim(v."descricao")) = lower(trim(d.descricao))
        WHERE trim(d.descricao) <> ''
      ), '{}')
    `);
    await queryRunner.query(`
      ALTER TABLE "matriz_criticidade"
      DROP COLUMN IF EXISTS "vistas_descricao"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "matriz_criticidade"
      ADD COLUMN IF NOT EXISTS "vistas_descricao" text[] NOT NULL DEFAULT '{}'
    `);
    await queryRunner.query(`
      UPDATE "matriz_criticidade" m
      SET "vistas_descricao" = COALESCE((
        SELECT array_agg(v."descricao" ORDER BY v."descricao")
        FROM "vistas_veiculo" v
        WHERE v."id" = ANY(m."id_vistas")
      ), '{}')
    `);
    await queryRunner.query(`
      ALTER TABLE "matriz_criticidade"
      DROP COLUMN IF EXISTS "id_vistas"
    `);

    await queryRunner.query(
      `DROP INDEX IF EXISTS "UQ_MODELO_VEICULO_VISTA_CATALOGO"`,
    );
    await queryRunner.query(`
      ALTER TABLE "modelo_veiculo_vistas"
      DROP CONSTRAINT IF EXISTS "FK_MODELO_VEICULO_VISTA_CATALOGO"
    `);
    await queryRunner.query(`
      ALTER TABLE "modelo_veiculo_vistas"
      DROP COLUMN IF EXISTS "id_catalogo"
    `);

    await queryRunner.query(
      `DROP INDEX IF EXISTS "UQ_VISTA_VEICULO_DESCRICAO_LOWER"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_VISTA_VEICULO_DESCRICAO"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "vistas_veiculo"`);
  }
}
