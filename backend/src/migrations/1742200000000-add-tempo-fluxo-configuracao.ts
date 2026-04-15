import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTempoFluxoConfiguracao1742200000000 implements MigrationInterface {
  name = 'AddTempoFluxoConfiguracao1742200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "configuracoes"
      ADD COLUMN IF NOT EXISTS "tempoFluxoConfig" jsonb NULL
    `);

    await queryRunner.query(`
      UPDATE "configuracoes"
      SET "tempoFluxoConfig" = '{
        "tratamento": [
          { "minHoras": 0, "maxHoras": 24, "label": "", "corHex": "#64748b", "mostrarCor": false, "mostrarRotulo": false, "ativo": true },
          { "minHoras": 24, "maxHoras": 72, "label": "Atenção", "corHex": "#f59e0b", "mostrarCor": true, "mostrarRotulo": true, "ativo": true },
          { "minHoras": 72, "maxHoras": null, "label": "Crítico", "corHex": "#ef4444", "mostrarCor": true, "mostrarRotulo": true, "ativo": true }
        ],
        "manutencao": [
          { "minHoras": 0, "maxHoras": 24, "label": "", "corHex": "#64748b", "mostrarCor": false, "mostrarRotulo": false, "ativo": true },
          { "minHoras": 24, "maxHoras": 72, "label": "Atenção", "corHex": "#f59e0b", "mostrarCor": true, "mostrarRotulo": true, "ativo": true },
          { "minHoras": 72, "maxHoras": null, "label": "Crítico", "corHex": "#ef4444", "mostrarCor": true, "mostrarRotulo": true, "ativo": true }
        ],
        "validacaoFinal": [
          { "minHoras": 0, "maxHoras": 24, "label": "", "corHex": "#64748b", "mostrarCor": false, "mostrarRotulo": false, "ativo": true },
          { "minHoras": 24, "maxHoras": 72, "label": "Atenção", "corHex": "#f59e0b", "mostrarCor": true, "mostrarRotulo": true, "ativo": true },
          { "minHoras": 72, "maxHoras": null, "label": "Crítico", "corHex": "#ef4444", "mostrarCor": true, "mostrarRotulo": true, "ativo": true }
        ]
      }'::jsonb
      WHERE "tempoFluxoConfig" IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "configuracoes"
      DROP COLUMN IF EXISTS "tempoFluxoConfig"
    `);
  }
}
