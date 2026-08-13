import { registerAs } from '@nestjs/config';

/**
 * Integração API OS BRT.
 * BRT_OS_ALLOW_INSECURE_TLS_HOMOLOG=true: aceita certificado não confiável
 * somente quando a empresa está com brtAmbiente=HOMOLOG (nunca use em produção).
 */
export default registerAs('brtOs', () => ({
  allowInsecureTlsHomolog:
    process.env.BRT_OS_ALLOW_INSECURE_TLS_HOMOLOG === 'true',
}));
