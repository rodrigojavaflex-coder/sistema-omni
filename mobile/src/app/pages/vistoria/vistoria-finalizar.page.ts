import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonSpinner,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { checkmarkCircle } from 'ionicons/icons';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';
import { VistoriaFlowService } from '../../services/vistoria-flow.service';
import { VistoriaService } from '../../services/vistoria.service';
import { AuthService } from '../../services/auth.service';
import { ErrorMessageService } from '../../services/error-message.service';
import { rotuloPercentualNivel } from '../../models/combustivel.enum';

@Component({
  selector: 'app-vistoria-finalizar',
  standalone: true,
  templateUrl: './vistoria-finalizar.page.html',
  styleUrls: ['./vistoria-finalizar.page.scss'],
  imports: [
    NgIf,
    FormsModule,
    IonContent,
    IonFooter,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonItem,
    IonLabel,
    IonTextarea,
    IonButton,
    IonSpinner,
    IonText,
    IonIcon,
  ],
})
export class VistoriaFinalizarPage implements OnInit {
  private flowService = inject(VistoriaFlowService);
  private vistoriaService = inject(VistoriaService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private errorMessageService = inject(ErrorMessageService);
  observacao = '';
  tempoMinutos = 0;
  isSaving = false;
  loadingResumo = false;
  errorMessage = '';
  resumoVistoriador = '-';
  resumoVeiculo = '-';
  resumoMotorista = '-';
  resumoOdometro = '-';
  resumoRotuloPercentual = '% Bateria';
  resumoBateria = '-';
  resumoIrregularidades = 0;
  resumoIrregularidadesDetalhes: string[] = [];
  sucessoVisivel = false;
  gerandoPdf = false;
  pdfErrorMessage = '';
  vistoriaIdPdf: string | null = null;
  private sucessoResolver: (() => void) | null = null;

  constructor() {
    addIcons({ checkmarkCircle });
  }

  get vistoriaNrDisplay(): string {
    const nr = this.flowService.getNumeroVistoriaDisplay();
    return nr ? `Vistoria - ${nr}` : 'Vistoria';
  }

  get veiculoDisplay(): string {
    const veiculo = this.flowService.getVeiculoDescricao();
    return veiculo ? `Veículo ${veiculo}` : 'Veículo -';
  }

  get resumoVistoriaNumero(): string {
    return this.flowService.getNumeroVistoriaDisplay() || '-';
  }

  get tempoTotalFormatado(): string {
    const totalMinutos = Math.max(0, Number(this.tempoMinutos) || 0);
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
  }

  async ngOnInit(): Promise<void> {
    this.tempoMinutos = this.flowService.getTempoEmMinutos();
    await this.carregarResumo();
  }

  voltar(): void {
    this.router.navigate(['/vistoria/areas']);
  }

  async finalizar(): Promise<void> {
    const vistoriaId = this.flowService.getVistoriaId();
    if (!vistoriaId) {
      this.router.navigate(['/vistoria/inicio']);
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    try {
      await this.vistoriaService.finalizarVistoria(vistoriaId, {
        tempo: this.tempoMinutos,
        observacao: this.observacao?.trim() || undefined,
      });
      this.vistoriaIdPdf = vistoriaId;
      await this.mostrarResumoConclusao();
      this.flowService.finalizar();
      this.router.navigate(['/home']);
    } catch (error: unknown) {
      this.errorMessage = this.errorMessageService.fromApi(
        error,
        'Erro ao finalizar vistoria. Tente novamente.',
      );
    } finally {
      this.isSaving = false;
    }
  }

  async gerarRelatorioPdf(): Promise<void> {
    if (!this.vistoriaIdPdf || this.gerandoPdf) {
      return;
    }
    this.gerandoPdf = true;
    this.pdfErrorMessage = '';
    try {
      if (Capacitor.isNativePlatform()) {
        await this.abrirPdfNativo();
        return;
      }
      const blob = await this.vistoriaService.baixarPdfVistoria(this.vistoriaIdPdf);
      if (!this.isPdfBlob(blob)) {
        throw new Error('Relatório PDF não disponível neste ambiente.');
      }
      await this.abrirPdfWeb(blob);
    } catch (error: unknown) {
      this.pdfErrorMessage = this.mensagemErroGerarPdf(error);
    } finally {
      this.gerandoPdf = false;
    }
  }

  private async abrirPdfNativo(): Promise<void> {
    if (!this.vistoriaIdPdf) {
      return;
    }
    const token = await this.authService.getAccessToken();
    if (!token) {
      throw new Error('Sessão expirada. Faça login novamente.');
    }
    const fileName = `relatorio-vistoria-${this.sanitizeFilename(
      this.resumoVistoriaNumero,
    )}.pdf`;
    const downloaded = await Filesystem.downloadFile({
      url: this.vistoriaService.montarUrlPdfVistoria(this.vistoriaIdPdf),
      path: fileName,
      directory: Directory.Cache,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const filePath = downloaded.path;
    if (!filePath) {
      throw new Error('Não foi possível baixar o relatório PDF.');
    }
    try {
      await FileOpener.open({
        filePath,
        contentType: 'application/pdf',
        openWithDefault: true,
      });
    } catch (error: unknown) {
      throw new Error(this.mensagemErroAbrirPdf(error));
    }
  }

  private async abrirPdfWeb(blob: Blob): Promise<void> {
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank', 'noopener,noreferrer');
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }

  private isPdfBlob(blob: Blob): boolean {
    const tipo = (blob.type || '').toLowerCase();
    return !tipo || tipo.includes('pdf') || tipo === 'application/octet-stream';
  }

  private mensagemErroGerarPdf(error: unknown): string {
    const raw =
      typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message: unknown }).message)
        : String(error ?? '');
    if (/error downloading file/i.test(raw)) {
      return 'Não foi possível baixar o relatório PDF. Tente novamente.';
    }
    const status = Number(
      typeof error === 'object' && error !== null && 'status' in error
        ? (error as { status?: number }).status
        : 0,
    );
    if (status === 404) {
      return 'Relatório PDF não disponível neste ambiente. Verifique se a API está atualizada.';
    }
    if (status === 403) {
      return 'Você não tem permissão para gerar o relatório PDF.';
    }
    return this.errorMessageService.fromApi(
      error,
      'Não foi possível gerar o relatório PDF.',
    );
  }

  private mensagemErroAbrirPdf(error: unknown): string {
    const raw =
      typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message: unknown }).message)
        : String(error ?? '');
    if (/activity not found|no app|unavailable|not found to handle/i.test(raw)) {
      return 'Nenhum aplicativo para abrir PDF está instalado neste dispositivo.';
    }
    if (/error downloading file/i.test(raw)) {
      return 'Não foi possível baixar o relatório PDF. Tente novamente.';
    }
    return this.errorMessageService.fromApi(
      error,
      'Não foi possível abrir o relatório PDF.',
    );
  }

  private sanitizeFilename(value: string): string {
    const cleaned = value.replace(/[<>:"/\\|?*]+/g, '').trim();
    return cleaned.slice(0, 40) || 'vistoria';
  }

  private async carregarResumo(): Promise<void> {
    const vistoriaId = this.flowService.getVistoriaId();
    if (!vistoriaId) return;

    this.loadingResumo = true;
    try {
      const [vistoria, irregularidades] = await Promise.all([
        this.vistoriaService.getById(vistoriaId),
        this.vistoriaService.listarIrregularidades(vistoriaId),
      ]);
      const currentUser = this.authService.getCurrentUser();
      if (vistoria.idUsuario && currentUser?.id === vistoria.idUsuario) {
        this.resumoVistoriador = currentUser.nome ?? vistoria.idUsuario;
      } else {
        this.resumoVistoriador = vistoria.idUsuario ?? '-';
      }
      this.resumoVeiculo = vistoria.veiculo?.descricao ?? '-';
      this.resumoMotorista = vistoria.motorista?.nome ?? '-';
      this.resumoOdometro = vistoria.odometro != null ? `${vistoria.odometro}` : '-';
      this.resumoRotuloPercentual = rotuloPercentualNivel(vistoria.veiculo?.combustivel);
      this.resumoBateria =
        vistoria.porcentagembateria == null ? '-' : `${vistoria.porcentagembateria}%`;
      this.resumoIrregularidades = irregularidades.length;
      this.resumoIrregularidadesDetalhes = irregularidades.map((item) => {
        const area = item.nomeArea ?? item.idarea ?? 'Área';
        const componente = item.nomeComponente ?? item.idcomponente ?? 'Componente';
        const sintoma = item.descricaoSintoma ?? item.idsintoma ?? 'Sintoma';
        return `${area} - ${componente} - ${sintoma}`;
      });
    } finally {
      this.loadingResumo = false;
    }
  }

  private async mostrarResumoConclusao(): Promise<void> {
    this.sucessoVisivel = true;
    this.pdfErrorMessage = '';
    await new Promise<void>((resolve) => {
      this.sucessoResolver = resolve;
    });
  }

  confirmarConclusao(): void {
    if (this.gerandoPdf) {
      return;
    }
    this.sucessoVisivel = false;
    if (this.sucessoResolver) {
      this.sucessoResolver();
      this.sucessoResolver = null;
    }
  }
}
