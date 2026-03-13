import { Component, OnInit, ViewChild, inject } from '@angular/core';
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
  preview: string;
}

interface AudioIrregularidade {
  nomeArquivo: string;
  base64: string;
  mimeType: string;
  previewUrl: string;
  durationMs?: number;
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
export class VistoriaIrregularidadePage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private matrizService = inject(MatrizCriticidadeService);
  private flowService = inject(VistoriaFlowService);
  private vistoriaService = inject(VistoriaService);
  private bootstrapService = inject(VistoriaBootstrapService);
  private alertController = inject(AlertController);
  private errorMessageService = inject(ErrorMessageService);
  private authService = inject(AuthService);

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
  observacao = '';
  fotos: FotoIrregularidade[] = [];
  audios: AudioIrregularidade[] = [];
  audiosExistentesCount = 0;
  private irregularidadesDaVistoria: IrregularidadeResumo[] = [];
  audioBase64?: string;
  audioMimeType?: string;
  audioDurationMs?: number;
  gravandoAudio = false;
  tempoGravacaoSegundos = 0;
  private audioTimerId: ReturnType<typeof setInterval> | null = null;
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

  constructor() {
    addIcons({
      arrowBack,
      cameraOutline,
      trashOutline,
    });
  }

  async voltar(): Promise<void> {
    if (this.selectedMatriz !== null) {
      if (this.temDadosNaoSalvos()) {
        const confirmarSaida = await this.confirmarPerdaAlteracoes();
        if (!confirmarSaida) {
          return;
        }
      }
      this.selectedMatriz = null;
      this.irregularidadeEmEdicaoId = null;
      this.observacao = '';
      this.fotos = [];
      this.audios = [];
      this.audiosExistentesCount = 0;
    } else {
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
    } catch {
      this.errorMessage = 'Erro ao carregar sintomas.';
    } finally {
      this.loading = false;
      void this.verificarCapacidadeAudio();
    }
  }

  isSintomaSelected(item: MatrizCriticidade): boolean {
    return this.selectedMatriz != null && this.selectedMatriz.id === item.id;
  }

  /** True se já existe irregularidade pendente para este sintoma e a matriz não permite nova. */
  isBloqueadoPorPendente(item: MatrizCriticidade): boolean {
    const jaTemPendenteAnterior = this.temPendenteAnterior(item);
    const jaTemNestaVistoria = this.isIrregularidadeJaRegistrada(item);
    return Boolean(
      jaTemPendenteAnterior &&
      !item.permiteNovaIrregularidadeSeJaExiste &&
      !jaTemNestaVistoria,
    );
  }

  isIrregularidadeJaRegistrada(item: MatrizCriticidade): boolean {
    return this.irregularidadesDaVistoria.some((ir) => ir.idsintoma === item.idSintoma);
  }

  temPendenteAnterior(item: MatrizCriticidade): boolean {
    return this.pendentesParaComponente.some((p) => p.idsintoma === item.idSintoma);
  }

  async selecionarSintoma(item: MatrizCriticidade): Promise<void> {
    if (this.isBloqueadoPorPendente(item)) {
      return;
    }
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
    const vistoriaId = this.flowService.getVistoriaId();
    const veiculoId = this.flowService.getVeiculoId();
    if (!vistoriaId || !veiculoId) {
      return;
    }

    try {
      const [irregularidadesAtual, pendentes] = await Promise.all([
        this.vistoriaService.listarIrregularidades(vistoriaId),
        this.vistoriaService.listarIrregularidadesPendentes(veiculoId),
      ]);
      const idsDaVistoriaAtual = new Set(irregularidadesAtual.map((item) => item.id));
      const pendenciasAnteriores = pendentes.filter((item) => !idsDaVistoriaAtual.has(item.id));
      const detalhes = pendenciasAnteriores.length > 0
        ? pendenciasAnteriores
            .map((item) => {
              const area = item.nomeArea ?? item.idarea ?? 'Area';
              const componente = item.nomeComponente ?? item.idcomponente ?? 'Componente';
              const sintoma = item.descricaoSintoma ?? item.idsintoma ?? 'Sintoma';
              return `- ${this.escapeHtml(area)} - ${this.escapeHtml(componente)} - ${this.escapeHtml(sintoma)}`;
            })
            .join('<br>')
        : '- Nenhuma irregularidade pendente de outras vistorias';

      const alert = await this.alertController.create({
        header: 'Pendencias do veiculo',
        cssClass: 'alert-resumo-vistoria',
        message:
          `<strong>Veiculo:</strong> ${this.escapeHtml(this.veiculoNumero)}<br>` +
          `<strong>Irregularidades pendentes (outras vistorias):</strong> ${pendenciasAnteriores.length}<br><br>` +
          `<strong>Resumo:</strong><br>${detalhes}`,
        buttons: [{ text: 'OK', cssClass: 'alert-ok-voltar' }],
      });
      await alert.present();
    } catch (error: any) {
      this.errorMessage = this.errorMessageService.fromApi(
        error,
        'Nao foi possivel carregar as pendencias do veiculo.',
      );
    }
  }

  async adicionarFoto(): Promise<void> {
    const photo = await Camera.getPhoto({
      quality: 60,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      width: 1024,
      height: 1024,
      correctOrientation: true,
    });

    if (!photo.base64String) {
      return;
    }

    const base64 = photo.base64String;
    const imageIndex = this.fotos.length + 1;
    const nomeArquivo = `${this.buildMidiaBaseName('img', imageIndex)}.jpg`;
    const tamanho = this.estimateBase64Size(base64);

    this.fotos.push({
      nomeArquivo,
      tamanho,
      dadosBase64: base64,
      preview: `data:image/jpeg;base64,${base64}`,
    });
  }

  removerFoto(index: number): void {
    this.fotos.splice(index, 1);
  }

  async iniciarAudio(): Promise<void> {
    try {
      const permission = await VoiceRecorder.hasAudioRecordingPermission();
      if (!permission.value) {
        const request = await VoiceRecorder.requestAudioRecordingPermission();
        if (!request.value) {
          this.errorMessage = 'Permissão de áudio negada.';
          return;
        }
      }
      await VoiceRecorder.startRecording();
      this.gravandoAudio = true;
      this.iniciarContadorGravacao();
    } catch {
      this.errorMessage = 'Não foi possível iniciar a gravação.';
    }
  }

  async pararAudio(): Promise<void> {
    try {
      const result = await VoiceRecorder.stopRecording();
      if (result.value?.recordDataBase64) {
        const audioIndex = this.audios.length + 1;
        const nomeArquivo = `${this.buildMidiaBaseName('audio', audioIndex)}.m4a`;
        this.audios.push({
          nomeArquivo,
          base64: result.value.recordDataBase64,
          mimeType: result.value.mimeType ?? 'audio/m4a',
          previewUrl: `data:${result.value.mimeType ?? 'audio/m4a'};base64,${result.value.recordDataBase64}`,
          durationMs: result.value.msDuration,
        });
      }
      this.audioBase64 = undefined;
      this.audioMimeType = undefined;
      this.audioDurationMs = undefined;
      this.gravandoAudio = false;
      this.pararContadorGravacao();
    } catch {
      this.errorMessage = 'Não foi possível finalizar a gravação.';
      this.gravandoAudio = false;
      this.pararContadorGravacao();
    }
  }

  limparAudio(): void {
    this.audioBase64 = undefined;
    this.audioMimeType = undefined;
    this.audioDurationMs = undefined;
  }

  removerAudio(index: number): void {
    this.audios.splice(index, 1);
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
      let irregularidadeId = this.irregularidadeEmEdicaoId;
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
      }

      if (this.fotos.length > 0) {
        const files = this.fotos.map((foto) => ({
          nomeArquivo: foto.nomeArquivo,
          blob: this.base64ToBlob(foto.dadosBase64),
        }));
        await this.vistoriaService.uploadIrregularidadeImagens(irregularidadeId, files);
      }

      if (this.selectedMatriz.permiteAudio && this.audios.length > 0) {
        for (let i = 0; i < this.audios.length; i++) {
          const a = this.audios[i];
          const blob = this.base64ToBlob(a.base64, a.mimeType);
          await this.vistoriaService.uploadIrregularidadeAudio(
            irregularidadeId,
            blob,
            a.nomeArquivo,
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

  private sanitizeFilename(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9-_]+/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_+|_+$/g, '')
      .toLowerCase();
  }

  private buildMidiaBaseName(tipo: 'img' | 'audio', index: number): string {
    const nrVistoria = this.sanitizeFilename(
      this.flowService.getNumeroVistoriaDisplay() || 'nrvistoria',
    );
    const nrVeiculo = this.sanitizeFilename(
      this.flowService.getVeiculoDescricao() || 'nrveiculo',
    );
    const area = this.sanitizeFilename(this.areaNome || 'area');
    const componente = this.sanitizeFilename(this.componenteNome || 'componente');
    const sintoma = this.sanitizeFilename(
      this.selectedMatriz?.sintoma?.descricao || 'sintoma',
    );
    return `${nrVistoria}_${nrVeiculo}_${area}_${componente}_${sintoma}_${tipo}${index}`;
  }

  private async carregarIrregularidadeExistente(item: MatrizCriticidade): Promise<void> {
    this.irregularidadeEmEdicaoId = null;
    this.observacao = '';
    this.fotos = [];
    this.audios = [];
    this.audiosExistentesCount = 0;

    const existente = this.irregularidadesDaVistoria.find(
      (ir) => ir.idsintoma === item.idSintoma,
    );
    if (!existente) return;

    this.irregularidadeEmEdicaoId = existente.id;
    this.observacao = existente.observacao ?? '';

    const vistoriaId = this.flowService.getVistoriaId();
    if (!vistoriaId) return;

    const [imagensResumo, audiosResumo] = await Promise.all([
      this.vistoriaService.listarIrregularidadesImagens(vistoriaId),
      this.vistoriaService.listarIrregularidadesAudios(vistoriaId),
    ]);
    this.preencherImagensExistentes(imagensResumo, existente.id);
    this.preencherAudiosExistentesCount(audiosResumo, existente.id);
  }

  private preencherImagensExistentes(
    imagensResumo: IrregularidadeImagemResumo[],
    irregularidadeId: string,
  ): void {
    const item = imagensResumo.find((i) => i.idirregularidade === irregularidadeId);
    const imagens = item?.imagens ?? [];
    this.fotos = imagens.map((img) => {
      const mimeType = this.getMimeTypeFromFilename(img.nomeArquivo);
      return {
        nomeArquivo: img.nomeArquivo,
        tamanho: Number(img.tamanho) || 0,
        dadosBase64: img.dadosBase64,
        preview: `data:${mimeType};base64,${img.dadosBase64}`,
      };
    });
  }

  private preencherAudiosExistentesCount(
    audiosResumo: IrregularidadeAudioResumo[],
    irregularidadeId: string,
  ): void {
    const item = audiosResumo.find((a) => a.idirregularidade === irregularidadeId);
    this.audiosExistentesCount = item?.audios?.length ?? 0;
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
