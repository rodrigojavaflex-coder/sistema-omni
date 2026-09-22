import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * N pontos por irregularidade (mesma vista, máx. 10).
 * Mantém colunas legado em `irregularidades` sincronizadas com o 1º ponto.
 */
export class CreateIrregularidadesMarcacoes1745700000000
  implements MigrationInterface
{
  name = 'CreateIrregularidadesMarcacoes1745700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "irregularidades_marcacoes" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "criadoEm" TIMESTAMP NOT NULL DEFAULT now(),
        "atualizadoEm" TIMESTAMP NOT NULL DEFAULT now(),
        "id_irregularidade" uuid NOT NULL,
        "id_vista" uuid NOT NULL,
        "pos_x_pct" numeric(6,3) NOT NULL,
        "pos_y_pct" numeric(6,3) NOT NULL,
        "ordem" smallint NOT NULL DEFAULT 0,
        CONSTRAINT "PK_irregularidades_marcacoes" PRIMARY KEY ("id"),
        CONSTRAINT "FK_irreg_marcacoes_irregularidade"
          FOREIGN KEY ("id_irregularidade") REFERENCES "irregularidades"("id")
          ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_irreg_marcacoes_vista"
          FOREIGN KEY ("id_vista") REFERENCES "modelo_veiculo_vistas"("id")
          ON DELETE RESTRICT ON UPDATE NO ACTION,
        CONSTRAINT "CHK_irreg_marcacoes_pos"
          CHECK (
            "pos_x_pct" >= 0 AND "pos_x_pct" <= 100
            AND "pos_y_pct" >= 0 AND "pos_y_pct" <= 100
          ),
        CONSTRAINT "CHK_irreg_marcacoes_ordem"
          CHECK ("ordem" >= 0 AND "ordem" < 10)
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_irreg_marcacoes_irregularidade"
        ON "irregularidades_marcacoes" ("id_irregularidade")
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_irreg_marcacoes_vista"
        ON "irregularidades_marcacoes" ("id_vista")
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_irreg_marcacoes_ordem"
        ON "irregularidades_marcacoes" ("id_irregularidade", "ordem")
    `);

    await queryRunner.query(`
      INSERT INTO "irregularidades_marcacoes"
        ("id_irregularidade", "id_vista", "pos_x_pct", "pos_y_pct", "ordem")
      SELECT i."id", i."id_vista", i."pos_x_pct", i."pos_y_pct", 0
      FROM "irregularidades" i
      WHERE i."id_vista" IS NOT NULL
        AND i."pos_x_pct" IS NOT NULL
        AND i."pos_y_pct" IS NOT NULL
        AND NOT EXISTS (
          SELECT 1 FROM "irregularidades_marcacoes" m
          WHERE m."id_irregularidade" = i."id"
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "irregularidades_marcacoes"`);
  }
}
