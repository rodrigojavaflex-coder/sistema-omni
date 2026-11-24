import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmpresaTerceira } from '../empresa-terceira/entities/empresa-terceira.entity';
import { EmpresaTerceiraService } from '../empresa-terceira/empresa-terceira.service';
import { EscalaService } from './escala.service';

/**
 * Job periódico de telemetria BRT (`tempo_real`), espelhando o padrão
 * da busca de informações OS: só empresas com flag ativa e intervalo vencido.
 */
@Injectable()
export class BrtTelemetriaPollService {
  private readonly logger = new Logger(BrtTelemetriaPollService.name);
  private emExecucao = false;

  constructor(
    private readonly empresaTerceiraService: EmpresaTerceiraService,
    private readonly escalaService: EscalaService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async tickPoll(): Promise<void> {
    if (this.emExecucao) {
      this.logger.debug(
        'Telemetria poll: tick ignorado (execução anterior em andamento)',
      );
      return;
    }
    this.emExecucao = true;
    try {
      const empresas =
        await this.empresaTerceiraService.findEmpresasBrtBuscaTelemetriaAtiva();
      if (!empresas.length) {
        return;
      }
      const agora = Date.now();
      for (const empresa of empresas) {
        if (!this.intervaloVencido(empresa, agora)) {
          continue;
        }
        try {
          const result = await this.escalaService.sincronizarTelemetria(
            empresa.id,
          );
          this.logger.log(
            `Telemetria poll empresa=${empresa.id} descricao=${empresa.descricao}: recebidos=${result.totalRecebidos} upserts=${result.upserts} semVinculo=${result.semVinculo}`,
          );
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          this.logger.warn(
            `Telemetria poll falhou empresa=${empresa.id} descricao=${empresa.descricao}: ${msg}`,
          );
        } finally {
          await this.empresaTerceiraService.marcarUltimoPollBuscaTelemetria(
            empresa.id,
            new Date(),
          );
        }
      }
    } finally {
      this.emExecucao = false;
    }
  }

  private intervaloVencido(
    empresa: EmpresaTerceira,
    agoraMs: number,
  ): boolean {
    const minutos = Math.max(
      1,
      Math.min(
        1440,
        Number(empresa.brtBuscaTelemetriaIntervaloMinutos ?? 10) || 10,
      ),
    );
    const ultimo = empresa.brtBuscaTelemetriaUltimoPollEm;
    if (!ultimo) {
      return true;
    }
    const decorridoMs = agoraMs - new Date(ultimo).getTime();
    return decorridoMs >= minutos * 60_000;
  }
}
