import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Preenche o campo numero nas ocorrências que ainda não possuem.
 * Formato: AAAA + sequencial de 6 dígitos no ano (ex.: 2026000001).
 * Ordenação: por ano e dataHora para sequencial consistente.
 */
export class BackfillNumeroOcorrencia1739321000000 implements MigrationInterface {
  name = 'BackfillNumeroOcorrencia1739321000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const rows: { id: string; dataHora: Date }[] = await queryRunner.query(
      `SELECT id, "dataHora" FROM ocorrencias WHERE numero IS NULL ORDER BY EXTRACT(YEAR FROM "dataHora"), "dataHora", id`,
    );

    const seqByYear: Record<number, number> = {};
    for (const row of rows) {
      const year = new Date(row.dataHora).getFullYear();
      if (!(year in seqByYear)) seqByYear[year] = 0;
      seqByYear[year] += 1;
      const numero =
        String(year) + String(seqByYear[year]).padStart(6, '0');
      await queryRunner.query(
        `UPDATE ocorrencias SET numero = $1 WHERE id = $2`,
        [numero, row.id],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Opcional: limpar numero nas que foram preenchidas por esta migration
    // não é trivial saber quais eram null; deixamos no-op
  }
}
