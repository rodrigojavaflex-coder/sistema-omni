import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * INFOBUS KM detalhado: motoristas[].tipo_viagem → veiculo_escala_turno.tipo_viagem.
 * Dados serão reimportados no próximo sync (sem migração de conteúdo).
 */
export class EscalaTurnoTipoViagem1747600000000 implements MigrationInterface {
  name = 'EscalaTurnoTipoViagem1747600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasColumn('veiculo_escala_turno', 'tipo_viagem'))) {
      await queryRunner.query(`
        ALTER TABLE "veiculo_escala_turno"
        ADD COLUMN "tipo_viagem" varchar(40) NULL
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasColumn('veiculo_escala_turno', 'tipo_viagem')) {
      await queryRunner.query(`
        ALTER TABLE "veiculo_escala_turno"
        DROP COLUMN "tipo_viagem"
      `);
    }
  }
}
