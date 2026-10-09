import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'net';
import { ImpressaoManutencaoConfig } from '../configuracao/entities/configuracao.entity';

export type ImpressaoRawResultado =
  | { enviado: true }
  | { enviado: false; erro: string };

@Injectable()
export class ImpressaoRawService {
  private readonly logger = new Logger(ImpressaoRawService.name);

  /**
   * Envia PDF via TCP RAW/JetDirect. Sem retry; erros tipados para o chamador.
   */
  async enviarPdf(
    pdf: Buffer,
    config: ImpressaoManutencaoConfig | null | undefined,
  ): Promise<ImpressaoRawResultado> {
    if (!config?.ativo) {
      return { enviado: false, erro: 'Impressão desabilitada na configuração' };
    }
    const ip = (config.impressoraIp ?? '').trim();
    const porta = Number(config.impressoraPorta) || 9100;
    const timeoutMs =
      Number.isFinite(Number(config.timeoutMs)) && Number(config.timeoutMs) > 0
        ? Number(config.timeoutMs)
        : 10000;

    if (!ip) {
      return { enviado: false, erro: 'IP da impressora não configurado' };
    }
    if (!pdf?.length) {
      return { enviado: false, erro: 'PDF vazio para impressão' };
    }

    try {
      await this.writeRaw(ip, porta, pdf, timeoutMs);
      this.logger.log(
        `PDF enviado à impressora ${ip}:${porta} (${pdf.length} bytes)`,
      );
      return { enviado: true };
    } catch (error) {
      const mensagem =
        error instanceof Error ? error.message : 'Falha ao enviar à impressora';
      this.logger.warn(
        `Falha na impressão RAW ${ip}:${porta}: ${mensagem}`,
      );
      return { enviado: false, erro: mensagem };
    }
  }

  private writeRaw(
    host: string,
    port: number,
    data: Buffer,
    timeoutMs: number,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const socket = new Socket();
      let settled = false;

      const finish = (err?: Error) => {
        if (settled) {
          return;
        }
        settled = true;
        socket.removeAllListeners();
        socket.destroy();
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      };

      socket.setTimeout(timeoutMs);
      socket.once('timeout', () => {
        finish(new Error(`Timeout ao conectar/imprimir em ${host}:${port}`));
      });
      socket.once('error', (err) => {
        finish(
          new Error(
            err?.message
              ? `Erro de rede (${err.message})`
              : `Erro de rede ao conectar em ${host}:${port}`,
          ),
        );
      });
      socket.connect(port, host, () => {
        socket.write(data, (writeErr) => {
          if (writeErr) {
            finish(
              new Error(
                writeErr.message ||
                  `Falha ao gravar dados na impressora ${host}:${port}`,
              ),
            );
            return;
          }
          socket.end(() => finish());
        });
      });
    });
  }
}
