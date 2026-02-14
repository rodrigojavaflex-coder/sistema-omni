import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndefinidaCulpabilidadeEnum1739310000000
  implements MigrationInterface
{
  name = 'AddIndefinidaCulpabilidadeEnum1739310000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE public.ocorrencias_culpabilidade_enum ADD VALUE 'Indefinida'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // PostgreSQL não permite remover valor de enum diretamente; seria necessário
    // recriar o tipo e a coluna. Deixamos o down como no-op.
  }
}
