import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Normaliza detalhe da escala (antes em veiculo_escala_dia.linhas_json)
 * para tabela veiculo_escala_turno (turnos/linhas/motoristas + campos opcionais novos).
 */
export class NormalizeVeiculoEscalaTurno1747200000000
  implements MigrationInterface
{
  name = 'NormalizeVeiculoEscalaTurno1747200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "veiculo_escala_turno" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "criadoEm" TIMESTAMP NOT NULL DEFAULT now(),
        "atualizadoEm" TIMESTAMP NOT NULL DEFAULT now(),
        "id_escala_dia" uuid NOT NULL,
        "linha" varchar(120) NULL,
        "descricao_linha" varchar(255) NULL,
        "km" numeric(12,2) NULL,
        "matricula" varchar(40) NULL,
        "motorista" varchar(255) NULL,
        "nome_turno" varchar(80) NULL,
        "numero_viagem" varchar(80) NULL,
        "horario_inicio" varchar(16) NULL,
        "horario_fim" varchar(16) NULL,
        "ordem" integer NOT NULL DEFAULT 0,
        CONSTRAINT "FK_veiculo_escala_turno_escala_dia"
          FOREIGN KEY ("id_escala_dia") REFERENCES "veiculo_escala_dia"("id")
          ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_veiculo_escala_turno_escala_dia"
      ON "veiculo_escala_turno" ("id_escala_dia")
    `);

    if (await queryRunner.hasColumn('veiculo_escala_dia', 'linhas_json')) {
      await queryRunner.query(`
        INSERT INTO "veiculo_escala_turno" (
          "id_escala_dia",
          "linha",
          "km",
          "matricula",
          "motorista",
          "ordem"
        )
        SELECT
          e."id",
          NULLIF(TRIM(linha_item->>'linha'), ''),
          CASE
            WHEN mot ? 'km' AND (mot->>'km') ~ '^-?[0-9]+(\\.[0-9]+)?$'
              THEN (mot->>'km')::numeric
            WHEN linha_item ? 'km' AND (linha_item->>'km') ~ '^-?[0-9]+(\\.[0-9]+)?$'
              THEN (linha_item->>'km')::numeric
            ELSE NULL
          END,
          NULLIF(TRIM(COALESCE(mot->>'matricula', '')), ''),
          NULLIF(TRIM(COALESCE(mot->>'motorista', '')), ''),
          (linha_ord.ordinality::integer - 1) * 1000
            + COALESCE(mot_ord.ordinality::integer - 1, 0)
        FROM "veiculo_escala_dia" e
        CROSS JOIN LATERAL jsonb_array_elements(
          CASE
            WHEN jsonb_typeof(e."linhas_json") = 'array' THEN e."linhas_json"
            ELSE '[]'::jsonb
          END
        ) WITH ORDINALITY AS linha_ord(linha_item, ordinality)
        CROSS JOIN LATERAL jsonb_array_elements(
          CASE
            WHEN jsonb_typeof(linha_item->'motoristas') = 'array'
              AND jsonb_array_length(linha_item->'motoristas') > 0
              THEN linha_item->'motoristas'
            ELSE jsonb_build_array('{}'::jsonb)
          END
        ) WITH ORDINALITY AS mot_ord(mot, ordinality)
        WHERE e."linhas_json" IS NOT NULL
      `);

      await queryRunner.query(`
        ALTER TABLE "veiculo_escala_dia"
        DROP COLUMN "linhas_json"
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasColumn('veiculo_escala_dia', 'linhas_json'))) {
      await queryRunner.query(`
        ALTER TABLE "veiculo_escala_dia"
        ADD COLUMN "linhas_json" jsonb NULL
      `);
    }

    await queryRunner.query(`
      UPDATE "veiculo_escala_dia" e
      SET "linhas_json" = agg.payload
      FROM (
        SELECT
          t."id_escala_dia",
          jsonb_agg(
            jsonb_build_object(
              'linha', t."linha",
              'km', t."km",
              'motoristas', jsonb_build_array(
                jsonb_build_object(
                  'matricula', t."matricula",
                  'motorista', t."motorista",
                  'km', t."km"
                )
              )
            )
            ORDER BY t."ordem", t."criadoEm"
          ) AS payload
        FROM "veiculo_escala_turno" t
        GROUP BY t."id_escala_dia"
      ) agg
      WHERE e."id" = agg."id_escala_dia"
    `);

    await queryRunner.query(`DROP TABLE IF EXISTS "veiculo_escala_turno"`);
  }
}
