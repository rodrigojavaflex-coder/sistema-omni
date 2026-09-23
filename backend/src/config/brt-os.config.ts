import { registerAs } from '@nestjs/config';

/**
 * Integração API OS BRT.
 *
 * BRT_OS_ALLOW_INSECURE_TLS_HOMOLOG=true: aceita certificado não confiável
 * somente quando a empresa está com brtAmbiente=HOMOLOG.
 *
 * BRT_OS_ALLOW_INSECURE_TLS=true: aceita certificado não confiável em qualquer
 * ambiente da empresa (inclui Produção). Uso emergencial/ops — preferir
 * instalar a CA no servidor ou marcar `brt_allow_insecure_tls` na empresa;
 * risco de MITM se habilitado.
 */
export default registerAs('brtOs', () => ({
  allowInsecureTlsHomolog:
    process.env.BRT_OS_ALLOW_INSECURE_TLS_HOMOLOG === 'true',
  allowInsecureTls: process.env.BRT_OS_ALLOW_INSECURE_TLS === 'true',
}));
