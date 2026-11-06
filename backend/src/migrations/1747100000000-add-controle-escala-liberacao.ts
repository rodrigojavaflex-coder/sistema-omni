import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Controle de Escala e Liberação:
 * - consumo no modelo (km/% e km/L)
 * - config Escala INFOBUS
 * - tabelas escala do dia e telemetria atual
 */
export class AddControleEscalaLiberacao1747100000000
  implements MigrationInterface
{
  name = 'AddControleEscalaLiberacao1747100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('modelos_veiculo')) {
      if (!(await queryRunner.hasColumn('modelos_veiculo', 'km_por_percentual'))) {
        await queryRunner.query(`
          ALTER TABLE "modelos_veiculo"
          ADD COLUMN "km_por_percentual" numeric(10,2) NULL
        `);
      }
      if (!(await queryRunner.hasColumn('modelos_veiculo', 'km_por_litro'))) {
        await queryRunner.query(`
          ALTER TABLE "modelos_veiculo"
          ADD COLUMN "km_por_litro" numeric(10,2) NULL
        `);
      }
    }

    if (await queryRunner.hasTable('configuracoes')) {
      if (
        !(await queryRunner.hasColumn('configuracoes', 'escala_infobus_config'))
      ) {
        await queryRunner.query(`
          ALTER TABLE "configuracoes"
          ADD COLUMN "escala_infobus_config" jsonb NULL
        `);
      }
    }

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "veiculo_escala_dia" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "criadoEm" TIMESTAMP NOT NULL DEFAULT now(),
        "atualizadoEm" TIMESTAMP NOT NULL DEFAULT now(),
        "data" date NOT NULL,
        "prefixo" varchar(30) NOT NULL,
        "id_veiculo" uuid NULL,
        "km_total" numeric(12,2) NOT NULL DEFAULT 0,
        "linhas_json" jsonb NULL,
        "sincronizado_em" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_veiculo_escala_dia_veiculo"
          FOREIGN KEY ("id_veiculo") REFERENCES "veiculos"("id")
          ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_veiculo_escala_dia_data_prefixo"
      ON "veiculo_escala_dia" ("data", "prefixo")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_veiculo_escala_dia_data"
      ON "veiculo_escala_dia" ("data")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_veiculo_escala_dia_veiculo"
      ON "veiculo_escala_dia" ("id_veiculo")
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "veiculo_telemetria_atual" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "criadoEm" TIMESTAMP NOT NULL DEFAULT now(),
        "atualizadoEm" TIMESTAMP NOT NULL DEFAULT now(),
        "prefixo" varchar(30) NOT NULL,
        "id_veiculo" uuid NULL,
        "veiculo_id_brt" integer NULL,
        "data_hora" TIMESTAMP NULL,
        "latitude" numeric(12,8) NULL,
        "longitude" numeric(12,8) NULL,
        "bateria" numeric(6,2) NULL,
        "autonomia" numeric(12,2) NULL,
        "odometro" numeric(14,2) NULL,
        "sincronizado_em" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_veiculo_telemetria_veiculo"
          FOREIGN KEY ("id_veiculo") REFERENCES "veiculos"("id")
          ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_veiculo_telemetria_prefixo"
      ON "veiculo_telemetria_atual" ("prefixo")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_veiculo_telemetria_veiculo"
      ON "veiculo_telemetria_atual" ("id_veiculo")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "veiculo_telemetria_atual"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "veiculo_escala_dia"`);

    if (await queryRunner.hasTable('configuracoes')) {
      if (await queryRunner.hasColumn('configuracoes', 'escala_infobus_config')) {
        await queryRunner.query(`
          ALTER TABLE "configuracoes"
          DROP COLUMN "escala_infobus_config"
        `);
      }
    }

    if (await queryRunner.hasTable('modelos_veiculo')) {
      if (await queryRunner.hasColumn('modelos_veiculo', 'km_por_litro')) {
        await queryRunner.query(`
          ALTER TABLE "modelos_veiculo"
          DROP COLUMN "km_por_litro"
        `);
      }
      if (await queryRunner.hasColumn('modelos_veiculo', 'km_por_percentual')) {
        await queryRunner.query(`
          ALTER TABLE "modelos_veiculo"
          DROP COLUMN "km_por_percentual"
        `);
      }
    }
  }
}
