import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { AlertController, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  arrowUndoOutline,
  closeOutline,
  eyeOffOutline,
  eyeOutline,
  removeOutline,
  trashOutline,
} from 'ionicons/icons';
import { VistoriaService } from '../../services/vistoria.service';
import {
  MARCACOES_MAX,
  MarcaMapa,
  MarcaMapaInicial,
  MapaAvariaMarca,
  ModeloVeiculoVista,
  VistaMarcacaoApi,
  formatarLegendaOsMarcas,
  rotuloCirculoMarcacao,
} from '../../models/mapa-avaria.model';

const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const ZOOM_PASSO = 0.5;
const PAN_LIMIAR_PX = 10;
const MARCA_ALTURA_FATOR = 0.22;
const MARCA_MIN_PX = 16;
const MARCA_MAX_PX = 40;

@Component({
  selector: 'app-mapa-avaria',
  standalone: true,
  templateUrl: './mapa-avaria.component.html',
  styleUrls: ['./mapa-avaria.component.scss'],
  imports: [NgIf, NgFor, IonButton, IonIcon],
})
export class MapaAvariaComponent implements OnChanges, OnDestroy {
  private vistoriaService = inject(VistoriaService);
  private alertController = inject(AlertController);

  @Input({ required: true }) modeloId = '';
  @Input() veiculoId = '';
  @Input() marcaInicial: MarcaMapaInicial | null = null;
  @Input() idsCatalogoPermitidos: string[] | null = null;

  @Output() marcaChange = new EventEmitter<MarcaMapa | null>();

  @ViewChild('mapaImg') private mapaImg?: ElementRef<HTMLImageElement>;

  private viewportEl: HTMLElement | null = null;

  @ViewChild('viewport')
  set viewportRef(ref: ElementRef<HTMLElement> | undefined) {
    const next = ref?.nativeElement ?? null;
    if (this.viewportEl === next) {
      return;
    }
    this.unbindViewport();
    this.viewportEl = next;
    if (next) {
      this.bindViewport();
    }
  }

  readonly vistas = signal<ModeloVeiculoVista[]>([]);
  readonly vistaId = signal<string | null>(null);
  readonly imagemUrl = signal<string | null>(null);
  readonly pendentes = signal<MapaAvariaMarca[]>([]);
  readonly mostrarPendentes = signal(true);
  /** Pontos da irregularidade em edição (vermelhos). */
  readonly marcasAtuais = signal<MapaAvariaMarca[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly escala = signal(ZOOM_MIN);
  readonly translateX = signal(0);
  readonly translateY = signal(0);
  readonly alturaImagemPx = signal(80);

  readonly transformCss = computed(
    () =>
      `translate(${this.translateX()}px, ${this.translateY()}px) scale(${this.escala()})`,
  );
  readonly textoEscala = computed(() => `${this.escala().toFixed(1)}x`);
  readonly podeZoomIn = computed(() => this.escala() < ZOOM_MAX - 0.01);
  readonly podeZoomOut = computed(() => this.escala() > ZOOM_MIN + 0.01);
  readonly podeResetarZoom = computed(
    () =>
      this.escala() > ZOOM_MIN + 0.01 ||
      this.translateX() !== 0 ||
      this.translateY() !== 0,
  );
  readonly tamanhoMarcaPx = computed(() =>
    this.clamp(
      Math.round(this.alturaImagemPx() * MARCA_ALTURA_FATOR),
      MARCA_MIN_PX,
      MARCA_MAX_PX,
    ),
  );
  /** Botão X ~45% do diâmetro do ponto, acompanhando o redimensionamento. */
  readonly tamanhoRemovePx = computed(() =>
    this.clamp(Math.round(this.tamanhoMarcaPx() * 0.45), 10, 20),
  );
  readonly transformMarcaPendente = computed(
    () =>
      `translate(-50%, -50%) scale(${1 / Math.max(this.escala(), ZOOM_MIN)})`,
  );
  readonly transformMarcaAtual = computed(() => 'translate(-50%, -50%)');
  readonly textoPendentes = computed(() =>
    this.mostrarPendentes() ? 'Ocultar pendentes' : 'Ver pendentes',
  );
  readonly iconePendentes = computed(() =>
    this.mostrarPendentes() ? 'eye-off-outline' : 'eye-outline',
  );
  /** Índice 1-based da irregularidade em edição no overlay (`1.x`, `2.x`…). */
  readonly indiceOsAtual = signal(1);
  /** Legenda no formato: `OS: 1.1:202637, 1.2:202637 e 2.1:202689`. */
  readonly legendaOsPendentes = computed(() =>
    formatarLegendaOsMarcas([
      ...this.pendentes(),
      ...this.marcasAtuais().filter((m) => !!m.numeroOs),
    ]),
  );
  readonly podeAdicionarMarca = computed(
    () => this.marcasAtuais().length < MARCACOES_MAX,
  );
  readonly textoMarcasAtuais = computed(() => {
    const n = this.marcasAtuais().length;
    if (n === 0) {
      return 'Nenhum ponto marcado';
    }
    return `${n}/${MARCACOES_MAX} ponto(s)`;
  });
  /** Índice do ponto sendo arrastado (dedo/mouse pressionado). */
  readonly indiceArrastando = signal<number | null>(null);
  readonly textoAjudaMapa = computed(() => {
    if (this.indiceArrastando() !== null) {
      return 'Solte o ponto na nova posição.';
    }
    return 'Toque para adicionar. Arraste um ponto vermelho para mover. O X remove o último.';
  });

  private objectUrl: string | null = null;
  private pinchStartDistance: number | null = null;
  private pinchStartScale = ZOOM_MIN;
  private pinchLastMid: { x: number; y: number } | null = null;
  private panStartX = 0;
  private panStartY = 0;
  private pointerMoved = false;
  private skipClick = false;
  private mousePanAtivo = false;
  private dragMoved = false;
  private overlayEl: HTMLElement | null = null;

  private readonly onTouchStartBound = (event: TouchEvent) =>
    this.onTouchStart(event);
  private readonly onTouchMoveBound = (event: TouchEvent) =>
    this.onTouchMove(event);
  private readonly onTouchEndBound = (event: TouchEvent) =>
    this.onTouchEnd(event);
  private readonly onWheelBound = (event: WheelEvent) => this.onWheel(event);

  constructor() {
    addIcons({
      addOutline,
      arrowUndoOutline,
      closeOutline,
      eyeOffOutline,
      eyeOutline,
      removeOutline,
      trashOutline,
    });
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (!this.modeloId) {
      return;
    }
    const modeloMudou = !!changes['modeloId'];
    const filtroMudou =
      !!changes['idsCatalogoPermitidos'] &&
      JSON.stringify(changes['idsCatalogoPermitidos'].previousValue ?? []) !==
        JSON.stringify(changes['idsCatalogoPermitidos'].currentValue ?? []);
    if (modeloMudou || filtroMudou) {
      await this.carregarVistas();
    } else if (changes['veiculoId'] && this.vistaId()) {
      await this.carregarMarcacoes();
    }
    if (changes['marcaInicial'] && this.marcaInicial) {
      this.aplicarMarcaInicial();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.medirImagem();
    this.limitarPan();
  }

  ngOnDestroy(): void {
    this.unbindViewport();
    this.revoke();
  }

  async selecionarVista(id: string): Promise<void> {
    const previa = this.vistaId();
    this.vistaId.set(id);
    this.indiceArrastando.set(null);
    this.dragMoved = false;
    this.resetarZoom();
    await this.carregarImagem();
    await this.carregarMarcacoes();
    // Só permite pontos na mesma vista; troca limpa se não for a vista inicial.
    if (previa && previa !== id && this.marcaInicial?.idVista !== id) {
      this.marcasAtuais.set([]);
      this.marcaChange.emit(null);
    } else {
      this.aplicarMarcaInicial();
    }
  }

  alternarPendentes(): void {
    this.mostrarPendentes.update((v) => !v);
  }

  zoomIn(): void {
    this.aplicarEscala(this.escala() + ZOOM_PASSO, this.centroViewport());
  }

  zoomOut(): void {
    this.aplicarEscala(this.escala() - ZOOM_PASSO, this.centroViewport());
  }

  resetarZoom(): void {
    this.escala.set(ZOOM_MIN);
    this.translateX.set(0);
    this.translateY.set(0);
  }

  onImagemCarregada(): void {
    this.medirImagem();
  }

  onToqueMapa(event: MouseEvent): void {
    if (this.skipClick || this.indiceArrastando() !== null) {
      this.skipClick = false;
      return;
    }
    const alvo = event.currentTarget as HTMLElement;
    const rect = alvo.getBoundingClientRect();
    const vistaId = this.vistaId();
    if (rect.width <= 0 || rect.height <= 0 || !vistaId) {
      return;
    }
    if (!this.podeAdicionarMarca()) {
      return;
    }
    const posXPct = this.limitar(((event.clientX - rect.left) / rect.width) * 100);
    const posYPct = this.limitar(((event.clientY - rect.top) / rect.height) * 100);
    const next = [
      ...this.marcasAtuais(),
      {
        xPct: posXPct,
        yPct: posYPct,
        rotulo: rotuloCirculoMarcacao(
          this.indiceOsAtual(),
          this.marcasAtuais().length,
        ),
      },
    ];
    this.marcasAtuais.set(next);
    this.emitirMarcas();
  }

  onMarcaPointerDown(index: number, event: PointerEvent): void {
    if (event.button !== undefined && event.button !== 0) {
      return;
    }
    event.stopPropagation();
    event.preventDefault();
    const alvo = event.currentTarget as HTMLElement;
    this.overlayEl = alvo.parentElement;
    try {
      alvo.setPointerCapture(event.pointerId);
    } catch {
      // Alguns WebViews podem falhar no capture; o move ainda chega no elemento
    }
    this.indiceArrastando.set(index);
    this.dragMoved = false;
    this.skipClick = true;
    this.mousePanAtivo = false;
    this.atualizarPosicaoPorClient(index, event.clientX, event.clientY, false);
  }

  onMarcaPointerMove(index: number, event: PointerEvent): void {
    if (this.indiceArrastando() !== index) {
      return;
    }
    event.stopPropagation();
    event.preventDefault();
    this.dragMoved = true;
    this.atualizarPosicaoPorClient(index, event.clientX, event.clientY, false);
  }

  onMarcaPointerUp(index: number, event: PointerEvent): void {
    if (this.indiceArrastando() !== index) {
      return;
    }
    event.stopPropagation();
    event.preventDefault();
    const alvo = event.currentTarget as HTMLElement;
    try {
      if (alvo.hasPointerCapture?.(event.pointerId)) {
        alvo.releasePointerCapture(event.pointerId);
      }
    } catch {
      // ignore
    }
    if (this.dragMoved) {
      this.atualizarPosicaoPorClient(index, event.clientX, event.clientY, true);
    }
    this.indiceArrastando.set(null);
    this.dragMoved = false;
    this.overlayEl = null;
    this.skipClick = true;
  }

  onRemoverUltimaClick(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.desfazerUltimaMarca();
  }

  desfazerUltimaMarca(): void {
    const atuais = this.marcasAtuais();
    if (atuais.length === 0) {
      return;
    }
    const arrastando = this.indiceArrastando();
    if (arrastando !== null && arrastando >= atuais.length - 1) {
      this.indiceArrastando.set(null);
    }
    const restantes = atuais.slice(0, -1).map((marca, ordem) => ({
      ...marca,
      rotulo: rotuloCirculoMarcacao(this.indiceOsAtual(), ordem),
    }));
    this.marcasAtuais.set(restantes);
    this.emitirMarcas();
  }

  private atualizarPosicaoPorClient(
    index: number,
    clientX: number,
    clientY: number,
    emitir: boolean,
  ): void {
    const overlay = this.overlayEl;
    if (!overlay) {
      return;
    }
    const rect = overlay.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
      return;
    }
    const posXPct = this.limitar(((clientX - rect.left) / rect.width) * 100);
    const posYPct = this.limitar(((clientY - rect.top) / rect.height) * 100);
    this.atualizarPosicaoMarca(index, posXPct, posYPct, emitir);
  }

  private atualizarPosicaoMarca(
    index: number,
    posXPct: number,
    posYPct: number,
    emitir = true,
  ): void {
    const atuais = [...this.marcasAtuais()];
    if (index < 0 || index >= atuais.length) {
      return;
    }
    atuais[index] = {
      ...atuais[index],
      xPct: posXPct,
      yPct: posYPct,
    };
    this.marcasAtuais.set(atuais);
    if (emitir) {
      this.emitirMarcas();
    }
  }

  async limparMarcas(): Promise<void> {
    if (this.marcasAtuais().length === 0) {
      return;
    }
    const alert = await this.alertController.create({
      header: 'Limpar pontos',
      message: 'Remover todos os pontos marcados nesta vista?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Limpar', role: 'confirm' },
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    if (role !== 'confirm') {
      return;
    }
    this.indiceArrastando.set(null);
    this.marcasAtuais.set([]);
    this.marcaChange.emit(null);
  }

  private emitirMarcas(): void {
    const vistaId = this.vistaId();
    const pontos = this.marcasAtuais();
    if (!vistaId || pontos.length === 0) {
      this.marcaChange.emit(null);
      return;
    }
    this.marcaChange.emit({
      idVista: vistaId,
      pontos: pontos.map((p) => ({ posXPct: p.xPct, posYPct: p.yPct })),
    });
  }

  onMouseDown(event: MouseEvent): void {
    if (
      event.button !== 0 ||
      this.escala() <= ZOOM_MIN ||
      this.indiceArrastando() !== null
    ) {
      return;
    }
    this.mousePanAtivo = true;
    this.pointerMoved = false;
    this.panStartX = event.clientX - this.translateX();
    this.panStartY = event.clientY - this.translateY();
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.mousePanAtivo) {
      return;
    }
    const nextX = event.clientX - this.panStartX;
    const nextY = event.clientY - this.panStartY;
    if (
      Math.abs(nextX - this.translateX()) > PAN_LIMIAR_PX ||
      Math.abs(nextY - this.translateY()) > PAN_LIMIAR_PX
    ) {
      this.pointerMoved = true;
    }
    this.translateX.set(nextX);
    this.translateY.set(nextY);
    this.limitarPan();
  }

  onMouseUp(): void {
    if (this.mousePanAtivo && this.pointerMoved) {
      this.skipClick = true;
    }
    this.mousePanAtivo = false;
  }

  private async carregarVistas(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      const vistas = await this.vistoriaService.listarVistasModelo(this.modeloId, true);
      const filtradas = this.filtrarVistasPermitidas(vistas);
      this.vistas.set(filtradas);
      const preferida = this.marcaInicial?.idVista;
      const inicial = filtradas.find((v) => v.id === preferida)?.id ?? filtradas[0]?.id ?? null;
      if (!inicial) {
        this.error.set(
          filtradas.length === 0 && vistas.length > 0
            ? 'Nenhuma vista deste veículo corresponde às selecionadas na matriz.'
            : 'Este modelo não tem desenho cadastrado. Cadastre ao menos uma vista no modelo do veículo para sintomas que exigem localização.',
        );
        this.marcaChange.emit(null);
        return;
      }
      await this.selecionarVista(inicial);
    } catch {
      this.error.set('Não foi possível carregar as vistas do modelo.');
    } finally {
      this.loading.set(false);
    }
  }

  private filtrarVistasPermitidas(vistas: ModeloVeiculoVista[]): ModeloVeiculoVista[] {
    const permitidas = new Set((this.idsCatalogoPermitidos ?? []).filter(Boolean));
    if (permitidas.size === 0) {
      return vistas;
    }
    const filtradas = vistas.filter((vista) => permitidas.has(vista.idCatalogo));
    const inicialId = this.marcaInicial?.idVista;
    if (inicialId && !filtradas.some((vista) => vista.id === inicialId)) {
      const extra = vistas.find((vista) => vista.id === inicialId);
      if (extra) {
        return [extra, ...filtradas];
      }
    }
    return filtradas;
  }

  private async carregarImagem(): Promise<void> {
    const vistaId = this.vistaId();
    if (!vistaId) {
      return;
    }
    this.revoke();
    try {
      const blob = await this.vistoriaService.obterImagemVista(this.modeloId, vistaId);
      this.objectUrl = URL.createObjectURL(blob);
      this.imagemUrl.set(this.objectUrl);
    } catch {
      this.imagemUrl.set(null);
      this.error.set('Não foi possível carregar o desenho desta vista do modelo.');
    }
  }

  private async carregarMarcacoes(): Promise<void> {
    const vistaId = this.vistaId();
    if (!this.veiculoId || !vistaId) {
      this.pendentes.set([]);
      this.indiceOsAtual.set(1);
      this.relabelMarcasAtuais();
      return;
    }
    try {
      const itens = await this.vistoriaService.listarMarcacoesVista(
        this.veiculoId,
        vistaId,
        true,
      );
      this.aplicarIndicesMarcacoes(itens);
    } catch {
      this.pendentes.set([]);
      this.indiceOsAtual.set(1);
      this.relabelMarcasAtuais();
    }
  }

  /**
   * Índice global por irregularidade na vista (ordem de numeroIrregularidade):
   * 1ª → 1.1/1.2…, 2ª → 2.1/2.2…; a nova em edição usa o próximo índice.
   */
  private aplicarIndicesMarcacoes(itens: VistaMarcacaoApi[]): void {
    const ordenados = itens.slice().sort((a, b) => {
      const byNum =
        (a.numeroIrregularidade ?? 0) - (b.numeroIrregularidade ?? 0);
      if (byNum !== 0) {
        return byNum;
      }
      return (a.ordem ?? 0) - (b.ordem ?? 0);
    });

    const indicePorId = new Map<string, number>();
    let ultimoIndice = 0;
    for (const item of ordenados) {
      if (!indicePorId.has(item.idIrregularidade)) {
        ultimoIndice += 1;
        indicePorId.set(item.idIrregularidade, ultimoIndice);
      }
    }

    this.indiceOsAtual.set(ultimoIndice + 1);

    const pendentes: MapaAvariaMarca[] = ordenados.map((item) => ({
      xPct: item.posXPct,
      yPct: item.posYPct,
      rotulo: rotuloCirculoMarcacao(
        indicePorId.get(item.idIrregularidade) ?? 1,
        item.ordem ?? 0,
      ),
      numeroOs: item.numeroIrregularidade || null,
    }));
    this.pendentes.set(pendentes);
    this.relabelMarcasAtuais();
  }

  private relabelMarcasAtuais(): void {
    const idx = this.indiceOsAtual();
    const atuais = this.marcasAtuais();
    if (atuais.length === 0) {
      return;
    }
    this.marcasAtuais.set(
      atuais.map((marca, ordem) => ({
        ...marca,
        rotulo: rotuloCirculoMarcacao(idx, ordem),
      })),
    );
  }

  private aplicarMarcaInicial(): void {
    const inicial = this.marcaInicial;
    if (!inicial || inicial.idVista !== this.vistaId()) {
      return;
    }
    const pontos =
      inicial.pontos && inicial.pontos.length > 0
        ? inicial.pontos
        : inicial.posXPct !== undefined && inicial.posYPct !== undefined
          ? [{ posXPct: inicial.posXPct, posYPct: inicial.posYPct }]
          : [];
    const idx = this.indiceOsAtual();
    this.marcasAtuais.set(
      pontos.map((p, ordem) => ({
        xPct: p.posXPct,
        yPct: p.posYPct,
        rotulo: rotuloCirculoMarcacao(idx, ordem),
      })),
    );
  }

  private bindViewport(): void {
    const el = this.viewportEl;
    if (!el) {
      return;
    }
    el.addEventListener('touchstart', this.onTouchStartBound, { passive: false });
    el.addEventListener('touchmove', this.onTouchMoveBound, { passive: false });
    el.addEventListener('touchend', this.onTouchEndBound);
    el.addEventListener('touchcancel', this.onTouchEndBound);
    el.addEventListener('wheel', this.onWheelBound, { passive: false });
  }

  private unbindViewport(): void {
    const el = this.viewportEl;
    if (!el) {
      return;
    }
    el.removeEventListener('touchstart', this.onTouchStartBound);
    el.removeEventListener('touchmove', this.onTouchMoveBound);
    el.removeEventListener('touchend', this.onTouchEndBound);
    el.removeEventListener('touchcancel', this.onTouchEndBound);
    el.removeEventListener('wheel', this.onWheelBound);
  }

  private onTouchStart(event: TouchEvent): void {
    if (this.indiceArrastando() !== null) {
      event.preventDefault();
      return;
    }
    this.pointerMoved = false;
    if (event.touches.length === 2) {
      this.skipClick = true;
      this.mousePanAtivo = false;
      this.pinchStartDistance = this.distancia(event.touches[0], event.touches[1]);
      this.pinchStartScale = this.escala();
      this.pinchLastMid = this.pontoMedioViewport(event.touches[0], event.touches[1]);
      event.preventDefault();
      return;
    }
    if (event.touches.length === 1 && this.escala() > ZOOM_MIN) {
      const touch = event.touches[0];
      this.panStartX = touch.clientX - this.translateX();
      this.panStartY = touch.clientY - this.translateY();
    }
  }

  private onTouchMove(event: TouchEvent): void {
    if (this.indiceArrastando() !== null) {
      event.preventDefault();
      return;
    }
    if (event.touches.length === 2 && this.pinchStartDistance) {
      const mid = this.pontoMedioViewport(event.touches[0], event.touches[1]);
      if (this.pinchLastMid) {
        const dx = mid.x - this.pinchLastMid.x;
        const dy = mid.y - this.pinchLastMid.y;
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
          this.pointerMoved = true;
          this.translateX.set(this.translateX() + dx);
          this.translateY.set(this.translateY() + dy);
        }
      }
      this.pinchLastMid = mid;
      const atual = this.distancia(event.touches[0], event.touches[1]);
      const novaEscala =
        this.pinchStartScale * (atual / this.pinchStartDistance);
      this.aplicarEscala(novaEscala, mid);
      event.preventDefault();
      return;
    }
    if (event.touches.length === 1 && this.escala() > ZOOM_MIN) {
      const touch = event.touches[0];
      const nextX = touch.clientX - this.panStartX;
      const nextY = touch.clientY - this.panStartY;
      if (
        Math.abs(nextX - this.translateX()) > PAN_LIMIAR_PX ||
        Math.abs(nextY - this.translateY()) > PAN_LIMIAR_PX
      ) {
        this.pointerMoved = true;
      }
      this.translateX.set(nextX);
      this.translateY.set(nextY);
      this.limitarPan();
      event.preventDefault();
    }
  }

  private onTouchEnd(event: TouchEvent): void {
    if (event.touches.length < 2) {
      this.pinchStartDistance = null;
      this.pinchLastMid = null;
    }
    if (this.pointerMoved) {
      this.skipClick = true;
    }
    if (event.touches.length === 1 && this.escala() > ZOOM_MIN) {
      const touch = event.touches[0];
      this.panStartX = touch.clientX - this.translateX();
      this.panStartY = touch.clientY - this.translateY();
    }
    if (this.escala() <= ZOOM_MIN) {
      this.resetarZoom();
    } else {
      this.limitarPan();
    }
  }

  private onWheel(event: WheelEvent): void {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.2 : 0.2;
    const viewport = this.viewportEl;
    if (!viewport) {
      this.aplicarEscala(this.escala() + delta);
      return;
    }
    const rect = viewport.getBoundingClientRect();
    this.aplicarEscala(this.escala() + delta, {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  }

  private aplicarEscala(
    valor: number,
    foco?: { x: number; y: number },
  ): void {
    const viewport = this.viewportEl;
    const escalaAtual = this.escala();
    const next = Number(this.clamp(valor, ZOOM_MIN, ZOOM_MAX).toFixed(2));
    if (!viewport || next === escalaAtual) {
      this.escala.set(next);
      if (next <= ZOOM_MIN) {
        this.translateX.set(0);
        this.translateY.set(0);
      } else {
        this.limitarPan();
      }
      return;
    }

    const cx = viewport.clientWidth / 2;
    const cy = viewport.clientHeight / 2;
    const midX = foco?.x ?? cx;
    const midY = foco?.y ?? cy;
    const offsetX = midX - cx;
    const offsetY = midY - cy;
    const conteudoX = (offsetX - this.translateX()) / escalaAtual;
    const conteudoY = (offsetY - this.translateY()) / escalaAtual;

    this.escala.set(next);
    if (next <= ZOOM_MIN) {
      this.translateX.set(0);
      this.translateY.set(0);
      return;
    }
    this.translateX.set(offsetX - conteudoX * next);
    this.translateY.set(offsetY - conteudoY * next);
    this.limitarPan();
  }

  private limitarPan(): void {
    const viewport = this.viewportEl;
    if (!viewport || this.escala() <= ZOOM_MIN) {
      this.translateX.set(0);
      this.translateY.set(0);
      return;
    }
    const maxX = (viewport.clientWidth * (this.escala() - 1)) / 2;
    const maxY = (viewport.clientHeight * (this.escala() - 1)) / 2;
    this.translateX.set(this.clamp(this.translateX(), -maxX, maxX));
    this.translateY.set(this.clamp(this.translateY(), -maxY, maxY));
  }

  private centroViewport(): { x: number; y: number } | undefined {
    const viewport = this.viewportEl;
    if (!viewport) {
      return undefined;
    }
    return {
      x: viewport.clientWidth / 2,
      y: viewport.clientHeight / 2,
    };
  }

  private pontoMedioViewport(
    t1: Touch,
    t2: Touch,
  ): { x: number; y: number } {
    const viewport = this.viewportEl;
    if (!viewport) {
      return {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2,
      };
    }
    const rect = viewport.getBoundingClientRect();
    return {
      x: (t1.clientX + t2.clientX) / 2 - rect.left,
      y: (t1.clientY + t2.clientY) / 2 - rect.top,
    };
  }

  private medirImagem(): void {
    requestAnimationFrame(() => {
      const altura = this.mapaImg?.nativeElement.clientHeight ?? 0;
      if (altura > 0) {
        this.alturaImagemPx.set(altura);
      }
    });
  }

  private distancia(t1: Touch, t2: Touch): number {
    return Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }

  private limitar(valor: number): number {
    return Math.min(100, Math.max(0, Number(valor.toFixed(3))));
  }

  private revoke(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }
}
