import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePasswordResetOtp1744000000000 implements MigrationInterface {
  name = 'CreatePasswordResetOtp1744000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "password_reset_otp" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "criadoEm" TIMESTAMP NOT NULL DEFAULT now(),
        "atualizadoEm" TIMESTAMP NOT NULL DEFAULT now(),
        "usuarioId" uuid NOT NULL,
        "codeHash" character varying(128) NOT NULL,
        "expiraEm" TIMESTAMP NOT NULL,
        "tentativasFalha" integer NOT NULL DEFAULT 0,
        "usadoEm" TIMESTAMP,
        CONSTRAINT "PK_password_reset_otp_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_password_reset_otp_usuario" FOREIGN KEY ("usuarioId")
          REFERENCES "usuarios"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_password_reset_otp_usuario" ON "password_reset_otp" ("usuarioId")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_password_reset_otp_criado" ON "password_reset_otp" ("usuarioId", "criadoEm")
    `);

    await queryRunner.query(`
      CREATE TABLE "password_reset_throttle" (
        "emailFingerprint" character varying(64) NOT NULL,
        "ultimaSolicitacao" TIMESTAMP NOT NULL,
        CONSTRAINT "PK_password_reset_throttle" PRIMARY KEY ("emailFingerprint")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "password_reset_throttle"`);
    await queryRunner.query(`DROP TABLE "password_reset_otp"`);
  }
}
