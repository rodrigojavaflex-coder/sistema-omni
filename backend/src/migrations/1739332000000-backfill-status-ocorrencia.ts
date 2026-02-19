import { MigrationInterface, QueryRunner } from 'typeorm';

export class BackfillStatusOcorrencia1739332000000
  implements MigrationInterface
{
  name = 'BackfillStatusOcorrencia1739332000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Ocorrências de 2025 e anteriores: garantir status = 'Concluída' (permite re-executar a migração)
    await queryRunner.query(`
      UPDATE ocorrencias
      SET status = 'Concluída'
      WHERE EXTRACT(YEAR FROM "dataHora") <= 2025;
    `);

    // 2. Histórico para 2025 e anteriores: registro de abertura (statusNovo = 'Registrada')
    // idUsuario: usuário que criou a ocorrência (auditoria acao = 'create'), ou NULL se não houver registro
    await queryRunner.query(`
      INSERT INTO historicoocorrencias (id, "criadoEm", "atualizadoEm", "idOcorrencia", "statusAnterior", "statusNovo", "dataAlteracao", "observacao", "idUsuario")
      SELECT 
        uuid_generate_v4(),
        CURRENT_TIMESTAMP(6),
        CURRENT_TIMESTAMP(6),
        o.id,
        NULL,
        'Registrada',
        o."dataHora",
        NULL,
        (SELECT a."usuarioId" FROM auditoria a WHERE a.entidade = 'ocorrencias' AND a."entidadeId" = o.id::text AND a.acao = 'create' ORDER BY a."criadoEm" ASC LIMIT 1)
      FROM ocorrencias o
      WHERE EXTRACT(YEAR FROM o."dataHora") <= 2025
        AND NOT EXISTS (
          SELECT 1 FROM historicoocorrencias h 
          WHERE h."idOcorrencia" = o.id AND h."statusNovo" = 'Registrada'
        );
    `);

    // 3. Histórico para 2025 e anteriores: registro de conclusão (statusNovo = 'Concluída')
    // dataAlteracao = dataHora + 1 dia para ficar após o registro (evita ordem invertida no modal)
    await queryRunner.query(`
      INSERT INTO historicoocorrencias (id, "criadoEm", "atualizadoEm", "idOcorrencia", "statusAnterior", "statusNovo", "dataAlteracao", "observacao", "idUsuario")
      SELECT 
        uuid_generate_v4(),
        CURRENT_TIMESTAMP(6),
        CURRENT_TIMESTAMP(6),
        o.id,
        'Registrada',
        'Concluída',
        o."dataHora" + INTERVAL '1 day',
        NULL,
        (SELECT a."usuarioId" FROM auditoria a WHERE a.entidade = 'ocorrencias' AND a."entidadeId" = o.id::text AND a.acao = 'create' ORDER BY a."criadoEm" ASC LIMIT 1)
      FROM ocorrencias o
      WHERE EXTRACT(YEAR FROM o."dataHora") <= 2025
        AND NOT EXISTS (
          SELECT 1 FROM historicoocorrencias h 
          WHERE h."idOcorrencia" = o.id AND h."statusNovo" = 'Concluída'
        );
    `);

    // 4. Ocorrências de 2026: status = 'Registrada'
    await queryRunner.query(`
      UPDATE ocorrencias
      SET status = 'Registrada'
      WHERE EXTRACT(YEAR FROM "dataHora") = 2026;
    `);

    // 5. Histórico para 2026: um registro (statusNovo = 'Registrada')
    await queryRunner.query(`
      INSERT INTO historicoocorrencias (id, "criadoEm", "atualizadoEm", "idOcorrencia", "statusAnterior", "statusNovo", "dataAlteracao", "observacao", "idUsuario")
      SELECT 
        uuid_generate_v4(),
        CURRENT_TIMESTAMP(6),
        CURRENT_TIMESTAMP(6),
        o.id,
        NULL,
        'Registrada',
        o."dataHora",
        NULL,
        (SELECT a."usuarioId" FROM auditoria a WHERE a.entidade = 'ocorrencias' AND a."entidadeId" = o.id::text AND a.acao = 'create' ORDER BY a."criadoEm" ASC LIMIT 1)
      FROM ocorrencias o
      WHERE EXTRACT(YEAR FROM o."dataHora") = 2026
        AND NOT EXISTS (
          SELECT 1 FROM historicoocorrencias h 
          WHERE h."idOcorrencia" = o.id AND h."statusNovo" = 'Registrada'
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover registros do histórico criados pelo backfill
    await queryRunner.query(`
      DELETE FROM historicoocorrencias
      WHERE "observacao" IS NULL
        AND (
          ("statusNovo" = 'Registrada' AND "statusAnterior" IS NULL)
          OR ("statusNovo" = 'Concluída' AND "statusAnterior" = 'Registrada')
        );
    `);

    // Reverter status para NULL (ou valor padrão)
    await queryRunner.query(`
      UPDATE ocorrencias
      SET status = 'Registrada'
      WHERE status IN ('Concluída', 'Registrada');
    `);
  }
}
