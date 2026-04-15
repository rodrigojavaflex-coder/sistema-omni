import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { VistoriaFlowService } from '../../services/vistoria-flow.service';
import { VistoriaService } from '../../services/vistoria.service';
import { VeiculoService } from '../../services/veiculo.service';
import { ErrorMessageService } from '../../services/error-message.service';
import {
  IrregularidadeAudioResumo,
  IrregularidadeImagemResumo,
  IrregularidadeHistoricoVeiculoItem,
  IrregularidadeHistoricoVeiculoMidia,
} from '../../models/irregularidade.model';
import { Veiculo } from '../../models/veiculo.model';

interface OptionItem {
  id: string;
  nome: string;
}

@Component({
  selector: 'app-vistoria-historico-veiculo',
  standalone: true,
  templateUrl: './vistoria-historico-veiculo.page.html',
  styleUrls: ['./vistoria-historico-veiculo.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonButton,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonText,
  ],
})
export class VistoriaHistoricoVeiculoPage implements OnInit {
  private router = inject(Router);
  private flowService = inject(VistoriaFlowService);
  private vistoriaService = inject(VistoriaService);
  private veiculoService = inject(VeiculoService);
  private errorMessageService = inject(ErrorMessageService);

  loading = false;
  errorMessage = '';
  veiculoDescricao = '-';
  total = 0;
  itens: IrregularidadeHistoricoVeiculoItem[] = [];
  areaOptions: OptionItem[] = [];
  componenteOptions: OptionItem[] = [];
  areaFiltro = '';
  componenteFiltro = '';
  selectedVeiculoId = '';
  openedFromMenu = false;
  veiculoSearch = '';
  veiculos: Veiculo[] = [];
  loadingVeiculos = false;
  imagemSelecionada: { nomeArquivo: string; src: string } | null = null;
  private expandedMidias = new Set<string>();
  private loadingMidias = new Set<string>();
  private loadedMidias = new Set<string>();
  imageScale = 1;
  imageTranslateX = 0;
  imageTranslateY = 0;
  private pinchStartDistance: number | null = null;
  private pinchStartScale = 1;
  private panStartX = 0;
  private panStartY = 0;
  private lastTapTs = 0;
  private initialized = false;

  get itensFiltrados(): IrregularidadeHistoricoVeiculoItem[] {
    return this.itens.filter((item) => {
      const byArea = !this.areaFiltro || item.idarea === this.areaFiltro;
      const byComponente = !this.componenteFiltro || item.idcomponente === this.componenteFiltro;
      return byArea && byComponente;
    });
  }

  async ngOnInit(): Promise<void> {
    await this.syncContextFromNavigation();
    this.initialized = true;
  }

  async ionViewWillEnter(): Promise<void> {
    if (!this.initialized) {
      return;
    }
    await this.syncContextFromNavigation();
  }
  async onBuscarVeiculos(event: CustomEvent): Promise<void> {
    if (!this.openedFromMenu) {
      return;
    }
    const value = (event.detail?.value ?? '').toString();
    this.veiculoSearch = value;
    if (!value.trim()) {
      this.veiculos = [];
      this.limparVeiculoSelecionado();
      return;
    }
    this.loadingVeiculos = true;
    try {
      this.veiculos = await this.veiculoService.searchAtivos(value);
    } catch {
      this.veiculos = [];
    } finally {
      this.loadingVeiculos = false;
    }
  }

  async selecionarVeiculo(veiculo: Veiculo): Promise<void> {
    if (!this.openedFromMenu) {
      return;
    }
    this.selectedVeiculoId = veiculo.id;
    this.veiculoDescricao = veiculo.descricao || '-';
    this.veiculoSearch = `${veiculo.descricao} - ${veiculo.placa}`;
    this.veiculos = [];
    await this.carregar(veiculo.id);
  }

  limparVeiculoSelecionado(): void {
    if (!this.openedFromMenu) {
      return;
    }
    this.resetHistoricoState();
    this.veiculoSearch = '';
    this.veiculos = [];
  }


  voltar(): void {
    this.router.navigate(['/vistoria/areas']);
  }

  onAreaChange(): void {
    if (!this.areaFiltro) {
      this.componenteFiltro = '';
      this.rebuildComponenteOptions();
      return;
    }
    const componentesDaArea = this.itens
      .filter((item) => item.idarea === this.areaFiltro)
      .map((item) => ({ id: item.idcomponente, nome: item.nomeComponente ?? 'Componente' }));
    this.componenteOptions = this.deduplicateOptions(componentesDaArea);
    if (
      this.componenteFiltro &&
      !this.componenteOptions.some((option) => option.id === this.componenteFiltro)
    ) {
      this.componenteFiltro = '';
    }
  }

  formatarData(dateIso?: string): string {
    if (!dateIso) {
      return '-';
    }
    const date = new Date(dateIso);
    if (Number.isNaN(date.getTime())) {
      return '-';
    }
    return date.toLocaleString('pt-BR');
  }

  abrirImagem(midia: IrregularidadeHistoricoVeiculoMidia): void {
    if (!midia.src) {
      return;
    }
    this.resetImageTransform();
    this.imagemSelecionada = {
      nomeArquivo: midia.nomeArquivo,
      src: midia.src,
    };
  }

  fecharImagem(): void {
    this.imagemSelecionada = null;
    this.resetImageTransform();
  }

  get imageTransform(): string {
    return `translate(${this.imageTranslateX}px, ${this.imageTranslateY}px) scale(${this.imageScale})`;
  }

  onImageTouchStart(event: TouchEvent): void {
    if (event.touches.length === 2) {
      this.pinchStartDistance = this.getTouchDistance(event.touches[0], event.touches[1]);
      this.pinchStartScale = this.imageScale;
      return;
    }

    if (event.touches.length === 1 && this.imageScale > 1) {
      const touch = event.touches[0];
      this.panStartX = touch.clientX - this.imageTranslateX;
      this.panStartY = touch.clientY - this.imageTranslateY;
    }

    const now = Date.now();
    if (now - this.lastTapTs < 280) {
      if (this.imageScale === 1) {
        this.imageScale = 2;
      } else {
        this.resetImageTransform();
      }
      this.lastTapTs = 0;
      return;
    }
    this.lastTapTs = now;
  }

  onImageTouchMove(event: TouchEvent): void {
    if (event.touches.length === 2 && this.pinchStartDistance) {
      const currentDistance = this.getTouchDistance(event.touches[0], event.touches[1]);
      const nextScale = this.pinchStartScale * (currentDistance / this.pinchStartDistance);
      this.imageScale = this.clamp(nextScale, 1, 4);
      this.clampTranslation();
      event.preventDefault();
      return;
    }

    if (event.touches.length === 1 && this.imageScale > 1) {
      const touch = event.touches[0];
      this.imageTranslateX = touch.clientX - this.panStartX;
      this.imageTranslateY = touch.clientY - this.panStartY;
      this.clampTranslation();
      event.preventDefault();
    }
  }

  onImageTouchEnd(event: TouchEvent): void {
    if (event.touches.length < 2) {
      this.pinchStartDistance = null;
    }
    if (this.imageScale <= 1) {
      this.imageScale = 1;
      this.imageTranslateX = 0;
      this.imageTranslateY = 0;
      return;
    }

    this.clampTranslation();
  }

  private resetImageTransform(): void {
    this.imageScale = 1;
    this.imageTranslateX = 0;
    this.imageTranslateY = 0;
    this.pinchStartDistance = null;
    this.pinchStartScale = 1;
  }

  private getTouchDistance(t1: Touch, t2: Touch): number {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }

  private clampTranslation(): void {
    if (this.imageScale <= 1) {
      this.imageTranslateX = 0;
      this.imageTranslateY = 0;
      return;
    }

    const maxOffsetX = ((window.innerWidth * this.imageScale) - window.innerWidth) / 2;
    const maxOffsetY = ((window.innerHeight * this.imageScale) - window.innerHeight) / 2;

    this.imageTranslateX = this.clamp(this.imageTranslateX, -maxOffsetX, maxOffsetX);
    this.imageTranslateY = this.clamp(this.imageTranslateY, -maxOffsetY, maxOffsetY);
  }

  formatarDuracao(ms?: number | null): string {
    if (!ms || ms <= 0) {
      return '';
    }
    const totalSegundos = Math.floor(ms / 1000);
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    return `${minutos}:${segundos.toString().padStart(2, '0')}`;
  }

  getImagens(item: IrregularidadeHistoricoVeiculoItem): IrregularidadeHistoricoVeiculoMidia[] {
    return (item.midias ?? []).filter((midia) => midia.tipo === 'imagem');
  }

  getAudios(item: IrregularidadeHistoricoVeiculoItem): IrregularidadeHistoricoVeiculoMidia[] {
    return (item.midias ?? []).filter((midia) => midia.tipo === 'audio');
  }

  getQuantidadeImagens(item: IrregularidadeHistoricoVeiculoItem): number {
    return (item.midias ?? []).filter((midia) => midia.tipo === 'imagem').length;
  }

  getQuantidadeAudios(item: IrregularidadeHistoricoVeiculoItem): number {
    return (item.midias ?? []).filter((midia) => midia.tipo === 'audio').length;
  }

  isMidiaExpanded(irregularidadeId: string): boolean {
    return this.expandedMidias.has(irregularidadeId);
  }

  isMidiaLoading(irregularidadeId: string): boolean {
    return this.loadingMidias.has(irregularidadeId);
  }

  isMidiaLoaded(irregularidadeId: string): boolean {
    return this.loadedMidias.has(irregularidadeId);
  }

  async toggleMidias(item: IrregularidadeHistoricoVeiculoItem): Promise<void> {
    if (this.expandedMidias.has(item.id)) {
      this.expandedMidias.delete(item.id);
      return;
    }
    this.expandedMidias.add(item.id);
    if (!this.loadedMidias.has(item.id)) {
      await this.carregarMidiasIrregularidade(item);
    }
  }

  private async carregar(veiculoId?: string): Promise<void> {
    const targetVeiculoId = veiculoId || this.selectedVeiculoId;
    if (!targetVeiculoId) {
      this.itens = [];
      this.total = 0;
      this.areaOptions = [];
      this.componenteOptions = [];
      return;
    }
    this.areaFiltro = '';
    this.componenteFiltro = '';
    this.loading = true;
    this.errorMessage = '';
    try {
      const response = await this.vistoriaService.listarHistoricoIrregularidadesNaoResolvidas(
        targetVeiculoId,
      );
      this.veiculoDescricao = response.veiculo || this.veiculoDescricao || '-';
      this.total = response.total ?? 0;
      this.itens = response.itens ?? [];
      this.expandedMidias.clear();
      this.loadingMidias.clear();
      this.loadedMidias.clear();
      this.imagemSelecionada = null;

      this.areaOptions = this.deduplicateOptions(
        this.itens.map((item) => ({ id: item.idarea, nome: item.nomeArea ?? 'Área' })),
      );
      this.rebuildComponenteOptions();
    } catch (error: any) {
      this.errorMessage = this.errorMessageService.fromApi(
        error,
        'Nao foi possivel carregar as pendencias do veiculo.',
      );
    } finally {
      this.loading = false;
    }
  }

  private async syncContextFromNavigation(): Promise<void> {
    const navState = (
      this.router.getCurrentNavigation()?.extras?.state ?? history.state ?? {}
    ) as { fromMenu?: boolean };

    const flowVistoriaId = this.flowService.getVistoriaId();
    const flowVeiculoId = this.flowService.getVeiculoId();

    if (navState.fromMenu === true) {
      this.openedFromMenu = true;
    } else if (navState.fromMenu === false) {
      this.openedFromMenu = false;
    } else {
      // Sem state explícito: se existe vistoria em andamento, assume fluxo da vistoria.
      this.openedFromMenu = !flowVistoriaId;
    }

    if (!this.openedFromMenu && flowVeiculoId) {
      this.selectedVeiculoId = flowVeiculoId;
      this.veiculoDescricao = this.flowService.getVeiculoDescricao() || '-';
      this.veiculoSearch = this.veiculoDescricao;
      this.veiculos = [];
      await this.carregar(flowVeiculoId);
      return;
    }

    if (this.openedFromMenu && this.selectedVeiculoId) {
      await this.carregar(this.selectedVeiculoId);
      return;
    }

    if (this.openedFromMenu && !this.selectedVeiculoId) {
      this.resetHistoricoState();
      this.veiculoSearch = '';
      this.veiculos = [];
      return;
    }

    this.resetHistoricoState();
  }

  private resetHistoricoState(): void {
    this.selectedVeiculoId = '';
    this.veiculoDescricao = '-';
    this.total = 0;
    this.itens = [];
    this.areaFiltro = '';
    this.componenteFiltro = '';
    this.areaOptions = [];
    this.componenteOptions = [];
    this.expandedMidias.clear();
    this.loadingMidias.clear();
    this.loadedMidias.clear();
    this.imagemSelecionada = null;
    this.errorMessage = '';
  }

  private async carregarMidiasIrregularidade(item: IrregularidadeHistoricoVeiculoItem): Promise<void> {
    if (this.loadingMidias.has(item.id)) {
      return;
    }
    this.loadingMidias.add(item.id);
    try {
      const [imagensResumo, audiosResumo] = await Promise.all([
        this.vistoriaService.listarIrregularidadesImagens(item.idvistoria, item.id),
        this.vistoriaService.listarIrregularidadesAudios(item.idvistoria, item.id),
      ]);
      this.atualizarMidiasDoItem(item, imagensResumo, audiosResumo);
      this.loadedMidias.add(item.id);
    } catch (error: any) {
      this.errorMessage = this.errorMessageService.fromApi(
        error,
        'Nao foi possivel carregar as midias desta irregularidade.',
      );
    } finally {
      this.loadingMidias.delete(item.id);
    }
  }

  private atualizarMidiasDoItem(
    item: IrregularidadeHistoricoVeiculoItem,
    imagensResumo: IrregularidadeImagemResumo[],
    audiosResumo: IrregularidadeAudioResumo[],
  ): void {
    const imagens = imagensResumo.find((i) => i.idirregularidade === item.id)?.imagens ?? [];
    const audios = audiosResumo.find((a) => a.idirregularidade === item.id)?.audios ?? [];

    const imagensCarregadas: IrregularidadeHistoricoVeiculoMidia[] = imagens.map((img, index) => {
      const existente = (item.midias ?? []).find(
        (m) => m.tipo === 'imagem' && m.nomeArquivo === img.nomeArquivo,
      );
      const mimeType = existente?.mimeType || this.getMimeTypeFromFilename(img.nomeArquivo);
      const dadosBase64 = img.dadosBase64;
      return {
        id: existente?.id || `img-${item.id}-${index}`,
        tipo: 'imagem',
        nomeArquivo: img.nomeArquivo,
        mimeType,
        tamanho: Number(img.tamanho) || 0,
        dadosBase64,
        src: this.buildMidiaSrc(dadosBase64, mimeType),
      };
    });

    const audiosCarregados: IrregularidadeHistoricoVeiculoMidia[] = audios.map((audio, index) => {
      const existente = (item.midias ?? []).find(
        (m) =>
          m.tipo === 'audio' &&
          (m.id === audio.id || m.nomeArquivo === audio.nomeArquivo),
      );
      const mimeType = audio.mimeType || existente?.mimeType || 'audio/m4a';
      const dadosBase64 = audio.dadosBase64;
      return {
        id: audio.id || existente?.id || `audio-${item.id}-${index}`,
        tipo: 'audio',
        nomeArquivo: audio.nomeArquivo,
        mimeType,
        tamanho: existente?.tamanho || 0,
        dadosBase64,
        duracaoMs: audio.duracaoMs ?? existente?.duracaoMs,
        src: this.buildMidiaSrc(dadosBase64, mimeType),
      };
    });

    this.itens = this.itens.map((current) =>
      current.id === item.id
        ? {
            ...current,
            midias: [...imagensCarregadas, ...audiosCarregados],
          }
        : current,
    );
  }

  private buildMidiaSrc(dadosBase64: string, mimeType: string): string {
    return `data:${mimeType};base64,${dadosBase64}`;
  }

  private getMimeTypeFromFilename(nomeArquivo: string): string {
    const ext = (nomeArquivo.split('.').pop() || '').toLowerCase();
    if (ext === 'png') return 'image/png';
    if (ext === 'webp') return 'image/webp';
    if (ext === 'gif') return 'image/gif';
    return 'image/jpeg';
  }

  private rebuildComponenteOptions(): void {
    const source = this.areaFiltro
      ? this.itens.filter((item) => item.idarea === this.areaFiltro)
      : this.itens;
    this.componenteOptions = this.deduplicateOptions(
      source.map((item) => ({ id: item.idcomponente, nome: item.nomeComponente ?? 'Componente' })),
    );
  }

  private deduplicateOptions(items: OptionItem[]): OptionItem[] {
    const map = new Map<string, string>();
    items.forEach((item) => {
      if (!map.has(item.id)) {
        map.set(item.id, item.nome);
      }
    });
    return Array.from(map.entries()).map(([id, nome]) => ({ id, nome }));
  }
}
