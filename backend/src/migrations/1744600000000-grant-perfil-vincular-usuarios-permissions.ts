import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Concede perfil:assign_users e perfil:unassign_users a perfis administrativos
 * (ADMIN ou quem já possui perfil:duplicate). simple-array = lista separada por vírgula.
 */
export class GrantPerfilVincularUsuariosPermissions1744600000000
  implements MigrationInterface
{
  name = 'GrantPerfilVincularUsuariosPermissions1744600000000';

  private static readonly NEW_PERMISSIONS = [
    'perfil:assign_users',
    'perfil:unassign_users',
  ] as const;

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      DECLARE
        r RECORD;
        perms text;
        p text;
        new_perms text[] := ARRAY['perfil:assign_users', 'perfil:unassign_users'];
      BEGIN
        FOR r IN
          SELECT id, permissoes
          FROM "perfil"
          WHERE "nomePerfil" ILIKE 'ADMIN'
             OR COALESCE(permissoes, '') LIKE '%perfil:duplicate%'
        LOOP
          perms := COALESCE(r.permissoes, '');
          FOREACH p IN ARRAY new_perms
          LOOP
            IF perms NOT LIKE '%' || p || '%' THEN
              IF perms = '' THEN
                perms := p;
              ELSE
                perms := perms || ',' || p;
              END IF;
            END IF;
          END LOOP;
          UPDATE "perfil" SET permissoes = perms WHERE id = r.id;
        END LOOP;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const permission of GrantPerfilVincularUsuariosPermissions1744600000000.NEW_PERMISSIONS) {
      await queryRunner.query(
        `
        UPDATE "perfil"
        SET permissoes = TRIM(BOTH ',' FROM
          REPLACE(
            REPLACE(
              REPLACE(COALESCE(permissoes, ''), $1 || ',', ''),
              ',' || $1,
              ''
            ),
            $1,
            ''
          )
        )
        WHERE COALESCE(permissoes, '') LIKE '%' || $1 || '%'
        `,
        [permission],
      );
    }
  }
}
