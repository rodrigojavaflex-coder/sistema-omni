import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Combustivel, exigePercentualNivel } from '../../common/enums/combustivel.enum';
import { GravidadeCriticidade } from '../../common/enums/gravidade-criticidade.enum';
import { IntegracaoManutencaoEmpresa } from '../../common/enums/integracao-manutencao-empresa.enum';
import { StatusIrregularidade } from '../../common/enums/status-irregularidade.enum';
import { ConfiguracaoService } from '../configuracao/configuracao.service';
import { EmpresaTerceira } from '../empresa-terceira/entities/empresa-terceira.entity';
import { Irregularidade } from '../vistoria/entities/irregularidade.entity';
import { MatrizCriticidade } from '../vistoria/entities/matriz-criticidade.entity';
import { Veiculo } from '../veiculo/entities/veiculo.entity';
import { BrtTempoRealClient } from './brt-tempo-real.client';
import { VeiculoEscalaDia } from './entities/veiculo-escala-dia.entity';
import { VeiculoEscalaTurno } from './entities/veiculo-escala-turno.entity';
import { VeiculoTelemetriaAtual } from './entities/veiculo-telemetria-atual.entity';
import {
  InfobusGrupoKm,
  InfobusKmClient,
  InfobusTurnoKm,
  InfobusVeiculoKm,
} from './infobus-km.client';

const STATUS_RETIDO: StatusIrregularidade[] = [
  StatusIrregularidade.EM_MANUTENCAO,
  StatusIrregularidade.CONCLUIDA,
];

export interface AutonomiaFonteDto {
  autonomiaKm: number | null;
  autonomia100Km: number | null;
  disponivel: boolean;
}

export interface EscalaTurnoDto {
  grupo: string | null;
  alocacao: string | null;
  tarefa: string | null;
  tipoViagem: string | null;
  km: number | null;
  matricula: string | null;
  motorista: string | null;
  nomeTurno: string | null;
  numeroViagem: string | null;
  horarioInicio: string | null;
  horarioFim: string | null;
  ordem: number;
}

export interface EscalaGrupoAgregadoDto {
  grupo: string | null;
  km: number | null;
  alocacoes: string[];
  tarefas: string[];
  tiposViagem: string[];
  motoristas: Array<{
    matricula: string | null;
    motorista: string | null;
    km: number | null;
    alocacao: string | null;
    tarefa: string | null;
    tipoViagem: string | null;
  }>;
}

export interface EscalaPainelItemDto {
  idEscalaDia: string;
  data: string;
  prefixo: string;
  idVeiculo: string | null;
  descricao: string | null;
  placa: string | null;
  combustivel: string | null;
  veiculoSubstituidoManual: boolean;
  kmEscala: number;
  turnos: EscalaTurnoDto[];
  /** Agregado derivado dos turnos por grupo INFOBUS. */
  grupos: EscalaGrupoAgregadoDto[];
  retido: boolean;
  qtdOsVermelhas: number;
  bateriaPct: number | null;
  telemetria: AutonomiaFonteDto;
  calculoOmni: AutonomiaFonteDto;
  alertaAutonomia: boolean;
  alertaRetidoNaEscala: boolean;
  kmPorPercentualModelo: number | null;
  dataHoraTelemetria: string | null;
  sincronizadoEscalaEm: string | null;
  sincronizadoTelemetriaEm: string | null;
}

export interface EscalaPainelResponseDto {
  data: string;
  total: number;
  itens: EscalaPainelItemDto[];
  resumo: {
    retidosNaEscala: number;
    alertaAutonomia: number;
    semVinculoVeiculo: number;
  };
  /** Última sync INFOBUS (configuração global). */
  ultimoSyncEscalaEm: string | null;
  /** Última sync telemetria BRT (configuração global / job). */
  ultimoSyncTelemetriaEm: string | null;
}

@Injectable()
export class EscalaService {
  private readonly logger = new Logger(EscalaService.name);

  constructor(
    @InjectRepository(VeiculoEscalaDia)
    private readonly escalaRepo: Repository<VeiculoEscalaDia>,
    @InjectRepository(VeiculoTelemetriaAtual)
    private readonly telemetriaRepo: Repository<VeiculoTelemetriaAtual>,
    @InjectRepository(Veiculo)
    private readonly veiculoRepo: Repository<Veiculo>,
    @InjectRepository(Irregularidade)
    private readonly irregularidadeRepo: Repository<Irregularidade>,
    @InjectRepository(EmpresaTerceira)
    private readonly empresaRepo: Repository<EmpresaTerceira>,
    private readonly configuracaoService: ConfiguracaoService,
    private readonly infobusClient: InfobusKmClient,
    private readonly brtTempoRealClient: BrtTempoRealClient,
  ) {}

  normalizarPrefixo(valor: string | number | null | undefined): string {
    return String(valor ?? '')
      .trim()
      .replace(/^0+(?=\d)/, '');
  }

  private async mapaVeiculosPorPrefixo(): Promise<Map<string, Veiculo>> {
    const veiculos = await this.veiculoRepo.find({
      relations: ['modeloVeiculo'],
    });
    const map = new Map<string, Veiculo>();
    for (const v of veiculos) {
      const key = this.normalizarPrefixo(v.descricao);
      if (key) {
        map.set(key, v);
      }
    }
    return map;
  }

  async sincronizarEscala(data: string): Promise<{
    data: string;
    totalRecebidos: number;
    upserts: number;
    semVinculo: number;
  }> {
    const dataIso = this.validarData(data);
    const cfg = await this.configuracaoService.getEscalaInfobusConfigInterna();
    if (!cfg?.ativo) {
      throw new BadRequestException(
        'Integração Escala INFOBUS está desativada na Configuração do Sistema.',
      );
    }
    if (!cfg.url || !cfg.tenant || !cfg.apiKey) {
      throw new BadRequestException(
        'Configure URL, tenant e API Key na aba Escala INFOBUS.',
      );
    }

    const resposta = await this.infobusClient.buscarKmDetalhado({
      baseUrl: cfg.url,
      tenant: cfg.tenant,
      apiKey: cfg.apiKey,
      data: dataIso,
      timeoutMs: cfg.timeoutMs,
    });

    const veiculosMap = await this.mapaVeiculosPorPrefixo();
    const agora = new Date();
    let upserts = 0;
    let semVinculo = 0;
    const lista = Array.isArray(resposta.veiculos) ? resposta.veiculos : [];

    await this.escalaRepo.manager.transaction(async (manager) => {
      const escalaTx = manager.getRepository(VeiculoEscalaDia);
      const turnoTx = manager.getRepository(VeiculoEscalaTurno);

      for (const item of lista) {
        const prefixo = this.normalizarPrefixo(item.veiculo);
        if (!prefixo) {
          continue;
        }
        const veiculo = veiculosMap.get(prefixo) ?? null;
        if (!veiculo) {
          semVinculo += 1;
        }
        const kmTotalRaw = item.km ?? item.quilometragem;
        const kmTotal = Number(kmTotalRaw);
        const turnosNorm = this.normalizarTurnosDoVeiculo(item);

        let row = await escalaTx.findOne({
          where: { data: dataIso, prefixo },
        });
        if (!row) {
          row = escalaTx.create({
            data: dataIso,
            prefixo,
            veiculoSubstituidoManual: false,
          });
        }
        // Substituição manual: preserva id_veiculo; sync só atualiza KM/turnos.
        if (!row.veiculoSubstituidoManual) {
          row.idVeiculo = veiculo?.id ?? null;
        }
        row.kmTotal = Number.isFinite(kmTotal) ? kmTotal : 0;
        row.sincronizadoEm = agora;
        row = await escalaTx.save(row);

        await turnoTx.delete({ idEscalaDia: row.id });
        if (turnosNorm.length > 0) {
          await turnoTx.save(
            turnosNorm.map((t) =>
              turnoTx.create({
                idEscalaDia: row.id,
                ...t,
              }),
            ),
          );
        }
        upserts += 1;
      }
    });

    await this.configuracaoService.marcarSyncEscalaInfobus({
      ultimoSyncEscalaEm: agora.toISOString(),
    });

    return {
      data: dataIso,
      totalRecebidos: lista.length,
      upserts,
      semVinculo,
    };
  }

  private toNullableNumber(valor: unknown): number | null {
    if (valor == null || valor === '') {
      return null;
    }
    const n = Number(valor);
    return Number.isFinite(n) ? n : null;
  }

  private toNullableText(valor: unknown): string | null {
    if (valor == null) {
      return null;
    }
    const text = String(valor).trim();
    return text ? text : null;
  }

  private pickHorario(
    obj: {
      horarioInicio?: string | null;
      horarioFim?: string | null;
      horario_inicio?: string | null;
      horario_fim?: string | null;
      horario_inicial?: string | null;
      horario_final?: string | null;
    },
    qual: 'inicio' | 'fim',
  ): string | null {
    if (qual === 'inicio') {
      return this.toNullableText(
        obj.horario_inicial ?? obj.horarioInicio ?? obj.horario_inicio,
      );
    }
    return this.toNullableText(
      obj.horario_final ?? obj.horarioFim ?? obj.horario_fim,
    );
  }

  private pickNomeTurno(obj: {
    turno?: string | number | null;
    nomeTurno?: string | null;
    nome?: string | null;
  }): string | null {
    return this.toNullableText(obj.turno ?? obj.nomeTurno ?? obj.nome);
  }

  /**
   * Prefere `turnos[]` se o INFOBUS enviar; senão achata `grupos[].motoristas[]`.
   */
  private normalizarTurnosDoVeiculo(item: InfobusVeiculoKm): Array<
    Omit<VeiculoEscalaTurno, 'id' | 'criadoEm' | 'atualizadoEm' | 'idEscalaDia' | 'escalaDia'>
  > {
    if (Array.isArray(item.turnos) && item.turnos.length > 0) {
      return item.turnos.map((t, idx) => this.mapTurnoApi(t, idx));
    }

    const grupos: InfobusGrupoKm[] = Array.isArray(item.grupos)
      ? item.grupos
      : [];
    const out: Array<
      Omit<
        VeiculoEscalaTurno,
        'id' | 'criadoEm' | 'atualizadoEm' | 'idEscalaDia' | 'escalaDia'
      >
    > = [];
    let ordem = 0;
    for (const grupo of grupos) {
      const motoristas = Array.isArray(grupo.motoristas)
        ? grupo.motoristas
        : [];
      if (motoristas.length === 0) {
        out.push({
          grupo: this.toNullableText(grupo.grupo),
          alocacao: this.toNullableText(grupo.alocacao),
          tarefa: this.toNullableText(grupo.tarefa),
          tipoViagem: this.toNullableText(
            grupo.tipo_viagem ?? grupo.tipoViagem,
          ),
          km: this.toNullableNumber(grupo.km ?? grupo.quilometragem),
          matricula: null,
          motorista: null,
          nomeTurno: this.pickNomeTurno(grupo),
          numeroViagem: this.toNullableText(
            grupo.numeroViagem ?? grupo.numero,
          ),
          horarioInicio: this.pickHorario(grupo, 'inicio'),
          horarioFim: this.pickHorario(grupo, 'fim'),
          ordem: ordem++,
        });
        continue;
      }
      for (const mot of motoristas) {
        out.push({
          grupo: this.toNullableText(grupo.grupo),
          alocacao: this.toNullableText(mot.alocacao ?? grupo.alocacao),
          tarefa: this.toNullableText(mot.tarefa ?? grupo.tarefa),
          tipoViagem: this.toNullableText(
            mot.tipo_viagem ??
              mot.tipoViagem ??
              grupo.tipo_viagem ??
              grupo.tipoViagem,
          ),
          km: this.toNullableNumber(
            mot.km ?? grupo.km ?? grupo.quilometragem,
          ),
          matricula: this.toNullableText(mot.matricula),
          motorista: this.toNullableText(mot.motorista),
          nomeTurno: this.pickNomeTurno(mot) ?? this.pickNomeTurno(grupo),
          numeroViagem: this.toNullableText(
            mot.numeroViagem ??
              mot.numero ??
              grupo.numeroViagem ??
              grupo.numero,
          ),
          horarioInicio:
            this.pickHorario(mot, 'inicio') ??
            this.pickHorario(grupo, 'inicio'),
          horarioFim:
            this.pickHorario(mot, 'fim') ?? this.pickHorario(grupo, 'fim'),
          ordem: ordem++,
        });
      }
    }
    return out;
  }

  private mapTurnoApi(
    t: InfobusTurnoKm,
    ordem: number,
  ): Omit<
    VeiculoEscalaTurno,
    'id' | 'criadoEm' | 'atualizadoEm' | 'idEscalaDia' | 'escalaDia'
  > {
    return {
      grupo: this.toNullableText(t.grupo ?? t.descricao),
      alocacao: this.toNullableText(t.alocacao),
      tarefa: this.toNullableText(t.tarefa),
      tipoViagem: this.toNullableText(t.tipo_viagem ?? t.tipoViagem),
      km: this.toNullableNumber(t.km ?? t.quilometragem),
      matricula: this.toNullableText(t.matricula),
      motorista: this.toNullableText(t.motorista),
      nomeTurno: this.pickNomeTurno(t),
      numeroViagem: this.toNullableText(t.numeroViagem ?? t.numero),
      horarioInicio: this.pickHorario(t, 'inicio'),
      horarioFim: this.pickHorario(t, 'fim'),
      ordem,
    };
  }

  private agregarGruposDosTurnos(
    turnos: EscalaTurnoDto[],
  ): EscalaGrupoAgregadoDto[] {
    const map = new Map<string, EscalaGrupoAgregadoDto>();
    for (const t of turnos) {
      const key = t.grupo ?? '';
      let agg = map.get(key);
      if (!agg) {
        agg = {
          grupo: t.grupo,
          km: 0,
          alocacoes: [],
          tarefas: [],
          tiposViagem: [],
          motoristas: [],
        };
        map.set(key, agg);
      }
      const km = t.km ?? 0;
      agg.km = (agg.km ?? 0) + (Number.isFinite(km) ? km : 0);
      const aloc = (t.alocacao ?? '').trim();
      if (aloc && !agg.alocacoes.includes(aloc)) {
        agg.alocacoes.push(aloc);
      }
      const tar = (t.tarefa ?? '').trim();
      if (tar && !agg.tarefas.includes(tar)) {
        agg.tarefas.push(tar);
      }
      const tipo = (t.tipoViagem ?? '').trim();
      if (tipo && !agg.tiposViagem.includes(tipo)) {
        agg.tiposViagem.push(tipo);
      }
      if (t.motorista || t.matricula) {
        agg.motoristas.push({
          matricula: t.matricula,
          motorista: t.motorista,
          km: t.km,
          alocacao: t.alocacao,
          tarefa: t.tarefa,
          tipoViagem: t.tipoViagem,
        });
      }
    }
    return Array.from(map.values());
  }

  async sincronizarTelemetria(
    idEmpresa?: string,
    filtro?: { prefixo?: string; idVeiculo?: string },
  ): Promise<{
    totalRecebidos: number;
    upserts: number;
    semVinculo: number;
    idEmpresaUsada: string;
    prefixoFiltro: string | null;
    encontrado: boolean;
  }> {
    const inicioMs = Date.now();
    const empresa = await this.resolverEmpresaBrt(idEmpresa);
    if (!empresa.brtTenEmp?.trim() || !empresa.brtToken?.trim()) {
      throw new BadRequestException(
        'Empresa BRT sem tenant/token configurados para telemetria.',
      );
    }

    let prefixoFiltro = this.normalizarPrefixo(filtro?.prefixo ?? '');
    const idVeiculoFiltro = (filtro?.idVeiculo ?? '').trim() || null;

    // Com idVeiculo (ex.: após troca manual), o filtro BRT deve ser o prefixo do
    // veículo OMNI atual (descricao), não o prefixo INFOBUS da linha de escala.
    if (idVeiculoFiltro) {
      const veiculoFiltro = await this.veiculoRepo.findOne({
        where: { id: idVeiculoFiltro },
      });
      const prefixoOmni = this.normalizarPrefixo(veiculoFiltro?.descricao);
      if (prefixoOmni) {
        prefixoFiltro = prefixoOmni;
      }
    }

    this.logger.log(
      `Sync telemetria: empresa=${empresa.descricao} id=${empresa.id} ten_emp=${empresa.brtTenEmp.trim()} urlBase=${empresa.brtUrlBase ?? '(default)'}${
        prefixoFiltro ? ` filtroPrefixo=${prefixoFiltro}` : ''
      }${idVeiculoFiltro ? ` idVeiculo=${idVeiculoFiltro}` : ''}`,
    );

    const resposta = await this.brtTempoRealClient.buscarTempoReal({
      brtUrlBase: empresa.brtUrlBase,
      tenEmp: empresa.brtTenEmp.trim(),
      token: empresa.brtToken.trim(),
      allowInsecureTls: !!empresa.brtAllowInsecureTls,
    });

    const veiculosMap = await this.mapaVeiculosPorPrefixo();
    const agora = new Date();
    let upserts = 0;
    let semVinculo = 0;
    const listaRaw = Array.isArray(resposta.data) ? resposta.data : [];
    const lista = prefixoFiltro
      ? listaRaw.filter(
          (item) => this.normalizarPrefixo(item.veiculo_id) === prefixoFiltro,
        )
      : listaRaw;

    // Evita telemetria do prefixo INFOBUS antigo ficar vinculada ao veículo novo.
    if (idVeiculoFiltro && prefixoFiltro) {
      await this.telemetriaRepo
        .createQueryBuilder()
        .update()
        .set({ idVeiculo: null })
        .where('id_veiculo = :idVeiculo', { idVeiculo: idVeiculoFiltro })
        .andWhere('prefixo != :prefixo', { prefixo: prefixoFiltro })
        .execute();
    }

    for (const item of lista) {
      const prefixo = this.normalizarPrefixo(item.veiculo_id);
      if (!prefixo) {
        continue;
      }
      const veiculo = veiculosMap.get(prefixo) ?? null;
      if (!veiculo && !idVeiculoFiltro) {
        semVinculo += 1;
      }
      let row = await this.telemetriaRepo.findOne({ where: { prefixo } });
      if (!row) {
        row = this.telemetriaRepo.create({ prefixo });
      }
      // Refresh pontual: vincula ao veículo OMNI informado (ex.: substituição).
      row.idVeiculo = idVeiculoFiltro ?? veiculo?.id ?? null;
      if (!row.idVeiculo) {
        semVinculo += 1;
      }
      row.veiculoIdBrt =
        item.veiculo_id == null ? null : Number(item.veiculo_id);
      row.dataHora = item.data_hora ? new Date(item.data_hora) : null;
      row.latitude = item.latitude == null ? null : Number(item.latitude);
      row.longitude = item.longitude == null ? null : Number(item.longitude);
      row.bateria = item.bateria == null ? null : Number(item.bateria);
      row.autonomia = item.autonomia == null ? null : Number(item.autonomia);
      row.odometro = item.odometro == null ? null : Number(item.odometro);
      row.sincronizadoEm = agora;
      await this.telemetriaRepo.save(row);
      upserts += 1;
    }

    if (!prefixoFiltro) {
      await this.configuracaoService.marcarSyncEscalaInfobus({
        ultimoSyncTelemetriaEm: agora.toISOString(),
      });
    }

    const elapsedMs = Date.now() - inicioMs;
    this.logger.log(
      `Sync telemetria: concluído em ${elapsedMs}ms recebidos=${listaRaw.length} filtrados=${lista.length} upserts=${upserts} semVinculo=${semVinculo} empresaId=${empresa.id}`,
    );

    return {
      totalRecebidos: listaRaw.length,
      upserts,
      semVinculo,
      idEmpresaUsada: empresa.id,
      prefixoFiltro: prefixoFiltro || null,
      encontrado: !prefixoFiltro || upserts > 0,
    };
  }

  async listarPainel(data: string): Promise<EscalaPainelResponseDto> {
    const dataIso = this.validarData(data);
    const escalas = await this.escalaRepo.find({
      where: { data: dataIso },
      relations: ['turnos'],
      order: { prefixo: 'ASC' },
    });

    const idsVeiculo = escalas
      .map((e) => e.idVeiculo)
      .filter((id): id is string => !!id);
    const veiculos =
      idsVeiculo.length > 0
        ? await this.veiculoRepo.find({
            where: { id: In(idsVeiculo) },
            relations: ['modeloVeiculo'],
          })
        : [];
    const veiculoById = new Map(veiculos.map((v) => [v.id, v]));

    const telemetrias = await this.telemetriaRepo.find();
    const teleByPrefixo = new Map(
      telemetrias.map((t) => [this.normalizarPrefixo(t.prefixo), t]),
    );
    const teleByVeiculo = new Map(
      telemetrias
        .filter((t) => t.idVeiculo)
        .map((t) => [t.idVeiculo as string, t]),
    );

    const retidos = await this.buscarRetidosPorVeiculo(idsVeiculo);

    const itens: EscalaPainelItemDto[] = escalas.map((esc) => {
      const veiculo = esc.idVeiculo
        ? veiculoById.get(esc.idVeiculo) ?? null
        : null;
      // Após troca manual, telemetria vem do veículo OMNI (descricao), nunca do
      // prefixo INFOBUS antigo da linha.
      const tele = esc.veiculoSubstituidoManual
        ? (veiculo
            ? teleByPrefixo.get(this.normalizarPrefixo(veiculo.descricao))
            : undefined) ??
          (esc.idVeiculo ? teleByVeiculo.get(esc.idVeiculo) : undefined) ??
          null
        : (esc.idVeiculo ? teleByVeiculo.get(esc.idVeiculo) : undefined) ??
          teleByPrefixo.get(this.normalizarPrefixo(esc.prefixo)) ??
          null;

      const infoRetido = esc.idVeiculo
        ? retidos.get(esc.idVeiculo) ?? { retido: false, qtd: 0 }
        : { retido: false, qtd: 0 };

      const kmPorPercentual = veiculo?.modeloVeiculo?.kmPorPercentual ?? null;
      const bateriaPct =
        tele?.bateria != null && Number.isFinite(Number(tele.bateria))
          ? Number(tele.bateria)
          : null;

      const telemetria = this.montarFonteTelemetria(tele?.autonomia, bateriaPct);
      const calculoOmni = this.montarFonteOmni(bateriaPct, kmPorPercentual);

      const exigeAutonomia = exigePercentualNivel(
        veiculo?.combustivel as Combustivel | undefined,
      );
      const kmEscala = Number(esc.kmTotal) || 0;

      const turnos: EscalaTurnoDto[] = [...(esc.turnos ?? [])]
        .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))
        .map((t) => ({
          grupo: t.grupo ?? null,
          alocacao: t.alocacao ?? null,
          tarefa: t.tarefa ?? null,
          tipoViagem: t.tipoViagem ?? null,
          km: t.km ?? null,
          matricula: t.matricula ?? null,
          motorista: t.motorista ?? null,
          nomeTurno: t.nomeTurno ?? null,
          numeroViagem: t.numeroViagem ?? null,
          horarioInicio: t.horarioInicio ?? null,
          horarioFim: t.horarioFim ?? null,
          ordem: t.ordem ?? 0,
        }));

      /** Alerta se algum turno (soma KM do turno) superar qualquer fonte de autonomia. */
      const kmPorTurno = new Map<string, number>();
      for (const t of turnos) {
        const chave = (t.nomeTurno ?? '').trim() || 'Sem turno';
        const km = t.km != null && Number.isFinite(Number(t.km)) ? Number(t.km) : 0;
        kmPorTurno.set(chave, (kmPorTurno.get(chave) ?? 0) + km);
      }
      const kmsTurno = Array.from(kmPorTurno.values());
      const referenciaKm =
        kmsTurno.length > 0 ? kmsTurno : kmEscala > 0 ? [kmEscala] : [];
      const alertaAutonomia =
        exigeAutonomia &&
        referenciaKm.some(
          (kmTurno) =>
            kmTurno > 0 &&
            ((telemetria.disponivel &&
              telemetria.autonomiaKm != null &&
              telemetria.autonomiaKm < kmTurno) ||
              (calculoOmni.disponivel &&
                calculoOmni.autonomiaKm != null &&
                calculoOmni.autonomiaKm < kmTurno)),
        );

      return {
        idEscalaDia: esc.id,
        data: dataIso,
        prefixo: esc.prefixo,
        idVeiculo: esc.idVeiculo ?? null,
        descricao: veiculo?.descricao ?? null,
        placa: veiculo?.placa ?? null,
        combustivel: veiculo?.combustivel ?? null,
        veiculoSubstituidoManual: !!esc.veiculoSubstituidoManual,
        kmEscala,
        turnos,
        grupos: this.agregarGruposDosTurnos(turnos),
        retido: infoRetido.retido,
        qtdOsVermelhas: infoRetido.qtd,
        bateriaPct,
        telemetria,
        calculoOmni,
        alertaAutonomia,
        alertaRetidoNaEscala: infoRetido.retido,
        kmPorPercentualModelo: kmPorPercentual,
        dataHoraTelemetria: tele?.dataHora
          ? tele.dataHora.toISOString()
          : null,
        sincronizadoEscalaEm: esc.sincronizadoEm
          ? esc.sincronizadoEm.toISOString()
          : null,
        sincronizadoTelemetriaEm: tele?.sincronizadoEm
          ? tele.sincronizadoEm.toISOString()
          : null,
      };
    });

    const cfgEscala =
      await this.configuracaoService.getEscalaInfobusConfigInterna();

    return {
      data: dataIso,
      total: itens.length,
      itens,
      resumo: {
        retidosNaEscala: itens.filter((i) => i.alertaRetidoNaEscala).length,
        alertaAutonomia: itens.filter((i) => i.alertaAutonomia).length,
        semVinculoVeiculo: itens.filter((i) => !i.idVeiculo).length,
      },
      ultimoSyncEscalaEm: cfgEscala?.ultimoSyncEscalaEm?.trim() || null,
      ultimoSyncTelemetriaEm:
        cfgEscala?.ultimoSyncTelemetriaEm?.trim() || null,
    };
  }

  private montarFonteTelemetria(
    autonomia: number | null | undefined,
    bateriaPct: number | null,
  ): AutonomiaFonteDto {
    const autonomiaKm =
      autonomia == null || !Number.isFinite(Number(autonomia))
        ? null
        : Number(autonomia);
    let autonomia100Km: number | null = null;
    if (
      autonomiaKm != null &&
      bateriaPct != null &&
      bateriaPct > 0
    ) {
      autonomia100Km = Math.round((autonomiaKm / (bateriaPct / 100)) * 10) / 10;
    }
    return {
      autonomiaKm,
      autonomia100Km,
      disponivel: autonomiaKm != null,
    };
  }

  private montarFonteOmni(
    bateriaPct: number | null,
    kmPorPercentual: number | null,
  ): AutonomiaFonteDto {
    if (
      bateriaPct == null ||
      kmPorPercentual == null ||
      !Number.isFinite(bateriaPct) ||
      !Number.isFinite(kmPorPercentual) ||
      kmPorPercentual <= 0
    ) {
      return { autonomiaKm: null, autonomia100Km: null, disponivel: false };
    }
    const autonomiaKm = Math.round(bateriaPct * kmPorPercentual * 10) / 10;
    const autonomia100Km = Math.round(100 * kmPorPercentual * 10) / 10;
    return {
      autonomiaKm,
      autonomia100Km,
      disponivel: true,
    };
  }

  async trocarVeiculoEscala(
    idEscalaDia: string,
    idVeiculoNovo: string,
  ): Promise<{
    idEscalaDia: string;
    data: string;
    prefixo: string;
    idVeiculo: string;
    descricao: string | null;
    placa: string | null;
    veiculoSubstituidoManual: boolean;
  }> {
    const idEscala = (idEscalaDia ?? '').trim();
    const idVeiculo = (idVeiculoNovo ?? '').trim();
    if (!idEscala) {
      throw new BadRequestException('Informe a escala do dia.');
    }
    if (!idVeiculo) {
      throw new BadRequestException('Informe o veículo de substituição.');
    }

    const escala = await this.escalaRepo.findOne({ where: { id: idEscala } });
    if (!escala) {
      throw new NotFoundException('Escala do dia não encontrada.');
    }

    const veiculo = await this.veiculoRepo.findOne({ where: { id: idVeiculo } });
    if (!veiculo) {
      throw new NotFoundException('Veículo não encontrado.');
    }

    escala.idVeiculo = veiculo.id;
    escala.veiculoSubstituidoManual = true;
    await this.escalaRepo.save(escala);

    return {
      idEscalaDia: escala.id,
      data: escala.data,
      prefixo: escala.prefixo,
      idVeiculo: veiculo.id,
      descricao: veiculo.descricao ?? null,
      placa: veiculo.placa ?? null,
      veiculoSubstituidoManual: true,
    };
  }

  async listarOsRetencao(idVeiculo: string): Promise<{
    idVeiculo: string;
    descricao: string | null;
    placa: string | null;
    total: number;
    itens: Array<{
      id: string;
      numeroIrregularidade: number;
      numeroVistoria: number | null;
      statusAtual: StatusIrregularidade;
      nomeArea: string | null;
      nomeComponente: string | null;
      descricaoSintoma: string | null;
      observacao: string | null;
      criadoEm: string | null;
      erpCodigoPedido: string | null;
      numOsExternoAtual: number | null;
      statusBrtAtual: string | null;
      osOrigAtual: string | null;
      idEmpresaManutencao: string | null;
      nomeEmpresa: string | null;
    }>;
  }> {
    const id = (idVeiculo ?? '').trim();
    if (!id) {
      throw new BadRequestException('Informe o veículo.');
    }

    const veiculo = await this.veiculoRepo.findOne({ where: { id } });
    if (!veiculo) {
      throw new NotFoundException('Veículo não encontrado.');
    }

    const rows = await this.irregularidadeRepo
      .createQueryBuilder('i')
      .innerJoinAndSelect('i.vistoria', 'v')
      .leftJoinAndSelect('i.area', 'area')
      .leftJoinAndSelect('i.componente', 'componente')
      .leftJoinAndSelect('i.sintoma', 'sintoma')
      .innerJoin(
        MatrizCriticidade,
        'matriz',
        'matriz.idComponente = i.idComponente AND matriz.idSintoma = i.idSintoma',
      )
      .where('v.idVeiculo = :idVeiculo', { idVeiculo: id })
      .andWhere('i.statusAtual IN (:...status)', { status: STATUS_RETIDO })
      .andWhere('matriz.gravidade = :gravidade', {
        gravidade: GravidadeCriticidade.VERMELHO,
      })
      .orderBy('i.numeroIrregularidade', 'ASC')
      .getMany();

    const idsEmpresa = Array.from(
      new Set(
        rows
          .map((i) => i.idEmpresaManutencao)
          .filter((eid): eid is string => !!eid),
      ),
    );
    const empresas =
      idsEmpresa.length > 0
        ? await this.empresaRepo.find({ where: { id: In(idsEmpresa) } })
        : [];
    const empresaById = new Map(empresas.map((e) => [e.id, e.descricao ?? null]));

    return {
      idVeiculo: id,
      descricao: veiculo.descricao ?? null,
      placa: veiculo.placa ?? null,
      total: rows.length,
      itens: rows.map((i) => ({
        id: i.id,
        numeroIrregularidade: i.numeroIrregularidade,
        numeroVistoria: i.vistoria?.numeroVistoria ?? null,
        statusAtual: i.statusAtual,
        nomeArea: i.area?.nome ?? null,
        nomeComponente: i.componente?.nome ?? null,
        descricaoSintoma: i.sintoma?.descricao ?? null,
        observacao: i.observacao ?? null,
        criadoEm: i.criadoEm ? i.criadoEm.toISOString() : null,
        erpCodigoPedido: i.erpCodigoPedido ?? null,
        numOsExternoAtual:
          i.numOsExternoAtual == null ? null : Number(i.numOsExternoAtual),
        statusBrtAtual: i.statusBrtAtual ?? null,
        osOrigAtual: i.osOrigAtual ?? null,
        idEmpresaManutencao: i.idEmpresaManutencao ?? null,
        nomeEmpresa: i.idEmpresaManutencao
          ? empresaById.get(i.idEmpresaManutencao) ?? null
          : null,
      })),
    };
  }

  private async buscarRetidosPorVeiculo(
    idsVeiculo: string[],
  ): Promise<Map<string, { retido: boolean; qtd: number }>> {
    const map = new Map<string, { retido: boolean; qtd: number }>();
    if (idsVeiculo.length === 0) {
      return map;
    }

    const rows: Array<{ idveiculo: string; qtd: string }> =
      await this.irregularidadeRepo
        .createQueryBuilder('i')
        .innerJoin('i.vistoria', 'v')
        .innerJoin(
          MatrizCriticidade,
          'matriz',
          'matriz.idComponente = i.idComponente AND matriz.idSintoma = i.idSintoma',
        )
        .select('v.idVeiculo', 'idveiculo')
        .addSelect('COUNT(*)', 'qtd')
        .where('i.statusAtual IN (:...status)', { status: STATUS_RETIDO })
        .andWhere('matriz.gravidade = :gravidade', {
          gravidade: GravidadeCriticidade.VERMELHO,
        })
        .andWhere('v.idVeiculo IN (:...ids)', { ids: idsVeiculo })
        .groupBy('v.idVeiculo')
        .getRawMany();

    for (const id of idsVeiculo) {
      map.set(id, { retido: false, qtd: 0 });
    }
    for (const row of rows) {
      const qtd = Number(row.qtd) || 0;
      map.set(row.idveiculo, { retido: qtd > 0, qtd });
    }
    return map;
  }

  private async resolverEmpresaBrt(
    idEmpresa?: string,
  ): Promise<EmpresaTerceira> {
    const preferida = idEmpresa?.trim() || null;

    const qb = this.empresaRepo
      .createQueryBuilder('e')
      .addSelect('e.brtToken')
      .where('e.ehEmpresaManutencao = true')
      .andWhere('e.integracaoManutencao = :int', {
        int: IntegracaoManutencaoEmpresa.BRT_OS,
      });

    if (preferida) {
      qb.andWhere('e.id = :id', { id: preferida });
    }

    qb.orderBy('e.descricao', 'ASC').take(1);
    const empresa = await qb.getOne();
    if (!empresa) {
      throw new NotFoundException(
        preferida
          ? 'Empresa BRT informada não encontrada ou sem integração BRT_OS.'
          : 'Nenhuma empresa com Integração OS BRT encontrada para telemetria.',
      );
    }
    return empresa;
  }

  private validarData(data: string): string {
    const texto = (data ?? '').trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
      throw new BadRequestException(
        'Informe a data no formato AAAA-MM-DD (ex.: 2026-10-29).',
      );
    }
    const d = new Date(`${texto}T00:00:00`);
    if (Number.isNaN(d.getTime())) {
      throw new BadRequestException('Data inválida.');
    }
    return texto;
  }
}
