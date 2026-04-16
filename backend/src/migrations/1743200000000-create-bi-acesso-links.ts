import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBiAcessoLinks1743200000000 implements MigrationInterface {
  name = 'CreateBiAcessoLinks1743200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "bi_acesso_links" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "criadoEm" TIMESTAMP NOT NULL DEFAULT now(),
        "atualizadoEm" TIMESTAMP NOT NULL DEFAULT now(),
        "nomeMenu" character varying(120) NOT NULL,
        "url" character varying(1024) NOT NULL,
        "grupoMenu" character varying(80) NOT NULL DEFAULT 'Gestão',
        "subgrupoMenu" character varying(80) NOT NULL DEFAULT 'BI',
        "icone" character varying(80) NOT NULL DEFAULT 'feather-pie-chart',
        "ordem" integer NOT NULL DEFAULT '1',
        "ativo" boolean NOT NULL DEFAULT true,
        CONSTRAINT "PK_bi_acesso_links_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "bi_acesso_links"`);
  }
}
