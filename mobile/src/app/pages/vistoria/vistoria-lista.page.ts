import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';
import { VistoriaService } from '../../services/vistoria.service';
import { VeiculoService } from '../../services/veiculo.service';
import { MotoristaService } from '../../services/motorista.service';
import { AuthService } from '../../services/auth.service';
import { ErrorMessageService } from '../../services/error-message.service';
import {
  TIPO_VISTORIA_OPCOES,
  TipoVistoria,
  Vistoria,
  rotuloTipoVistoria,
} from '../../models/vistoria.model';
import { Veiculo } from '../../models/veiculo.model';
import { Motorista } from '../../models/motorista.model';

@Component({
  selector: 'app-vistoria-lista',
  standalone: true,
  templateUrl: './vistoria-lista.page.html',
  styleUrls: ['./vistoria-lista.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonText,
    IonCard,
    IonCardContent,
  ],
})
export class VistoriaListaPage implements OnInit, OnDestroy {
  private vistoriaService = inject(VistoriaService);
  private veiculoService = inject(VeiculoService);
  private motoristaService = inject(MotoristaService);
  private authService = inject(AuthService);
  private errorMessageService = inject(ErrorMessageService);

  loading = false;
  errorMessage = '';
  pdfErrorMessage = '';
  gerandoPdfId: string | null = null;

  todas: Vistoria[] = [];
  filtradas: Vistoria[] = [];

  veiculoSearch = '';
  motoristaSearch = '';
  selectedVeiculoId = '';
  selectedMotoristaId = '';
  veiculos: Veiculo[] = [];
  motoristas: Motorista[] = [];
  loadingVeiculos = false;
  loadingMotoristas = false;
  numeroVistoriaFiltro = '';
  erpNumeroFiltro = '';
  tipoFiltro: TipoVistoria | '' = '';
  readonly tipoOpcoes = TIPO_VISTORIA_OPCOES;
  dataInicio = '';
  dataFim = '';

  private veiculoSearchTimeout: ReturnType<typeof setTimeout> | null = null;
  private motoristaSearchTimeout: ReturnType<typeof setTimeout> | null = null;

  async ngOnInit(): Promise<void> {
    await this.carregar();
  }

  ngOnDestroy(): void {
    if (this.veiculoSearchTimeout) {
      clearTimeout(this.veiculoSearchTimeout);
    }
    if (this.motoristaSearchTimeout) {
      clearTimeout(this.motoristaSearchTimeout);
    }
  }

  async carregar(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';
    try {
      this.todas = await this.vistoriaService.listarFinalizadas();
      this.aplicarFiltros();
    } catch (error: unknown) {
      this.errorMessage = this.errorMessageService.fromApi(
        error,
        'Não foi possível carregar as vistorias.',
      );
      this.todas = [];
      this.filtradas = [];
    } finally {
      this.loading = false;
    }
  }

  onBuscarVeiculos(event: CustomEvent): void {
    const value = String(event.detail?.value ?? '');
    this.veiculoSearch = value;
    if (this.selectedVeiculoId) {
      this.selectedVeiculoId = '';
      this.aplicarFiltros();
    }
    if (this.veiculoSearchTimeout) {
      clearTimeout(this.veiculoSearchTimeout);
    }
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      this.veiculos = [];
      this.loadingVeiculos = false;
      return;
    }
    this.loadingVeiculos = true;
    this.veiculoSearchTimeout = setTimeout(() => {
      void this.buscarVeiculos(trimmed);
    }, 350);
  }

  private async buscarVeiculos(query: string): Promise<void> {
    try {
      this.veiculos = await this.veiculoService.searchAtivos(query);
    } catch {
      this.veiculos = [];
    } finally {
      this.loadingVeiculos = false;
    }
  }

  selecionarVeiculo(veiculo: Veiculo): void {
    this.selectedVeiculoId = veiculo.id;
    this.veiculoSearch = `${veiculo.descricao} - ${veiculo.placa}`;
    this.veiculos = [];
    this.aplicarFiltros();
  }

  onBuscarMotoristas(event: CustomEvent): void {
    const value = String(event.detail?.value ?? '');
    this.motoristaSearch = value;
    if (this.selectedMotoristaId) {
      this.selectedMotoristaId = '';
      this.aplicarFiltros();
    }
    if (this.motoristaSearchTimeout) {
      clearTimeout(this.motoristaSearchTimeout);
    }
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      this.motoristas = [];
      this.loadingMotoristas = false;
      return;
    }
    this.loadingMotoristas = true;
    this.motoristaSearchTimeout = setTimeout(() => {
      void this.buscarMotoristas(trimmed);
    }, 350);
  }

  private async buscarMotoristas(query: string): Promise<void> {
    try {
      this.motoristas = await this.motoristaService.searchAtivos(query);
    } catch {
      this.motoristas = [];
    } finally {
      this.loadingMotoristas = false;
    }
  }

  selecionarMotorista(motorista: Motorista): void {
    this.selectedMotoristaId = motorista.id;
    this.motoristaSearch = `${motorista.nome} - ${motorista.matricula}`;
    this.motoristas = [];
    this.aplicarFiltros();
  }

  onFiltroTextoChange(): void {
    this.aplicarFiltros();
  }

  limparFiltros(): void {
    this.veiculoSearch = '';
    this.motoristaSearch = '';
    this.selectedVeiculoId = '';
    this.selectedMotoristaId = '';
    this.veiculos = [];
    this.motoristas = [];
    this.numeroVistoriaFiltro = '';
    this.erpNumeroFiltro = '';
    this.tipoFiltro = '';
    this.dataInicio = '';
    this.dataFim = '';
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    const numeroFiltro = this.somenteDigitos(this.numeroVistoriaFiltro);
    const erpFiltro = this.normalizeText(this.erpNumeroFiltro);

    this.filtradas = this.todas.filter((vistoria) => {
      const matchesVeiculo =
        !this.selectedVeiculoId || vistoria.idVeiculo === this.selectedVeiculoId;
      const matchesMotorista =
        !this.selectedMotoristaId ||
        vistoria.idMotorista === this.selectedMotoristaId;
      const matchesNumero =
        !numeroFiltro ||
        this.somenteDigitos(vistoria.numeroVistoria).includes(numeroFiltro);
      const matchesErp =
        !erpFiltro ||
        this.normalizeText(vistoria.erpNumeroVistoria).includes(erpFiltro);
      const matchesTipo =
        !this.tipoFiltro || (vistoria.tipo ?? 'CORRETIVA') === this.tipoFiltro;
      const matchesData = this.matchesDateRange(
        vistoria.datavistoria,
        this.dataInicio,
        this.dataFim,
      );
      return (
        matchesVeiculo &&
        matchesMotorista &&
        matchesNumero &&
        matchesErp &&
        matchesTipo &&
        matchesData
      );
    });
  }

  formatNumeroVistoria(numero?: number | null): string {
    if (numero == null) {
      return '-';
    }
    return String(numero);
  }

  formatErpNumero(valor?: string | null): string {
    const t = (valor ?? '').trim();
    return t || '-';
  }

  formatTipo(tipo?: TipoVistoria | null): string {
    return rotuloTipoVistoria(tipo);
  }

  formatData(valor?: string | null): string {
    if (!valor) {
      return '-';
    }
    const d = new Date(valor);
    if (Number.isNaN(d.getTime())) {
      return '-';
    }
    return d.toLocaleString('pt-BR');
  }

  veiculoLabel(vistoria: Vistoria): string {
    const desc = vistoria.veiculo?.descricao?.trim();
    const placa = vistoria.veiculo?.placa?.trim();
    if (desc && placa) {
      return `${desc} - ${placa}`;
    }
    return desc || placa || '-';
  }

  motoristaLabel(vistoria: Vistoria): string {
    const nome = vistoria.motorista?.nome?.trim();
    const mat = vistoria.motorista?.matricula?.trim();
    if (nome && mat) {
      return `${nome} - ${mat}`;
    }
    return nome || mat || '-';
  }

  async gerarPdf(vistoria: Vistoria): Promise<void> {
    if (!vistoria?.id || this.gerandoPdfId) {
      return;
    }
    this.gerandoPdfId = vistoria.id;
    this.pdfErrorMessage = '';
    try {
      if (Capacitor.isNativePlatform()) {
        await this.abrirPdfNativo(vistoria);
        return;
      }
      const blob = await this.vistoriaService.baixarPdfVistoria(vistoria.id);
      if (!this.isPdfBlob(blob)) {
        throw new Error('Relatório PDF não disponível neste ambiente.');
      }
      await this.abrirPdfWeb(blob);
    } catch (error: unknown) {
      this.pdfErrorMessage = this.mensagemErroGerarPdf(error);
    } finally {
      this.gerandoPdfId = null;
    }
  }

  private async abrirPdfNativo(vistoria: Vistoria): Promise<void> {
    const token = await this.authService.getAccessToken();
    if (!token) {
      throw new Error('Sessão expirada. Faça login novamente.');
    }
    const fileName = `relatorio-vistoria-${this.sanitizeFilename(
      this.formatNumeroVistoria(vistoria.numeroVistoria),
    )}.pdf`;
    const downloaded = await Filesystem.downloadFile({
      url: this.vistoriaService.montarUrlPdfVistoria(vistoria.id),
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

  private somenteDigitos(value: unknown): string {
    return String(value ?? '').replace(/\D/g, '');
  }

  private normalizeText(value: unknown): string {
    return String(value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  private matchesDateRange(
    dataIso: string | undefined,
    dataInicio?: string,
    dataFim?: string,
  ): boolean {
    if (!dataInicio && !dataFim) {
      return true;
    }
    if (!dataIso) {
      return false;
    }
    const ts = new Date(dataIso).getTime();
    if (Number.isNaN(ts)) {
      return false;
    }
    const start = dataInicio
      ? new Date(dataInicio).setHours(0, 0, 0, 0)
      : null;
    const end = dataFim
      ? new Date(dataFim).setHours(23, 59, 59, 999)
      : null;
    if (start !== null && ts < start) {
      return false;
    }
    if (end !== null && ts > end) {
      return false;
    }
    return true;
  }
}
