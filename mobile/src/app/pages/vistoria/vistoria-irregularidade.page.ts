import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AlertController,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonItem,
  IonLabel,
  IonList,
  IonTextarea,
  IonText,
  IonTitle,
  IonToolbar,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBack,
  cameraOutline,
  trashOutline,
} from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import { MatrizCriticidadeService } from '../../services/matriz-criticidade.service';
import { VistoriaFlowService } from '../../services/vistoria-flow.service';
import { VistoriaService } from '../../services/vistoria.service';
import { VistoriaBootstrapService } from '../../services/vistoria-bootstrap.service';
import { ErrorMessageService } from '../../services/error-message.service';
import { AuthService } from '../../services/auth.service';
import { MatrizCriticidade } from '../../models/matriz-criticidade.model';
import { VistoriaBootstrap } from '../../models/vistoria-bootstrap.model';
import {
  IrregularidadeAudioResumo,
  IrregularidadeImagemResumo,
  IrregularidadeResumo,
} from '../../models/irregularidade.model';

interface FotoIrregularidade {
  nomeArquivo: string;
  tamanho: number;
  dadosBase64: string;
}

interface AudioIrregularidade {
  id?: string;
  nomeArquivo: string;
  base64: string;
  mimeType: string;
  previewUrl?: string;
  durationMs?: number;
}

interface RegistroMidiasCarregadas {
  fotos: FotoIrregularidade[];
  audios: AudioIrregularidade[];
}

interface RegistroVisualizacao {
  numero: string;
  dataRegistro: string;
  vistoriador: string;
  area: string;
  componente: string;
  sintoma: string;
  observacao: string;
  fotos: Array<{ nomeArquivo: string; src: string }>;
  audios: Array<{ nomeArquivo: string; src: string }>;
}

@Component({
  selector: 'app-vistoria-irregularidade',
  standalone: true,
  templateUrl: './vistoria-irregularidade.page.html',
  styleUrls: ['./vistoria-irregularidade.page.scss'],
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    IonContent,
    IonFooter,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonText,
    IonTextarea,
    IonSpinner,
  ],
})
export class VistoriaIrregularidadePage implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private matrizService = inject(MatrizCriticidadeService);
  private flowService = inject(VistoriaFlowService);
  private vistoriaService = inject(VistoriaService);
  private bootstrapService = inject(VistoriaBootstrapService);
  private alertController = inject(AlertController);
  private errorMessageService = inject(ErrorMessageService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('observacaoInput', { read: IonTextarea })
  observacaoInput?: IonTextarea;

  areaId = '';
  componenteId = '';
  areaNome = '';
  componenteNome = '';

  matriz: MatrizCriticidade[] = [];
  pendentesParaComponente: IrregularidadeResumo[] = [];
  selectedMatriz: MatrizCriticidade | null = null;
  irregularidadeEmEdicaoId: string | null = null;
  irregularidadeEmEdicaoNumero: number | null = null;
  observacao = '';
  fotos: FotoIrregularidade[] = [];
  audios: AudioIrregularidade[] = [];
  audiosExistentesCount = 0;
  private irregularidadesDaVistoria: IrregularidadeResumo[] = [];
  private cacheMidiasRegistros = new Map<string, RegistroMidiasCarregadas>();
  registroVisualizacao: RegistroVisualizacao | null = null;
  exibirRegistroVisualizacao = false;
  previewImagemRegistroSrc: string | null = null;
  previewImagemRegistroNome: string | null = null;
  private registroPreviewAudioUrls = new Set<string>();
  audioBase64?: string;
  audioMimeType?: string;
  audioDurationMs?: number;
  gravandoAudio = false;
  /** Modal aberto antes do native concluir startRecording (evita tela “muda” sem feedback). */
  gravacaoPreparando = false;
  exibirModalGravacaoAudio = false;
  tempoGravacaoSegundos = 0;
  private audioTimerId: ReturnType<typeof setInterval> | null = null;
  private audioObjectUrls = new Set<string>();
  podeGravarAudio = true;
  loading = false;
  saving = false;
  errorMessage = '';
  isNative = Capacitor.getPlatform() !== 'web';

  /** Número da vistoria para exibição abaixo da barra */
  get vistoriaNrDisplay(): string {
    const nr = this.flowService.getNumeroVistoriaDisplay();
    return nr ? `Vistoria - ${nr}` : 'Vistoria';
  }

  get vistoriaNumero(): string {
    return this.flowService.getNumeroVistoriaDisplay() || '-';
  }

  get veiculoNumero(): string {
    return this.flowService.getVeiculoDescricao() || '-';
  }

  get canViewHistoricoVeiculo(): boolean {
    return this.authService.hasPermission('vistoria_web_historico_veiculo:read');
  }

  /** Nível atual (breadcrumb) */
  get headerTitle(): string {
    if (this.selectedMatriz?.sintoma?.descricao) {
      return `${this.areaNome} - ${this.componenteNome} - ${this.selectedMatriz.sintoma.descricao}`;
    }
    return `${this.areaNome} - ${this.componenteNome}`;
  }

  /** Instrução do nível atual */
  get nivelInstruction(): string {
    if (this.selectedMatriz !== null) {
      return 'Descreva o problema e anexe mídias';
    }
    return 'Selecione o Sintoma:';
  }

  get tempoGravacaoFormatado(): string {
    const s = this.tempoGravacaoSegundos;
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
  }

  constructor() {
    addIcons({
      arrowBack,
      cameraOutline,
      trashOutline,
    });
  }

  async voltar(): Promise<void> {
    if (this.selectedMatriz !== null) {
      if (!(await this.validarSemGravacaoAtiva('voltar'))) {
        return;
      }
      if (this.temDadosNaoSalvos()) {
        const confirmarSaida = await this.confirmarPerdaAlteracoes();
        if (!confirmarSaida) {
          return;
        }
      }
      this.selectedMatriz = null;
      this.irregularidadeEmEdicaoId = null;
      this.irregularidadeEmEdicaoNumero = null;
      this.limparMidiasEmMemoria();
    } else {
      this.limparMidiasEmMemoria();
      this.router.navigate(['/vistoria/areas']);
    }
  }

  async ngOnInit(): Promise<void> {
    const vistoriaId = this.flowService.getVistoriaId();
    if (!vistoriaId) {
      this.router.navigate(['/vistoria/inicio']);
      return;
    }

    this.areaId = this.route.snapshot.paramMap.get('areaId') ?? '';
    this.componenteId = this.route.snapshot.paramMap.get('componenteId') ?? '';
    if (!this.areaId || !this.componenteId) {
      this.router.navigate(['/vistoria/areas']);
      return;
    }
    const state = this.router.getCurrentNavigation()?.extras?.state as
      | { areaNome?: string; componenteNome?: string }
      | undefined;
    this.areaNome = state?.areaNome ?? 'Área';
    this.componenteNome = state?.componenteNome ?? 'Componente';

    this.loading = true;
    try {
      const bootstrap = await this.bootstrapService.getOrFetch(vistoriaId);
      const bootstrapAplicado = bootstrap ? this.aplicarBootstrap(bootstrap) : false;

      if (!bootstrapAplicado) {
        await this.vistoriaService.getById(vistoriaId);
        const veiculoId = this.flowService.getVeiculoId();
        const [matrizRes, pendentesRes, irregularidadesRes] = await Promise.all([
          this.matrizService.listarPorComponente(this.componenteId),
          veiculoId ? this.vistoriaService.listarIrregularidadesPendentes(veiculoId) : Promise.resolve([]),
          this.vistoriaService.listarIrregularidades(vistoriaId),
        ]);
        this.matriz = matrizRes;
        this.pendentesParaComponente = pendentesRes.filter((p) => p.idcomponente === this.componenteId);
        this.irregularidadesDaVistoria = irregularidadesRes.filter(
          (i) => i.idarea === this.areaId && i.idcomponente === this.componenteId,
        );
      }
      await this.recarregarStatusComponente(vistoriaId);
      await this.precarregarMidiasRegistrosExistentes();
    } catch {
      this.errorMessage = 'Erro ao carregar sintomas.';
    } finally {
      this.loading = false;
      void this.verificarCapacidadeAudio();
    }
  }

  ngOnDestroy(): void {
    // Garante liberação do microfone ao sair da tela.
    if (this.gravandoAudio || this.gravacaoPreparando) {
      void VoiceRecorder.stopRecording().catch(() => undefined);
    }
    this.exibirModalGravacaoAudio = false;
    this.gravacaoPreparando = false;
    this.gravandoAudio = false;
    this.limparMidiasEmMemoria();
  }

  isSintomaSelected(item: MatrizCriticidade): boolean {
    return this.selectedMatriz != null && this.selectedMatriz.id === item.id;
  }

  isIrregularidadeJaRegistrada(item: MatrizCriticidade): boolean {
    return this.irregularidadesDaVistoria.some((ir) => ir.idsintoma === item.idSintoma);
  }

  temPendenteAnterior(item: MatrizCriticidade): boolean {
    return this.pendentesParaComponente.some((p) => p.idsintoma === item.idSintoma);
  }

  quantidadePendenciasAnteriores(item: MatrizCriticidade): number {
    return this.obterPendenciasAnterioresDoSintoma(item).length;
  }

  async selecionarSintoma(item: MatrizCriticidade): Promise<void> {
    this.selectedMatriz = item;
    await this.carregarIrregularidadeExistente(item);
  }

  async abrirResumoVistoria(): Promise<void> {
    const vistoriaId = this.flowService.getVistoriaId();
    if (!vistoriaId) {
      return;
    }

    try {
      const [vistoria, irregularidades] = await Promise.all([
        this.vistoriaService.getById(vistoriaId),
        this.vistoriaService.listarIrregularidades(vistoriaId),
      ]);
      const numeroVistoriaRaw = this.vistoriaNumero || '-';
      const numeroVistoriaDigits = numeroVistoriaRaw.replace(/\D+/g, '');
      const numeroVistoria = numeroVistoriaDigits || numeroVistoriaRaw;
      const currentUser = this.authService.getCurrentUser();
      const vistoriador =
        vistoria.idUsuario && currentUser?.id === vistoria.idUsuario
          ? (currentUser.nome ?? vistoria.idUsuario)
          : (vistoria.idUsuario ?? '-');
      const veiculo = vistoria.veiculo?.descricao ?? '-';
      const motorista = vistoria.motorista?.nome ?? '-';
      const odometro =
        vistoria.odometro == null ? '-' : Number(vistoria.odometro).toFixed(2);
      const bateria =
        vistoria.porcentagembateria == null
          ? '-'
          : `${Number(vistoria.porcentagembateria).toFixed(2)}%`;
      const detalhes = irregularidades.length > 0
        ? irregularidades
            .map((item) => {
              const area = item.nomeArea ?? item.idarea ?? 'Area';
              const componente = item.nomeComponente ?? item.idcomponente ?? 'Componente';
              const sintoma = item.descricaoSintoma ?? item.idsintoma ?? 'Sintoma';
              return `- ${this.escapeHtml(area)} - ${this.escapeHtml(componente)} - ${this.escapeHtml(sintoma)}`;
            })
            .join('<br>')
        : '- Nenhuma irregularidade registrada';

      const alert = await this.alertController.create({
        header: `Vistoria ${numeroVistoria}`,
        cssClass: 'alert-resumo-vistoria',
        message:
          `<strong>Vistoriador:</strong> ${this.escapeHtml(vistoriador)}<br>` +
          `<strong>Veiculo:</strong> ${this.escapeHtml(veiculo)}<br>` +
          `<strong>Motorista:</strong> ${this.escapeHtml(motorista)}<br>` +
          `<strong>Odometro:</strong> ${this.escapeHtml(odometro)}<br>` +
          `<strong>% Bateria:</strong> ${this.escapeHtml(bateria)}<br>` +
          `<strong>Irregularidades:</strong> ${irregularidades.length}<br><br>` +
          `<strong>Resumo:</strong><br>${detalhes}`,
        buttons: [{ text: 'OK', cssClass: 'alert-ok-voltar' }],
      });
      await alert.present();
    } catch (error: any) {
      this.errorMessage = this.errorMessageService.fromApi(
        error,
        'Nao foi possivel carregar o resumo da vistoria.',
      );
    }
  }

  async abrirResumoPendenciasVeiculo(): Promise<void> {
    if (!this.canViewHistoricoVeiculo) {
      return;
    }
    this.router.navigate(['/vistoria/pendencias-veiculo'], {
      state: { fromMenu: false },
    });
  }

  async visualizarRegistroPendente(
    item: MatrizCriticidade,
    event?: Event,
  ): Promise<void> {
    event?.stopPropagation();
    event?.preventDefault();
    const existente = await this.selecionarRegistroPendente(item);
    if (!existente) {
      return;
    }

    const midias = await this.carregarMidiasDoRegistro(existente);
    const numero = existente.numeroIrregularidade
      ? `#${existente.numeroIrregularidade}`
      : existente.id.slice(0, 8);
    const observacao = existente.observacao?.trim()
      ? existente.observacao.trim()
      : 'Sem observação informada';

    this.revogarPreviewsRegistroVisualizacao();
    const fotos = midias.fotos.map((foto) => ({
      nomeArquivo: foto.nomeArquivo,
      src: `data:${this.getMimeTypeFromFilename(foto.nomeArquivo)};base64,${foto.dadosBase64}`,
    }));
    const audios = midias.audios.map((audio) => {
      const src = this.criarPreviewAudioBlobUrl(audio.base64, audio.mimeType);
      this.registroPreviewAudioUrls.add(src);
      return {
        nomeArquivo: audio.nomeArquivo,
        src,
      };
    });

    this.registroVisualizacao = {
      numero,
      dataRegistro: this.formatarDataHoraRegistro(existente.atualizadoEm),
      vistoriador: existente.vistoriadorNome?.trim() || 'Não informado',
      area: this.areaNome,
      componente: this.componenteNome,
      sintoma: item.sintoma?.descricao ?? existente.descricaoSintoma ?? '-',
      observacao,
      fotos,
      audios,
    };
    this.exibirRegistroVisualizacao = true;
  }

  private obterPendenciasAnterioresDoSintoma(item: MatrizCriticidade): IrregularidadeResumo[] {
    return this.pendentesParaComponente
      .filter((ir) => ir.idsintoma === item.idSintoma)
      .sort((a, b) => {
        const dataA = new Date(a.atualizadoEm).getTime();
        const dataB = new Date(b.atualizadoEm).getTime();
        return dataB - dataA;
      });
  }

  private async selecionarRegistroPendente(
    item: MatrizCriticidade,
  ): Promise<IrregularidadeResumo | null> {
    const pendencias = this.obterPendenciasAnterioresDoSintoma(item);
    if (pendencias.length === 0) {
      return null;
    }

    if (pendencias.length === 1) {
      return pendencias[0];
    }

    const alert = await this.alertController.create({
      header: `Pendências anteriores (${pendencias.length})`,
      message: 'Selecione qual irregularidade deseja visualizar.',
      inputs: pendencias.map((registro, index) => ({
        type: 'radio',
        label: this.montarRotuloRegistroPendente(registro),
        value: registro.id,
        checked: index === 0,
      })),
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Visualizar', role: 'confirm' },
      ],
    });
    await alert.present();
    const { role, data } = await alert.onDidDismiss();
    if (role !== 'confirm') {
      return null;
    }

    const selectedValue =
      typeof data?.values === 'string'
        ? data.values
        : (data?.values?.toString?.() ?? '');
    return pendencias.find((registro) => registro.id === selectedValue) ?? pendencias[0];
  }

  private montarRotuloRegistroPendente(registro: IrregularidadeResumo): string {
    const numero = registro.numeroIrregularidade
      ? `#${registro.numeroIrregularidade}`
      : registro.id.slice(0, 8);
    const data = this.formatarDataHoraRegistro(registro.atualizadoEm);
    const vistoriador = registro.vistoriadorNome?.trim() || 'Não informado';
    return `${numero} • ${data} • ${vistoriador}`;
  }

  private formatarDataHoraRegistro(value?: string): string {
    const date = this.parseDataRegistro(value);
    if (!date) {
      return '-';
    }
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  private parseDataRegistro(value?: string): Date | null {
    if (!value) {
      return null;
    }
    const isoDate = new Date(value);
    if (!Number.isNaN(isoDate.getTime())) {
      return isoDate;
    }
    const match = value.match(
      /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/,
    );
    if (!match) {
      return null;
    }
    const [, year, month, day, hour, minute, second] = match;
    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second ?? 0),
    );
  }

  private async carregarMidiasDoRegistro(
    irregularidade: IrregularidadeResumo,
  ): Promise<RegistroMidiasCarregadas> {
    const irregularidadeId = irregularidade.id;
    const cached = this.cacheMidiasRegistros.get(irregularidadeId);
    if (cached) {
      return cached;
    }

    const vistoriaId = irregularidade.idvistoria ?? this.flowService.getVistoriaId();
    if (!vistoriaId) {
      return { fotos: [], audios: [] };
    }

    const [imagensResumo, audiosResumo] = await Promise.all([
      this.vistoriaService.listarIrregularidadesImagens(vistoriaId, irregularidadeId),
      this.vistoriaService.listarIrregularidadesAudios(vistoriaId, irregularidadeId),
    ]);

    const imagensItem = imagensResumo.find((i) => i.idirregularidade === irregularidadeId);
    const audiosItem = audiosResumo.find((a) => a.idirregularidade === irregularidadeId);

    const resultado: RegistroMidiasCarregadas = {
      fotos: (imagensItem?.imagens ?? []).map((img) => ({
        nomeArquivo: img.nomeArquivo,
        tamanho: Number(img.tamanho) || 0,
        dadosBase64: img.dadosBase64,
      })),
      audios: (audiosItem?.audios ?? []).map((audio) => ({
        id: audio.id,
        nomeArquivo: audio.nomeArquivo,
        base64: audio.dadosBase64,
        mimeType: audio.mimeType || 'audio/m4a',
        previewUrl: undefined,
        durationMs: audio.duracaoMs ?? undefined,
      })),
    };

    this.cacheMidiasRegistros.set(irregularidadeId, resultado);
    return resultado;
  }

  private async precarregarMidiasRegistrosExistentes(): Promise<void> {
    const registros = [...this.irregularidadesDaVistoria, ...this.pendentesParaComponente];
    if (registros.length === 0) {
      return;
    }
    await Promise.all(
      registros.map((irregularidade) =>
        this.carregarMidiasDoRegistro(irregularidade).catch(() => ({
          fotos: [],
          audios: [],
        })),
      ),
    );
  }


  async adicionarFoto(): Promise<void> {
    const photo = await Camera.getPhoto({
      quality: 60,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      allowEditing: false,
      width: 1024,
      height: 1024,
      correctOrientation: true,
    });

    if (!photo.base64String) {
      return;
    }

    const base64 = photo.base64String;
    const imageIndex = this.fotos.length + 1;
    const nomeArquivo = `img${imageIndex}.jpg`;
    const tamanho = this.estimateBase64Size(base64);

    this.fotos.push({
      nomeArquivo,
      tamanho,
      dadosBase64: base64,
    });
  }

  removerFoto(index: number): void {
    void this.confirmarRemocaoMidia('foto', () => {
      this.fotos.splice(index, 1);
    });
  }

  async abrirGravacaoAudio(): Promise<void> {
    if (this.gravandoAudio || this.gravacaoPreparando) {
      return;
    }
    this.errorMessage = '';
    this.gravacaoPreparando = true;
    this.exibirModalGravacaoAudio = true;
    this.cdr.detectChanges();
    await this.agendarReflowUI();
    try {
      const permission = await VoiceRecorder.hasAudioRecordingPermission();
      if (!permission.value) {
        const request = await VoiceRecorder.requestAudioRecordingPermission();
        if (!request.value) {
          this.errorMessage = 'Permissão de áudio negada.';
          this.fecharFluxoGravacaoSemSalvar();
          return;
        }
      }
      await VoiceRecorder.startRecording();
      this.gravacaoPreparando = false;
      this.gravandoAudio = true;
      this.iniciarContadorGravacao();
      this.cdr.detectChanges();
    } catch {
      this.errorMessage = 'Não foi possível iniciar a gravação.';
      this.fecharFluxoGravacaoSemSalvar();
    }
  }

  async finalizarGravacaoModal(): Promise<void> {
    if (this.gravacaoPreparando) {
      return;
    }
    if (!this.gravandoAudio) {
      this.exibirModalGravacaoAudio = false;
      return;
    }
    try {
      const result = await VoiceRecorder.stopRecording();
      if (result.value?.recordDataBase64) {
        const audioIndex = this.audios.length + 1;
        const nomeArquivo = `audio${audioIndex}.m4a`;
        const mime = result.value.mimeType ?? 'audio/m4a';
        this.audios.push({
          nomeArquivo,
          base64: result.value.recordDataBase64,
          mimeType: mime,
          previewUrl: this.criarPreviewAudioBlobUrl(result.value.recordDataBase64, mime),
          durationMs: result.value.msDuration,
        });
      } else {
        this.errorMessage = 'Não foi possível obter o áudio gravado.';
      }
      this.audioBase64 = undefined;
      this.audioMimeType = undefined;
      this.audioDurationMs = undefined;
    } catch {
      this.errorMessage = 'Não foi possível finalizar a gravação.';
    } finally {
      this.gravandoAudio = false;
      this.gravacaoPreparando = false;
      this.exibirModalGravacaoAudio = false;
      this.pararContadorGravacao();
      this.cdr.detectChanges();
    }
  }

  async descartarGravacaoModal(): Promise<void> {
    if (this.gravacaoPreparando) {
      return;
    }
    const alert = await this.alertController.create({
      header: 'Descartar gravação?',
      message: 'O áudio em andamento não será salvo.',
      buttons: [
        { text: 'Continuar gravando', role: 'cancel' },
        { text: 'Descartar', role: 'confirm' },
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    if (role !== 'confirm') {
      return;
    }
    try {
      await VoiceRecorder.stopRecording();
    } catch {
      /* gravação já interrompida ou erro do driver */
    }
    this.audioBase64 = undefined;
    this.audioMimeType = undefined;
    this.audioDurationMs = undefined;
    this.gravandoAudio = false;
    this.gravacaoPreparando = false;
    this.exibirModalGravacaoAudio = false;
    this.pararContadorGravacao();
    this.cdr.detectChanges();
  }

  limparAudio(): void {
    this.audioBase64 = undefined;
    this.audioMimeType = undefined;
    this.audioDurationMs = undefined;
  }

  removerAudio(index: number): void {
    void this.confirmarRemocaoMidia('audio', () => {
      const previewUrl = this.audios[index]?.previewUrl;
      this.revogarPreviewAudio(previewUrl);
      this.audios.splice(index, 1);
    });
  }

  private async confirmarRemocaoMidia(tipo: 'foto' | 'audio', onConfirm: () => void): Promise<void> {
    const label = tipo === 'foto' ? 'foto' : 'áudio';
    const alert = await this.alertController.create({
      header: `Excluir ${label}?`,
      message: `Deseja realmente excluir este ${label} da irregularidade?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          role: 'confirm',
          cssClass: 'danger',
        },
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    if (role === 'confirm') {
      onConfirm();
    }
  }

  private temDadosNaoSalvos(): boolean {
    return this.fotos.length > 0 || this.audios.length > 0 || (this.observacao?.trim()?.length ?? 0) > 0;
  }

  private async confirmarPerdaAlteracoes(): Promise<boolean> {
    const alert = await this.alertController.create({
      header: 'Descartar alterações?',
      message: 'Você pode perder as alterações não salvas desta irregularidade.',
      buttons: [
        { text: 'Continuar editando', role: 'cancel' },
        { text: 'Descartar', role: 'confirm' },
      ],
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    return result.role === 'confirm';
  }

  async salvarIrregularidade(): Promise<void> {
    const vistoriaId = this.flowService.getVistoriaId();
    if (!vistoriaId || !this.selectedMatriz) {
      this.errorMessage = 'Selecione um sintoma.';
      return;
    }

    if (this.selectedMatriz.exigeFoto && this.fotos.length === 0) {
      this.errorMessage = 'Foto obrigatória para este sintoma.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    try {
      if (!(await this.validarSemGravacaoAtiva('salvar'))) {
        return;
      }

      let irregularidadeId = this.irregularidadeEmEdicaoId;
      let numeroIrregularidade = this.irregularidadeEmEdicaoNumero;
      if (irregularidadeId) {
        await this.vistoriaService.atualizarIrregularidade(irregularidadeId, {
          observacao: this.observacao?.trim() ?? '',
        });
      } else {
        const irregularidade = await this.vistoriaService.criarIrregularidade(vistoriaId, {
          idarea: this.areaId,
          idcomponente: this.componenteId,
          idsintoma: this.selectedMatriz.idSintoma,
          observacao: this.observacao?.trim() || undefined,
        });
        irregularidadeId = irregularidade.id;
        numeroIrregularidade = irregularidade.numeroIrregularidade ?? null;
      }

      if (!numeroIrregularidade) {
        const irregularidades = await this.vistoriaService.listarIrregularidades(vistoriaId);
        numeroIrregularidade =
          irregularidades.find((item) => item.id === irregularidadeId)?.numeroIrregularidade ?? null;
      }
      if (!numeroIrregularidade) {
        this.errorMessage = 'Nao foi possivel obter o numero da irregularidade para nomear as midias.';
        return;
      }

      if (this.fotos.length > 0) {
        const files = this.fotos.map((foto, index) => ({
          nomeArquivo: `${numeroIrregularidade}_img${index + 1}.jpg`,
          blob: this.base64ToBlob(foto.dadosBase64),
        }));
        await this.vistoriaService.uploadIrregularidadeImagens(irregularidadeId, files);
      }

      if (this.selectedMatriz.permiteAudio) {
        await this.vistoriaService.removerAudiosIrregularidade(irregularidadeId);
        for (let i = 0; i < this.audios.length; i++) {
          const a = this.audios[i];
          const blob = this.base64ToBlob(a.base64, a.mimeType);
          await this.vistoriaService.uploadIrregularidadeAudio(
            irregularidadeId,
            blob,
            `${numeroIrregularidade}_audio${i + 1}.m4a`,
            a.durationMs,
          );
        }
      }

      this.bootstrapService.invalidate(vistoriaId);
      this.router.navigate(['/vistoria/areas'], {
        state: {
          reopenAreaId: this.areaId,
          reopenAreaNome: this.areaNome,
        },
        replaceUrl: true, // evita voltar para este formulário (já enviado) e travar
      });
    } catch (error: any) {
      this.errorMessage = this.errorMessageService.fromApi(
        error,
        'Erro ao salvar irregularidade. Tente novamente.',
      );
    } finally {
      this.saving = false;
    }
  }

  private estimateBase64Size(base64: string): number {
    const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
    return Math.floor((base64.length * 3) / 4) - padding;
  }

  private async validarSemGravacaoAtiva(acao: 'salvar' | 'voltar'): Promise<boolean> {
    if (!this.gravandoAudio && !this.gravacaoPreparando) {
      return true;
    }
    const alert = await this.alertController.create({
      header: 'Gravacao em andamento',
      message: this.gravacaoPreparando
        ? 'Aguarde o microfone iniciar no modal de gravação.'
        : acao === 'salvar'
          ? 'Para salvar, finalize o áudio no modal (Parar e salvar).'
          : 'Para voltar, finalize o áudio no modal (Parar e salvar ou Descartar).',
      backdropDismiss: false,
      buttons: [{ text: 'Entendi', role: 'confirm' }],
    });
    await alert.present();
    await alert.onDidDismiss();
    return false;
  }

  private fecharFluxoGravacaoSemSalvar(): void {
    this.gravacaoPreparando = false;
    this.gravandoAudio = false;
    this.exibirModalGravacaoAudio = false;
    this.pararContadorGravacao();
    this.cdr.detectChanges();
  }

  private agendarReflowUI(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 0);
    });
  }

  private async carregarIrregularidadeExistente(item: MatrizCriticidade): Promise<void> {
    this.irregularidadeEmEdicaoId = null;
    this.irregularidadeEmEdicaoNumero = null;
    this.observacao = '';
    this.fotos = [];
    this.revogarTodosPreviewsAudio();
    this.audios = [];
    this.audiosExistentesCount = 0;

    const existente = this.irregularidadesDaVistoria.find(
      (ir) => ir.idsintoma === item.idSintoma,
    );
    if (!existente) return;

    this.irregularidadeEmEdicaoId = existente.id;
    this.irregularidadeEmEdicaoNumero = existente.numeroIrregularidade ?? null;
    this.observacao = existente.observacao ?? '';

    const vistoriaId = this.flowService.getVistoriaId();
    if (!vistoriaId) return;

    const [imagensResumo, audiosResumo] = await Promise.all([
      this.vistoriaService.listarIrregularidadesImagens(vistoriaId, existente.id),
      this.vistoriaService.listarIrregularidadesAudios(vistoriaId, existente.id),
    ]);
    this.preencherImagensExistentes(imagensResumo, existente.id);
    this.preencherAudiosExistentes(audiosResumo, existente.id);
  }

  private preencherImagensExistentes(
    imagensResumo: IrregularidadeImagemResumo[],
    irregularidadeId: string,
  ): void {
    const item = imagensResumo.find((i) => i.idirregularidade === irregularidadeId);
    const imagens = item?.imagens ?? [];
    this.fotos = imagens.map((img) => {
      return {
        nomeArquivo: img.nomeArquivo,
        tamanho: Number(img.tamanho) || 0,
        dadosBase64: img.dadosBase64,
      };
    });
  }

  private preencherAudiosExistentes(
    audiosResumo: IrregularidadeAudioResumo[],
    irregularidadeId: string,
  ): void {
    this.revogarTodosPreviewsAudio();
    const item = audiosResumo.find((a) => a.idirregularidade === irregularidadeId);
    const audios = item?.audios ?? [];
    this.audios = audios.map((audio) => ({
      id: audio.id,
      nomeArquivo: audio.nomeArquivo,
      base64: audio.dadosBase64,
      mimeType: audio.mimeType || 'audio/m4a',
      previewUrl: this.criarPreviewAudioBlobUrl(audio.dadosBase64, audio.mimeType || 'audio/m4a'),
      durationMs: audio.duracaoMs ?? undefined,
    }));
    this.audiosExistentesCount = this.audios.length;
  }

  private getMimeTypeFromFilename(nomeArquivo: string): string {
    const ext = (nomeArquivo.split('.').pop() || '').toLowerCase();
    if (ext === 'png') return 'image/png';
    if (ext === 'webp') return 'image/webp';
    if (ext === 'gif') return 'image/gif';
    return 'image/jpeg';
  }

  private iniciarContadorGravacao(): void {
    this.pararContadorGravacao();
    this.tempoGravacaoSegundos = 0;
    this.audioTimerId = setInterval(() => {
      this.tempoGravacaoSegundos += 1;
    }, 1000);
  }

  private pararContadorGravacao(): void {
    if (this.audioTimerId) {
      clearInterval(this.audioTimerId);
      this.audioTimerId = null;
    }
    this.tempoGravacaoSegundos = 0;
  }

  private base64ToBlob(base64: string, mimeType = 'application/octet-stream'): Blob {
    const byteString = atob(base64);
    const bytes = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i += 1) {
      bytes[i] = byteString.charCodeAt(i);
    }
    return new Blob([bytes], { type: mimeType });
  }

  private criarPreviewAudioBlobUrl(base64: string, mimeType: string): string {
    const blob = this.base64ToBlob(base64, mimeType || 'audio/m4a');
    const url = URL.createObjectURL(blob);
    this.audioObjectUrls.add(url);
    return url;
  }

  private revogarPreviewAudio(url?: string): void {
    if (!url) return;
    URL.revokeObjectURL(url);
    this.audioObjectUrls.delete(url);
  }

  private revogarTodosPreviewsAudio(): void {
    for (const url of this.audioObjectUrls) {
      URL.revokeObjectURL(url);
    }
    this.audioObjectUrls.clear();
  }

  private revogarPreviewsRegistroVisualizacao(): void {
    for (const url of this.registroPreviewAudioUrls) {
      this.revogarPreviewAudio(url);
    }
    this.registroPreviewAudioUrls.clear();
  }

  private limparMidiasEmMemoria(): void {
    this.observacao = '';
    this.fotos = [];
    this.revogarTodosPreviewsAudio();
    this.audios = [];
    this.audiosExistentesCount = 0;
    this.audioBase64 = undefined;
    this.audioMimeType = undefined;
    this.audioDurationMs = undefined;
    this.registroVisualizacao = null;
    this.exibirRegistroVisualizacao = false;
    this.revogarPreviewsRegistroVisualizacao();
    this.cacheMidiasRegistros.clear();
    this.pararContadorGravacao();
  }

  fecharVisualizacaoRegistro(): void {
    this.exibirRegistroVisualizacao = false;
    this.registroVisualizacao = null;
    this.revogarPreviewsRegistroVisualizacao();
    this.fecharPreviewImagemRegistro();
  }

  abrirPreviewImagemRegistro(src: string, nomeArquivo: string): void {
    this.previewImagemRegistroSrc = src;
    this.previewImagemRegistroNome = nomeArquivo;
  }

  fecharPreviewImagemRegistro(): void {
    this.previewImagemRegistroSrc = null;
    this.previewImagemRegistroNome = null;
  }

  private aplicarBootstrap(bootstrap: VistoriaBootstrap): boolean {
    const area = bootstrap.areas?.find((a) => a.id === this.areaId);
    const componente = area?.componentes?.find((c) => c.idComponente === this.componenteId);
    if (!area || !componente) {
      return false;
    }

    this.areaNome = area.nome || this.areaNome;
    this.componenteNome = componente.componente?.nome || this.componenteNome;
    this.matriz = componente.matriz ?? [];
    this.pendentesParaComponente = (bootstrap.pendentesVeiculo ?? []).filter(
      (p) => p.idcomponente === this.componenteId,
    );
    this.irregularidadesDaVistoria = (bootstrap.irregularidadesVistoria ?? []).filter(
      (i) => i.idarea === this.areaId && i.idcomponente === this.componenteId,
    );
    return true;
  }

  private async verificarCapacidadeAudio(): Promise<void> {
    try {
      const canRecord = await VoiceRecorder.canDeviceVoiceRecord();
      this.podeGravarAudio = canRecord.value === true;
    } catch {
      this.podeGravarAudio = false;
    }
  }

  private async recarregarStatusComponente(vistoriaId: string): Promise<void> {
    const veiculoId = this.flowService.getVeiculoId();
    const [irregularidadesRes, pendentesRes] = await Promise.all([
      this.vistoriaService.listarIrregularidades(vistoriaId),
      veiculoId ? this.vistoriaService.listarIrregularidadesPendentes(veiculoId) : Promise.resolve([]),
    ]);

    this.irregularidadesDaVistoria = irregularidadesRes.filter(
      (i) => i.idarea === this.areaId && i.idcomponente === this.componenteId,
    );
    const idsDaVistoriaAtual = new Set(this.irregularidadesDaVistoria.map((item) => item.id));
    this.pendentesParaComponente = pendentesRes.filter(
      (p) => p.idcomponente === this.componenteId && !idsDaVistoriaAtual.has(p.id),
    );
  }

  private escapeHtml(value: string): string {
    return (value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
