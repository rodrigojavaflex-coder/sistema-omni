import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class AddModelosVeiculo1739410000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable('modelos_veiculo'))) {
      await queryRunner.createTable(
        new Table({
          name: 'modelos_veiculo',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              default: 'uuid_generate_v4()',
            },
            {
              name: 'criadoEm',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP(6)',
            },
            {
              name: 'atualizadoEm',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP(6)',
            },
            {
              name: 'nome',
              type: 'varchar',
              length: '80',
              isUnique: true,
            },
            {
              name: 'ativo',
              type: 'boolean',
              default: true,
            },
          ],
        }),
      );
      await queryRunner.createIndex(
        'modelos_veiculo',
        new TableIndex({
          name: 'IDX_MODELO_VEICULO_NOME',
          columnNames: ['nome'],
          isUnique: true,
        }),
      );
    }

    if (!(await queryRunner.hasColumn('veiculos', 'idmodelo'))) {
      await queryRunner.query('ALTER TABLE veiculos ADD COLUMN idmodelo uuid');
    }

    await queryRunner.query(`
      INSERT INTO modelos_veiculo (id, "criadoEm", "atualizadoEm", nome, ativo)
      SELECT uuid_generate_v4(), CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), v.modelo, true
      FROM veiculos v
      WHERE v.modelo IS NOT NULL AND v.modelo <> ''
      GROUP BY v.modelo
      ON CONFLICT (nome) DO NOTHING
    `);

    await queryRunner.query(`
      UPDATE veiculos v
      SET idmodelo = mv.id
      FROM modelos_veiculo mv
      WHERE v.modelo = mv.nome AND v.idmodelo IS NULL
    `);

    const fkVeiculosExists = await queryRunner.query(`
      SELECT 1 FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu ON tc.constraint_schema = kcu.constraint_schema AND tc.constraint_name = kcu.constraint_name
      WHERE tc.table_schema = 'public' AND tc.table_name = 'veiculos' AND tc.constraint_type = 'FOREIGN KEY' AND kcu.column_name = 'idmodelo'
      LIMIT 1
    `);
    if (!fkVeiculosExists?.length) {
      await queryRunner.createForeignKey(
        'veiculos',
        new TableForeignKey({
          columnNames: ['idmodelo'],
          referencedTableName: 'modelos_veiculo',
          referencedColumnNames: ['id'],
        }),
      );
    }
    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS idx_veiculos_modelo ON veiculos(idmodelo)',
    );

    if (await queryRunner.hasColumn('areas_modelos', 'modelo')) {
      if (!(await queryRunner.hasColumn('areas_modelos', 'idmodelo'))) {
        await queryRunner.query('ALTER TABLE areas_modelos ADD COLUMN idmodelo uuid');
      }
      await queryRunner.query(`
        UPDATE areas_modelos am
        SET idmodelo = mv.id
        FROM modelos_veiculo mv
        WHERE am.modelo = mv.nome AND am.idmodelo IS NULL
      `);
      await queryRunner.query('ALTER TABLE areas_modelos DROP COLUMN modelo');
      const fkAreasModelosExists = await queryRunner.query(`
        SELECT 1 FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu ON tc.constraint_schema = kcu.constraint_schema AND tc.constraint_name = kcu.constraint_name
        WHERE tc.table_schema = 'public' AND tc.table_name = 'areas_modelos' AND tc.constraint_type = 'FOREIGN KEY' AND kcu.column_name = 'idmodelo'
        LIMIT 1
      `);
      if (!fkAreasModelosExists?.length) {
        await queryRunner.createForeignKey(
          'areas_modelos',
          new TableForeignKey({
            columnNames: ['idmodelo'],
            referencedTableName: 'modelos_veiculo',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          }),
        );
      }
      await queryRunner.query(
        'CREATE INDEX IF NOT EXISTS idx_areas_modelos_modelo ON areas_modelos(idmodelo)',
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasColumn('areas_modelos', 'idmodelo')) {
      await queryRunner.query('ALTER TABLE areas_modelos DROP COLUMN idmodelo');
    }
    if (await queryRunner.hasColumn('veiculos', 'idmodelo')) {
      await queryRunner.query('ALTER TABLE veiculos DROP COLUMN idmodelo');
    }
    if (await queryRunner.hasTable('modelos_veiculo')) {
      await queryRunner.dropTable('modelos_veiculo');
    }
  }
}
