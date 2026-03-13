import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class IrregularidadesMidias1739510000000 implements MigrationInterface {
  name = 'IrregularidadesMidias1739510000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable('irregularidades_midias'))) {
      await queryRunner.createTable(
        new Table({
          name: 'irregularidades_midias',
          columns: [
            { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
            { name: 'criadoEm', type: 'timestamp', default: 'CURRENT_TIMESTAMP(6)' },
            { name: 'atualizadoEm', type: 'timestamp', default: 'CURRENT_TIMESTAMP(6)' },
            { name: 'tipo', type: 'varchar', length: '20' },
            { name: 'nome_arquivo', type: 'varchar', length: '255' },
            { name: 'mime_type', type: 'varchar', length: '100' },
            { name: 'tamanho', type: 'bigint' },
            { name: 'dados_bytea', type: 'bytea' },
            { name: 'duracao_ms', type: 'integer', isNullable: true },
            { name: 'idirregularidade', type: 'uuid' },
          ],
        }),
      );
      await queryRunner.createForeignKey(
        'irregularidades_midias',
        new TableForeignKey({
          columnNames: ['idirregularidade'],
          referencedTableName: 'irregularidades',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );
      await queryRunner.query(
        'CREATE INDEX IF NOT EXISTS idx_irregularidades_midias_irreg ON irregularidades_midias(idirregularidade)',
      );
    }

    if (await queryRunner.hasTable('irregularidades_imagens')) {
      await queryRunner.dropTable('irregularidades_imagens');
    }

    const irregularidades = await queryRunner.getTable('irregularidades');
    if (irregularidades) {
      const cols = ['audio_nome_arquivo', 'audio_mime_type', 'audio_tamanho', 'audio_duracao_ms', 'audio_dados_bytea'];
      for (const col of cols) {
        if (irregularidades.findColumnByName(col)) {
          await queryRunner.query(`ALTER TABLE "irregularidades" DROP COLUMN IF EXISTS "${col}"`);
        }
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const irregularidades = await queryRunner.getTable('irregularidades');
    if (irregularidades) {
      await queryRunner.query(
        `ALTER TABLE "irregularidades" ADD COLUMN IF NOT EXISTS "audio_nome_arquivo" varchar(255)`,
      );
      await queryRunner.query(
        `ALTER TABLE "irregularidades" ADD COLUMN IF NOT EXISTS "audio_mime_type" varchar(100)`,
      );
      await queryRunner.query(
        `ALTER TABLE "irregularidades" ADD COLUMN IF NOT EXISTS "audio_tamanho" bigint`,
      );
      await queryRunner.query(
        `ALTER TABLE "irregularidades" ADD COLUMN IF NOT EXISTS "audio_duracao_ms" integer`,
      );
      await queryRunner.query(
        `ALTER TABLE "irregularidades" ADD COLUMN IF NOT EXISTS "audio_dados_bytea" bytea`,
      );
    }

    if (await queryRunner.hasTable('irregularidades_midias')) {
      await queryRunner.dropTable('irregularidades_midias');
    }

    if (!(await queryRunner.hasTable('irregularidades_imagens'))) {
      await queryRunner.createTable(
        new Table({
          name: 'irregularidades_imagens',
          columns: [
            { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
            { name: 'criadoEm', type: 'timestamp', default: 'CURRENT_TIMESTAMP(6)' },
            { name: 'atualizadoEm', type: 'timestamp', default: 'CURRENT_TIMESTAMP(6)' },
            { name: 'nome_arquivo', type: 'varchar', length: '255' },
            { name: 'tamanho', type: 'bigint' },
            { name: 'dados_bytea', type: 'bytea' },
            { name: 'idirregularidade', type: 'uuid' },
          ],
        }),
      );
      await queryRunner.createForeignKey(
        'irregularidades_imagens',
        new TableForeignKey({
          columnNames: ['idirregularidade'],
          referencedTableName: 'irregularidades',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );
    }
  }
}
