import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { VistoriaService } from '../../services/vistoria.service';
import { VeiculoService } from '../../services/veiculo.service';
import { MotoristaService } from '../../services/motorista.service';
import { AreaVistoriadaService } from '../../services/area-vistoriada.service';
import { MatrizCriticidadeService } from '../../services/matriz-criticidade.service';
import { VeiculoAutocompleteComponent } from '../shared/veiculo-autocomplete/veiculo-autocomplete.component';
import { MotoristaAutocompleteComponent } from '../shared/motorista-autocomplete/motorista-autocomplete.component';
import { Veiculo, StatusVeiculo } from '../../models/veiculo.model';
import { Motorista } from '../../models/motorista.model';
import { StatusMotorista } from '../../models/status-motorista.enum';
import { AreaVistoriada, AreaComponente } from '../../models/area-vistoriada.model';
import { MatrizCriticidade } from '../../models/matriz-criticidade.model';
import { IrregularidadeResumo, SosSessaoAberta } from '../../models/vistoria.model';
import { compressImageForUpload } from '../../utils/compress-image.util';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal';

type SosEtapa = 1 | 2 | 3;
type SosModoAbertura = 'verificando' | 'escolher_sessao' | 'formulario';

interface FotoPendente {
  nomeArquivo: string;
  previewUrl: string;
  blob: Blob;
}

interface AudioPendente {
  nomeArquivo: string;
  file: File;
  previewUrl: string;
}

interface PendingMidiaSnapshot {
  irregularidadeId: string;
  fotos: FotoPendente[];
  audios: AudioPendente[];
  permiteAudio: boolean;
}

interface IrregularidadeSalva {
  id: string;
  numeroIrregularidade?: number;
  nomeArea: string;
  nomeComponente: string;
  descricaoSintoma: string;
  qtdFotos: number;
  qtdAudios: number;
  exigeFoto: boolean;
}

const MAX_AUDIO_BYTES = 15 * 1024 * 1024;

@Component({
  selector: 'app-irregularidade-sos-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    VeiculoAutocompleteComponent,
    MotoristaAutocompleteComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './irregularidade-sos-modal.html',
  styleUrls: ['./irregularidade-sos-modal.css'],
})
export class IrregularidadeSosModalComponent implements OnChanges {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();
  @Output() completed = new EventEmitter<void>();

  private readonly vistoriaService = inject(VistoriaService);
  private readonly veiculoService = inject(VeiculoService);
  private readonly motoristaService = inject(MotoristaService);
  private readonly areaService = inject(AreaVistoriadaService);
  private readonly matrizService = inject(MatrizCriticidadeService);

  readonly cancelSosConfirmMessage =
    'Cancelar remove a vistoria SOS e todas as irregularidades registradas nesta sessão. Esta ação não pode ser desfeita.';
  readonly excluirSessaoPendenteConfirmMessage =
    'Excluir remove a vistoria SOS em andamento e todas as irregularidades já registradas nesta sessão. Esta ação não pode ser desfeita.';
  readonly statusVeiculoAtivo = StatusVeiculo.ATIVO;
  readonly statusMotoristaAtivo = StatusMotorista.ATIVO;

  etapa: SosEtapa = 1;
  loading = false;
  error = '';
  showCancelConfirmModal = false;
  showVoltarEtapa1Modal = false;
  showDuplicataConfirmModal = false;
  showIrregularidadeFormModal = false;
  showExcluirSessaoPendenteModal = false;
  duplicataConfirmMessage = '';
  irregularidadeFormError = '';
  modoAbertura: SosModoAbertura = 'verificando';
  sessaoAbertaPendente: SosSessaoAberta | null = null;

  selectedVeiculo: Veiculo | null = null;
  selectedMotorista: Motorista | null = null;
  odometro: number | null = null;
  odometroDisplay = '';
  ultimoOdometro: number | null = null;
  bateria: number | null = null;
  observacaoVistoria = '';
  vistoriaMobileEmAndamento = false;

  vistoriaId = '';
  startedAt = 0;

  areas: AreaVistoriada[] = [];
  componentes: Array<{ id: string; nome: string }> = [];
  matrizItens: MatrizCriticidade[] = [];
  pendentes: IrregularidadeResumo[] = [];

  modalIdArea = '';
  modalIdComponente = '';
  modalIdSintoma = '';
  areaBusca = '';
  componenteBusca = '';
  sintomaBusca = '';
  showAreaOptions = false;
  showComponenteOptions = false;
  showSintomaOptions = false;

  observacao = '';
  selectedMatriz: MatrizCriticidade | null = null;
  fotos: FotoPendente[] = [];
  audios: AudioPendente[] = [];
  midiaUploadError = '';
  pendingMidiaIrregularidadeId = '';
  private pendingMidiaSnapshot: PendingMidiaSnapshot | null = null;

  salvas: IrregularidadeSalva[] = [];

  validacaoEtapa1 = false;
  validacaoEtapa2 = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']?.currentValue === true) {
      void this.aoAbrirModal();
    }
  }

  reabrirLimpo(): void {
    void this.aoAbrirModal();
  }

  private async aoAbrirModal(): Promise<void> {
    this.resetWizard();
    this.modoAbertura = 'verificando';
    try {
      const sessao = await firstValueFrom(this.vistoriaService.buscarSosSessaoAberta());
      if (sessao) {
        this.sessaoAbertaPendente = sessao;
        this.modoAbertura = 'escolher_sessao';
        return;
      }
      this.modoAbertura = 'formulario';
    } catch {
      this.modoAbertura = 'formulario';
    }
  }

  async continuarSessaoPendente(): Promise<void> {
    const sessao = this.sessaoAbertaPendente;
    if (!sessao) return;
    this.loading = true;
    this.error = '';
    try {
      const [veiculo, motorista] = await Promise.all([
        firstValueFrom(this.veiculoService.getById(sessao.idVeiculo)),
        firstValueFrom(this.motoristaService.getById(sessao.idMotorista)),
      ]);
      this.selectedVeiculo = veiculo;
      this.selectedMotorista = motorista;
      this.odometro = sessao.odometro;
      this.odometroDisplay = String(sessao.odometro);
      this.bateria = sessao.porcentagembateria;
      this.vistoriaId = sessao.id;
      this.startedAt = new Date(sessao.datavistoria).getTime();
      this.salvas = sessao.irregularidades.map((item) => ({
        id: item.id,
        numeroIrregularidade: item.numeroIrregularidade,
        nomeArea: item.nomeArea,
        nomeComponente: item.nomeComponente,
        descricaoSintoma: item.descricaoSintoma,
        qtdFotos: item.qtdFotos,
        qtdAudios: item.qtdAudios,
        exigeFoto: item.exigeFoto,
      }));
      this.sessaoAbertaPendente = null;
      this.modoAbertura = 'formulario';
      this.etapa = 2;
      await this.onVeiculoChange();
    } catch (err: unknown) {
      const msg = (err as { error?: { message?: string } })?.error?.message;
      this.error = msg || 'Erro ao retomar sessão SOS.';
      this.modoAbertura = 'escolher_sessao';
      this.sessaoAbertaPendente = sessao;
    } finally {
      this.loading = false;
    }
  }

  solicitarExcluirSessaoPendente(): void {
    this.showExcluirSessaoPendenteModal = true;
  }

  onExcluirSessaoPendenteDismissed(): void {
    this.showExcluirSessaoPendenteModal = false;
  }

  async onExcluirSessaoPendenteConfirmed(): Promise<void> {
    const sessao = this.sessaoAbertaPendente;
    this.showExcluirSessaoPendenteModal = false;
    if (!sessao) {
      this.modoAbertura = 'formulario';
      return;
    }
    this.loading = true;
    this.error = '';
    try {
      await firstValueFrom(this.vistoriaService.cancelarVistoria(sessao.id));
      this.sessaoAbertaPendente = null;
      this.modoAbertura = 'formulario';
      this.etapa = 1;
    } catch (err: unknown) {
      const msg = (err as { error?: { message?: string } })?.error?.message;
      this.error = msg || 'Erro ao excluir sessão SOS.';
    } finally {
      this.loading = false;
    }
  }

  formatarDataSessao(data: string): string {
    const parsed = new Date(data);
    if (Number.isNaN(parsed.getTime())) return data;
    return parsed.toLocaleString('pt-BR');
  }

  get rotuloVeiculoSessao(): string {
    const sessao = this.sessaoAbertaPendente;
    if (!sessao) return '';
    const placa = sessao.veiculoPlaca?.trim();
    return placa
      ? `${sessao.veiculoDescricao ?? 'Veículo'} - ${placa}`
      : (sessao.veiculoDescricao ?? 'Veículo');
  }

  get isEletrico(): boolean {
    return (this.selectedVeiculo?.combustivel ?? '').toLowerCase() === 'eletrico';
  }

  get tempoMinutos(): number {
    if (!this.startedAt) return 1;
    return Math.max(1, Math.round((Date.now() - this.startedAt) / 60000));
  }

  get filteredAreas(): AreaVistoriada[] {
    const q = this.areaBusca.trim().toLowerCase();
    if (!q) return this.areas;
    return this.areas.filter((a) => a.nome.toLowerCase().includes(q));
  }

  get filteredComponentes(): Array<{ id: string; nome: string }> {
    const q = this.componenteBusca.trim().toLowerCase();
    if (!q) return this.componentes;
    return this.componentes.filter((c) => c.nome.toLowerCase().includes(q));
  }

  get filteredSintomas(): MatrizCriticidade[] {
    const q = this.sintomaBusca.trim().toLowerCase();
    if (!q) return this.matrizItens;
    return this.matrizItens.filter((m) =>
      (m.sintoma?.descricao ?? '').toLowerCase().includes(q),
    );
  }

  get canAvancarEtapa1(): boolean {
    if (!this.selectedVeiculo || !this.selectedMotorista) return false;
    if (this.odometro === null || this.odometro <= 0) return false;
    if (this.isEletrico && (this.bateria === null || this.bateria < 0 || this.bateria > 100)) {
      return false;
    }
    return true;
  }

  get canConcluirSos(): boolean {
    if (this.salvas.length === 0) return false;
    return !this.salvas.some((s) => s.exigeFoto && s.qtdFotos === 0);
  }

  get veiculoInvalido(): boolean {
    return this.validacaoEtapa1 && !this.selectedVeiculo;
  }

  get motoristaInvalido(): boolean {
    return this.validacaoEtapa1 && !this.selectedMotorista;
  }

  get odometroInvalido(): boolean {
    return !!this.mensagemErroOdometro;
  }

  get mensagemErroOdometro(): string {
    if (!this.validacaoEtapa1) return '';
    if (this.odometro === null || this.odometro <= 0) {
      return 'Informe um odômetro válido.';
    }
    if (this.ultimoOdometro !== null && this.odometro <= this.ultimoOdometro) {
      return `O odômetro deve ser maior que ${this.ultimoOdometro} (última vistoria).`;
    }
    return '';
  }

  get bateriaInvalida(): boolean {
    return (
      this.validacaoEtapa1 &&
      this.isEletrico &&
      (this.bateria === null || this.bateria < 0 || this.bateria > 100)
    );
  }

  get areaInvalida(): boolean {
    return this.validacaoEtapa2 && !this.modalIdArea;
  }

  get componenteInvalido(): boolean {
    return this.validacaoEtapa2 && !this.modalIdComponente;
  }

  get sintomaInvalido(): boolean {
    return this.validacaoEtapa2 && !this.modalIdSintoma;
  }

  get observacaoInvalida(): boolean {
    return this.validacaoEtapa2 && !this.observacao.trim();
  }

  get fotosInvalidas(): boolean {
    return (
      this.validacaoEtapa2 &&
      !!this.selectedMatriz?.exigeFoto &&
      this.fotos.length === 0
    );
  }

  get temClassificacaoCompleta(): boolean {
    return !!(this.modalIdArea && this.modalIdComponente && this.modalIdSintoma);
  }

  getGravidadeChipClass(gravidade?: string | null): string {
    switch (gravidade) {
      case 'VERDE':
        return 'chip chip-gravidade-verde';
      case 'AMARELO':
        return 'chip chip-gravidade-amarelo';
      case 'VERMELHO':
        return 'chip chip-gravidade-vermelho';
      default:
        return 'chip';
    }
  }

  solicitarVoltarEtapa1(): void {
    if (this.salvas.length > 0) {
      this.showVoltarEtapa1Modal = true;
      return;
    }
    this.voltarEtapa1();
  }

  voltarEtapa1(): void {
    this.showVoltarEtapa1Modal = false;
    this.fecharFormIrregularidade();
    this.validacaoEtapa2 = false;
    this.error = '';
    this.etapa = 1;
  }

  onVoltarEtapa1Dismissed(): void {
    this.showVoltarEtapa1Modal = false;
  }

  onDuplicataDismissed(): void {
    this.showDuplicataConfirmModal = false;
  }

  async onDuplicataConfirmed(): Promise<void> {
    this.showDuplicataConfirmModal = false;
    await this.executarSalvarIrregularidade();
  }

  abrirFormIrregularidade(): void {
    this.limparFormIrregularidade();
    this.irregularidadeFormError = '';
    this.validacaoEtapa2 = false;
    this.showIrregularidadeFormModal = true;
  }

  fecharFormIrregularidade(): void {
    this.showIrregularidadeFormModal = false;
    this.validacaoEtapa2 = false;
    this.irregularidadeFormError = '';
    this.limparFormIrregularidade();
  }

  onVeiculoSelected(veiculo: Veiculo): void {
    this.selectedVeiculo = veiculo;
    void this.onVeiculoChange();
  }

  onMotoristaSelected(motorista: Motorista): void {
    this.selectedMotorista = motorista;
  }

  async onVeiculoChange(): Promise<void> {
    if (!this.selectedVeiculo?.id) return;
    try {
      const ultimo = await firstValueFrom(
        this.vistoriaService.getUltimoOdometro(this.selectedVeiculo.id),
      );
      this.ultimoOdometro = ultimo?.odometro ?? null;
      const vistorias = await firstValueFrom(
        this.vistoriaService.listar({ status: 'EM_ANDAMENTO' }),
      );
      this.vistoriaMobileEmAndamento = (vistorias ?? []).some(
        (v) =>
          v.idVeiculo === this.selectedVeiculo?.id &&
          v.origem !== 'SOS_WEB' &&
          v.status === 'EM_ANDAMENTO',
      );
      const idModelo = this.selectedVeiculo.idModelo;
      this.areas = await firstValueFrom(this.areaService.getAll(idModelo, true));
      this.pendentes = await firstValueFrom(
        this.vistoriaService.listarIrregularidadesPendentes(this.selectedVeiculo.id),
      );
    } catch {
      this.areas = [];
      this.pendentes = [];
    }
  }

  onOdometroInput(value: string): void {
    const parsed = Number.parseInt(value.replace(/\D/g, ''), 10);
    if (Number.isNaN(parsed)) {
      this.odometro = null;
      this.odometroDisplay = '';
      return;
    }
    this.odometro = parsed;
    this.odometroDisplay = String(parsed);
    if (
      this.error &&
      (this.error.includes('odômetro') || this.error.includes('Odômetro'))
    ) {
      this.error = '';
    }
  }

  onAreaKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    const primeira = this.filteredAreas[0];
    if (primeira) this.selectArea(primeira);
  }

  onComponenteKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    const primeiro = this.filteredComponentes[0];
    if (primeiro) this.selectComponente(primeiro);
  }

  onSintomaKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    const primeiro = this.filteredSintomas[0];
    if (primeiro) this.selectSintoma(primeiro);
  }

  async avancarEtapa1(): Promise<void> {
    this.error = '';
    this.validacaoEtapa1 = true;
    if (!this.canAvancarEtapa1 || !this.selectedVeiculo || !this.selectedMotorista) {
      this.error = 'Preencha veículo, motorista e odômetro.';
      return;
    }
    if (!(await this.validarOdometro())) return;

    this.loading = true;
    try {
      const vistoria = await firstValueFrom(
        this.vistoriaService.criarVistoriaSos({
          idveiculo: this.selectedVeiculo.id,
          idmotorista: this.selectedMotorista.id,
          odometro: Number(this.odometro),
          ...(this.bateria !== null ? { porcentagembateria: Number(this.bateria) } : {}),
          ...(this.observacaoVistoria.trim()
            ? { observacao: this.observacaoVistoria.trim() }
            : {}),
        }),
      );
      this.vistoriaId = vistoria.id;
      this.startedAt = Date.now();
      this.validacaoEtapa1 = false;
      this.validacaoEtapa2 = false;
      this.etapa = 2;
    } catch (err: unknown) {
      const msg = (err as { error?: { message?: string } })?.error?.message;
      this.error = msg || 'Erro ao iniciar vistoria SOS.';
    } finally {
      this.loading = false;
    }
  }

  private async validarOdometro(): Promise<boolean> {
    if (this.odometro === null || this.odometro <= 0) {
      this.error = 'Informe um odômetro válido.';
      return false;
    }
    if (this.ultimoOdometro !== null && this.odometro <= this.ultimoOdometro) {
      this.error = 'Odômetro deve ser maior que o da última vistoria.';
      return false;
    }
    if (this.ultimoOdometro !== null) {
      const diff = this.odometro - this.ultimoOdometro;
      if (diff > 200) {
        const ok = window.confirm(
          `Veículo rodou ${diff} km desde a última vistoria. Deseja registrar o odômetro?`,
        );
        if (!ok) return false;
      }
    }
    return true;
  }

  async selectArea(area: AreaVistoriada): Promise<void> {
    this.modalIdArea = area.id;
    this.areaBusca = area.nome;
    this.showAreaOptions = false;
    this.modalIdComponente = '';
    this.modalIdSintoma = '';
    this.componenteBusca = '';
    this.sintomaBusca = '';
    this.selectedMatriz = null;
    const vinculados = await firstValueFrom(this.areaService.listComponentes(area.id));
    this.componentes = (vinculados ?? [])
      .map((v: AreaComponente | Record<string, unknown>) => {
        const raw = v as Record<string, unknown>;
        const id = String(raw['idComponente'] ?? raw['idcomponente'] ?? '').trim();
        const comp = raw['componente'] as Record<string, unknown> | undefined;
        const nome = String(comp?.['nome'] ?? raw['nomeComponente'] ?? id).trim();
        return { id, nome };
      })
      .filter((c) => !!c.id);
  }

  async selectComponente(comp: { id: string; nome: string }): Promise<void> {
    this.modalIdComponente = comp.id;
    this.componenteBusca = comp.nome;
    this.showComponenteOptions = false;
    this.modalIdSintoma = '';
    this.sintomaBusca = '';
    this.selectedMatriz = null;
    this.matrizItens = await firstValueFrom(this.matrizService.getAll(comp.id));
  }

  selectSintoma(item: MatrizCriticidade): void {
    this.modalIdSintoma = item.idSintoma;
    this.sintomaBusca = item.sintoma?.descricao ?? item.idSintoma;
    this.showSintomaOptions = false;
    this.selectedMatriz = item;
  }

  pendenciaDuplicada(): IrregularidadeResumo | undefined {
    if (!this.modalIdComponente || !this.modalIdSintoma) return undefined;
    return this.pendentes.find(
      (p) =>
        p.idcomponente === this.modalIdComponente && p.idsintoma === this.modalIdSintoma,
    );
  }

  async onFotosSelected(event: Event): Promise<void> {
    if (!this.temClassificacaoCompleta) return;
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = '';
    for (const file of files) {
      try {
        const blob = await compressImageForUpload(file);
        const previewUrl = URL.createObjectURL(blob);
        this.fotos.push({
          nomeArquivo: file.name.replace(/\.[^.]+$/, '.jpg'),
          previewUrl,
          blob,
        });
      } catch {
        this.error = 'Falha ao processar uma das imagens.';
      }
    }
  }

  onAudiosSelected(event: Event): void {
    if (!this.temClassificacaoCompleta) return;
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = '';
    for (const file of files) {
      if (file.size > MAX_AUDIO_BYTES) {
        this.error = `Áudio "${file.name}" excede 15 MB.`;
        continue;
      }
      this.audios.push({
        nomeArquivo: file.name,
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }
  }

  removerFoto(index: number): void {
    const foto = this.fotos[index];
    if (foto?.previewUrl) URL.revokeObjectURL(foto.previewUrl);
    this.fotos.splice(index, 1);
  }

  removerAudio(index: number): void {
    const audio = this.audios[index];
    if (audio?.previewUrl) URL.revokeObjectURL(audio.previewUrl);
    this.audios.splice(index, 1);
  }

  async salvarIrregularidade(): Promise<void> {
    this.irregularidadeFormError = '';
    this.validacaoEtapa2 = true;
    const observacaoTrim = this.observacao.trim();
    if (!this.modalIdArea || !this.modalIdComponente || !this.modalIdSintoma) {
      this.irregularidadeFormError = 'Selecione área, componente e sintoma.';
      return;
    }
    if (!observacaoTrim) {
      this.irregularidadeFormError = 'A descrição do problema é obrigatória.';
      return;
    }
    if (this.selectedMatriz?.exigeFoto && this.fotos.length === 0) {
      this.irregularidadeFormError = 'Foto obrigatória para este sintoma.';
      return;
    }

    const dup = this.pendenciaDuplicada();
    if (dup) {
      const numero = dup.numeroIrregularidade ? `#${dup.numeroIrregularidade}` : dup.id;
      this.duplicataConfirmMessage =
        `Já existe irregularidade pendente para este veículo, componente e sintoma.\nO.S. ${numero}.\n\nDeseja registrar mesmo assim?`;
      this.showDuplicataConfirmModal = true;
      return;
    }

    await this.executarSalvarIrregularidade();
  }

  private async executarSalvarIrregularidade(): Promise<void> {
    const observacaoTrim = this.observacao.trim();
    this.loading = true;
    try {
      const created = await firstValueFrom(
        this.vistoriaService.criarIrregularidade(this.vistoriaId, {
          idarea: this.modalIdArea,
          idcomponente: this.modalIdComponente,
          idsintoma: this.modalIdSintoma,
          observacao: observacaoTrim,
        }),
      );

      let qtdFotos = 0;
      let qtdAudios = 0;
      try {
        if (this.fotos.length > 0) {
          const files = this.fotos.map(
            (f, i) =>
              new File([f.blob], `sos_img${i + 1}.jpg`, { type: 'image/jpeg' }),
          );
          await firstValueFrom(
            this.vistoriaService.uploadIrregularidadeImagens(created.id, files),
          );
          qtdFotos = files.length;
        }
        if (this.selectedMatriz?.permiteAudio && this.audios.length > 0) {
          for (const audio of this.audios) {
            await firstValueFrom(
              this.vistoriaService.uploadIrregularidadeAudio(created.id, audio.file),
            );
            qtdAudios += 1;
          }
        }
      } catch {
        this.midiaUploadError = `Irregularidade #${created.numeroIrregularidade ?? created.id} criada, mas falha no envio de mídias. Use "Tentar mídias novamente".`;
        this.pendingMidiaIrregularidadeId = created.id;
        this.pendingMidiaSnapshot = {
          irregularidadeId: created.id,
          fotos: [...this.fotos],
          audios: [...this.audios],
          permiteAudio: !!this.selectedMatriz?.permiteAudio,
        };
      }

      this.salvas.push({
        id: created.id,
        numeroIrregularidade: created.numeroIrregularidade,
        nomeArea: this.areaBusca,
        nomeComponente: this.componenteBusca,
        descricaoSintoma: this.sintomaBusca,
        qtdFotos,
        qtdAudios,
        exigeFoto: !!this.selectedMatriz?.exigeFoto,
      });

      this.validacaoEtapa2 = false;
      this.fecharFormIrregularidade();
    } catch (err: unknown) {
      const msg = (err as { error?: { message?: string } })?.error?.message;
      this.irregularidadeFormError = msg || 'Erro ao salvar irregularidade.';
    } finally {
      this.loading = false;
    }
  }

  async retryMidiasPendentes(): Promise<void> {
    const snapshot = this.pendingMidiaSnapshot;
    const id = this.pendingMidiaIrregularidadeId;
    if (!id || !snapshot) return;
    this.loading = true;
    this.midiaUploadError = '';
    try {
      let qtdFotos = 0;
      let qtdAudios = 0;
      if (snapshot.fotos.length > 0) {
        const files = snapshot.fotos.map(
          (f, i) => new File([f.blob], `sos_img${i + 1}.jpg`, { type: 'image/jpeg' }),
        );
        await firstValueFrom(this.vistoriaService.uploadIrregularidadeImagens(id, files));
        qtdFotos = files.length;
      }
      if (snapshot.permiteAudio && snapshot.audios.length > 0) {
        for (const audio of snapshot.audios) {
          await firstValueFrom(
            this.vistoriaService.uploadIrregularidadeAudio(id, audio.file),
          );
          qtdAudios += 1;
        }
      }
      const salva = this.salvas.find((s) => s.id === id);
      if (salva) {
        salva.qtdFotos = qtdFotos;
        salva.qtdAudios = qtdAudios;
      }
      this.limparMidiaPendente();
    } catch (err: unknown) {
      const msg = (err as { error?: { message?: string } })?.error?.message;
      this.midiaUploadError = msg || 'Falha ao reenviar mídias.';
    } finally {
      this.loading = false;
    }
  }

  irParaRevisao(): void {
    if (this.salvas.length === 0) {
      this.error = 'Registre ao menos uma irregularidade antes de concluir.';
      return;
    }
    if (!this.canConcluirSos) {
      this.error = 'Há irregularidade com foto obrigatória pendente.';
      return;
    }
    this.etapa = 3;
  }

  async concluirSos(): Promise<void> {
    this.loading = true;
    this.error = '';
    try {
      await firstValueFrom(
        this.vistoriaService.finalizarVistoria(this.vistoriaId, {
          tempo: this.tempoMinutos,
          ...(this.observacaoVistoria.trim()
            ? { observacao: this.observacaoVistoria.trim() }
            : {}),
        }),
      );
      this.completed.emit();
      this.fechar();
    } catch (err: unknown) {
      const msg = (err as { error?: { message?: string } })?.error?.message;
      this.error = msg || 'Erro ao concluir SOS.';
    } finally {
      this.loading = false;
    }
  }

  cancelarSos(): void {
    this.showCancelConfirmModal = true;
  }

  onCancelSosDismissed(): void {
    this.showCancelConfirmModal = false;
  }

  async onCancelSosConfirmed(): Promise<void> {
    this.showCancelConfirmModal = false;
    if (this.vistoriaId) {
      this.loading = true;
      try {
        await firstValueFrom(this.vistoriaService.cancelarVistoria(this.vistoriaId));
      } catch {
        // segue fechando mesmo com erro de rede
      } finally {
        this.loading = false;
      }
    }
    this.fechar();
  }

  fechar(): void {
    this.resetWizard();
    this.closed.emit();
  }

  tentarFechar(): void {
    if (this.modoAbertura === 'escolher_sessao') {
      this.fechar();
      return;
    }
    if (this.vistoriaId) {
      this.cancelarSos();
      return;
    }
    this.fechar();
  }

  private limparFormIrregularidade(): void {
    this.revogarPreviews();
    this.observacao = '';
    this.modalIdArea = '';
    this.modalIdComponente = '';
    this.modalIdSintoma = '';
    this.areaBusca = '';
    this.componenteBusca = '';
    this.sintomaBusca = '';
    this.selectedMatriz = null;
    this.fotos = [];
    this.audios = [];
    this.componentes = [];
    this.matrizItens = [];
  }

  private limparMidiaPendente(): void {
    this.pendingMidiaIrregularidadeId = '';
    this.pendingMidiaSnapshot = null;
    this.midiaUploadError = '';
  }

  private revogarPreviews(): void {
    this.fotos.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    this.audios.forEach((a) => URL.revokeObjectURL(a.previewUrl));
  }

  private resetWizard(): void {
    this.revogarPreviews();
    this.etapa = 1;
    this.loading = false;
    this.error = '';
    this.showCancelConfirmModal = false;
    this.showVoltarEtapa1Modal = false;
    this.showDuplicataConfirmModal = false;
    this.showIrregularidadeFormModal = false;
    this.showExcluirSessaoPendenteModal = false;
    this.modoAbertura = 'verificando';
    this.sessaoAbertaPendente = null;
    this.duplicataConfirmMessage = '';
    this.irregularidadeFormError = '';
    this.validacaoEtapa1 = false;
    this.validacaoEtapa2 = false;
    this.selectedVeiculo = null;
    this.selectedMotorista = null;
    this.odometro = null;
    this.odometroDisplay = '';
    this.ultimoOdometro = null;
    this.bateria = null;
    this.observacaoVistoria = '';
    this.vistoriaMobileEmAndamento = false;
    this.vistoriaId = '';
    this.startedAt = 0;
    this.areas = [];
    this.componentes = [];
    this.matrizItens = [];
    this.pendentes = [];
    this.salvas = [];
    this.limparFormIrregularidade();
    this.limparMidiaPendente();
  }

  isPendenciaDestacada(p: IrregularidadeResumo): boolean {
    return (
      !!this.modalIdComponente &&
      !!this.modalIdSintoma &&
      p.idcomponente === this.modalIdComponente &&
      p.idsintoma === this.modalIdSintoma
    );
  }
}
