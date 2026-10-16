import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Snapshot do comentário/motivo da situação BRT atual (ex.: Paralisada)
 * para exibir no card da Manutenção sem consultar a timeline a cada listagem.
 */
export class AddStatusBrtComentarioIrregularidade1746900000000
  implements MigrationInterface
{
  name = 'AddStatusBrtComentarioIrregularidade1746900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      ADD COLUMN IF NOT EXISTS "status_brt_comentario" text NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "irregularidades"
      DROP COLUMN IF EXISTS "status_brt_comentario"
    `);
  }
}
