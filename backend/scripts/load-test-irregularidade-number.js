/* eslint-disable no-console */
require('dotenv').config();
const { Client } = require('pg');
const jwt = require('jsonwebtoken');

async function main() {
  const client = new Client({
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT || 5432),
    user: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'Ro112543*',
    database: process.env.DATABASE_NAME || 'omni',
  });

  const apiBase = process.env.API_BASE_URL || 'http://localhost:3000/api';
  const secret = process.env.JWT_SECRET || 'default-secret-key';
  const totalRequests = Number(process.env.LOAD_TEST_REQUESTS || 40);

  await client.connect();
  const createdIds = [];

  try {
    const vistoriaResult = await client.query(
      `
      SELECT v.id, v.idusuario
      FROM vistorias v
      WHERE v.status = 'EM_ANDAMENTO'
      ORDER BY v."criadoEm" DESC
      LIMIT 1
      `,
    );

    if (!vistoriaResult.rows.length) {
      throw new Error('Nenhuma vistoria EM_ANDAMENTO encontrada para teste.');
    }

    const vistoria = vistoriaResult.rows[0];

    const matrizResult = await client.query(
      `
      SELECT ac.idarea, ac.idcomponente, m.idsintoma
      FROM areas_componentes ac
      INNER JOIN matriz_criticidade m ON m.idcomponente = ac.idcomponente
      LIMIT 1
      `,
    );

    if (!matrizResult.rows.length) {
      throw new Error('Não foi encontrada combinação válida de área/componente/sintoma.');
    }

    const matriz = matrizResult.rows[0];
    const token = jwt.sign(
      { sub: vistoria.idusuario, email: 'loadtest@omni.local' },
      secret,
      { expiresIn: '1h' },
    );

    const body = {
      idarea: matriz.idarea,
      idcomponente: matriz.idcomponente,
      idsintoma: matriz.idsintoma,
      observacao: `LOAD_TEST_NR_IRREGULARIDADE_${Date.now()}`,
    };

    const requests = Array.from({ length: totalRequests }, () =>
      fetch(`${apiBase}/vistoria/${vistoria.id}/irregularidades`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }).then(async (res) => {
        const payload = await res.json().catch(() => ({}));
        return {
          ok: res.ok,
          status: res.status,
          payload,
        };
      }),
    );

    const results = await Promise.all(requests);
    const success = results.filter((r) => r.ok);
    const failed = results.filter((r) => !r.ok);
    const numbers = success
      .map((r) => r.payload?.numeroIrregularidade)
      .filter((n) => n !== undefined && n !== null);

    for (const r of success) {
      if (r.payload?.id) {
        createdIds.push(r.payload.id);
      }
    }

    const uniqueNumbers = new Set(numbers);
    const duplicatedCount = numbers.length - uniqueNumbers.size;

    console.log('=== RESULTADO TESTE DE CARGA IRREGULARIDADE ===');
    console.log(`Total de requests: ${totalRequests}`);
    console.log(`Sucesso: ${success.length}`);
    console.log(`Falhas: ${failed.length}`);
    console.log(`Números retornados: ${numbers.length}`);
    console.log(`Números únicos: ${uniqueNumbers.size}`);
    console.log(`Duplicados detectados: ${duplicatedCount}`);

    if (failed.length > 0) {
      console.log('Amostra de falhas:');
      failed.slice(0, 5).forEach((f, idx) => {
        console.log(`#${idx + 1} status=${f.status} payload=${JSON.stringify(f.payload)}`);
      });
    }

    if (duplicatedCount > 0) {
      process.exitCode = 1;
    }
  } finally {
    if (createdIds.length > 0) {
      await client.query(
        `
        DELETE FROM irregularidade_historico
        WHERE "idIrregularidade" = ANY($1::uuid[])
        `,
        [createdIds],
      );

      await client.query(
        `
        DELETE FROM irregularidades
        WHERE id = ANY($1::uuid[])
        `,
        [createdIds],
      );

      console.log(`Limpeza executada: ${createdIds.length} irregularidades removidas.`);
    }

    await client.end();
  }
}

main().catch((error) => {
  console.error('Erro ao executar teste de carga:', error.message);
  process.exitCode = 1;
});
