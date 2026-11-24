import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * INFOBUS KM detalhado: linhas[] → grupos[].
 * Persiste grupo, alocacao e tarefa em veiculo_escala_turno.
 * Dados serão reimportados no próximo sync (sem migração de conteúdo).
 */
export class EscalaTurnoGrupoAlocacaoTarefa1747500000000
  implements MigrationInterface
{
  name = 'EscalaTurnoGrupoAlocacaoTarefa1747500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasColumn('veiculo_escala_turno', 'linha')) {
      await queryRunner.query(`
        ALTER TABLE "veiculo_escala_turno"
        RENAME COLUMN "linha" TO "grupo"
      `);
    } else if (!(await queryRunner.hasColumn('veiculo_escala_turno', 'grupo'))) {
      await queryRunner.query(`
        ALTER TABLE "veiculo_escala_turno"
        ADD COLUMN "grupo" varchar(255) NULL
      `);
    }

    if (await queryRunner.hasColumn('veiculo_escala_turno', 'descricao_linha')) {
      await queryRunner.query(`
        ALTER TABLE "veiculo_escala_turno"
        DROP COLUMN "descricao_linha"
      `);
    }

    if (!(await queryRunner.hasColumn('veiculo_escala_turno', 'alocacao'))) {
      await queryRunner.query(`
        ALTER TABLE "veiculo_escala_turno"
        ADD COLUMN "alocacao" varchar(255) NULL
      `);
    }

    if (!(await queryRunner.hasColumn('veiculo_escala_turno', 'tarefa'))) {
      await queryRunner.query(`
        ALTER TABLE "veiculo_escala_turno"
        ADD COLUMN "tarefa" varchar(80) NULL
      `);
    }

    // Amplia grupo se ainda estiver em 120 (rename preserva tamanho).
    await queryRunner.query(`
      ALTER TABLE "veiculo_escala_turno"
      ALTER COLUMN "grupo" TYPE varchar(255)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasColumn('veiculo_escala_turno', 'tarefa')) {
      await queryRunner.query(`
        ALTER TABLE "veiculo_escala_turno"
        DROP COLUMN "tarefa"
      `);
    }
    if (await queryRunner.hasColumn('veiculo_escala_turno', 'alocacao')) {
      await queryRunner.query(`
        ALTER TABLE "veiculo_escala_turno"
        DROP COLUMN "alocacao"
      `);
    }
    if (!(await queryRunner.hasColumn('veiculo_escala_turno', 'descricao_linha'))) {
      await queryRunner.query(`
        ALTER TABLE "veiculo_escala_turno"
        ADD COLUMN "descricao_linha" varchar(255) NULL
      `);
    }
    if (await queryRunner.hasColumn('veiculo_escala_turno', 'grupo')) {
      await queryRunner.query(`
        ALTER TABLE "veiculo_escala_turno"
        ALTER COLUMN "grupo" TYPE varchar(120)
      `);
      await queryRunner.query(`
        ALTER TABLE "veiculo_escala_turno"
        RENAME COLUMN "grupo" TO "linha"
      `);
    }
  }
}
