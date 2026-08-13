import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * os_orig enviado à BRT = numeroIrregularidade (pode repetir em novas tentativas
 * da mesma irregularidade). O índice único global impedia histórico de retentativas.
 */
export class DropUniqueOsOrigIrregularidadesOsExternas1744900000000
  implements MigrationInterface
{
  name = 'DropUniqueOsOrigIrregularidadesOsExternas1744900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_IRREG_OS_EXT_OS_ORIG"`);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_IRREG_OS_EXT_OS_ORIG"
      ON "irregularidades_os_externas" ("os_orig")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_IRREG_OS_EXT_OS_ORIG"`);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_IRREG_OS_EXT_OS_ORIG"
      ON "irregularidades_os_externas" ("os_orig")
    `);
  }
}
