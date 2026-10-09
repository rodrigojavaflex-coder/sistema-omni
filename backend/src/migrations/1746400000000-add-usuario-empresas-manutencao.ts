import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * N:N usuário ↔ empresas de manutenção.
 * Migra vínculos existentes de usuarios."idEmpresa" quando a empresa é de manutenção.
 */
export class AddUsuarioEmpresasManutencao1746400000000
  implements MigrationInterface
{
  name = 'AddUsuarioEmpresasManutencao1746400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "usuariosEmpresasManutencao" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "criadoEm" TIMESTAMP NOT NULL DEFAULT now(),
        "atualizadoEm" TIMESTAMP NOT NULL DEFAULT now(),
        "usuarioId" uuid NOT NULL,
        "empresaId" uuid NOT NULL,
        CONSTRAINT "PK_usuariosEmpresasManutencao" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_usuariosEmpresasManutencao_usuario_empresa"
          UNIQUE ("usuarioId", "empresaId"),
        CONSTRAINT "FK_usuariosEmpresasManutencao_usuario"
          FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_usuariosEmpresasManutencao_empresa"
          FOREIGN KEY ("empresaId") REFERENCES "empresasterceiras"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_usuariosEmpresasManutencao_usuario"
      ON "usuariosEmpresasManutencao" ("usuarioId")
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_usuariosEmpresasManutencao_empresa"
      ON "usuariosEmpresasManutencao" ("empresaId")
    `);

    await queryRunner.query(`
      INSERT INTO "usuariosEmpresasManutencao" ("usuarioId", "empresaId")
      SELECT u."id", u."idEmpresa"
      FROM "usuarios" u
      INNER JOIN "empresasterceiras" e ON e."id" = u."idEmpresa"
      WHERE u."idEmpresa" IS NOT NULL
        AND e."eh_empresa_manutencao" = true
      ON CONFLICT ("usuarioId", "empresaId") DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_usuariosEmpresasManutencao_empresa"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_usuariosEmpresasManutencao_usuario"`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "usuariosEmpresasManutencao"`,
    );
  }
}
