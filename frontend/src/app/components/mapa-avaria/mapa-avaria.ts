import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
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
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ModeloVeiculoService } from '../../services/modelo-veiculo.service';
import { ModeloVeiculoVista } from '../../models/modelo-veiculo.model';
import {
  formatarLegendaOsMarcas,
  MapaAvariaMarca,
  MARCACOES_MAX,
  rotuloCirculoMarcacao,
  VistaMarcacaoApi,
} from '../../models/mapa-avaria.model';

const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const ZOOM_PASSO = 0.5;
const MARCA_ALTURA_FATOR = 0.22;
const MARCA_MIN_PX = 16;
const MARCA_MAX_PX = 40;

export type MarcaMapaPayload = {
  idVista: string;
  pontos: Array<{ posXPct: number; posYPct: number }>;
};

export type MarcaMapaInicial = {
  idVista: string;
  posXPct?: number;
  posYPct?: number;
  pontos?: Array<{ posXPct: number; posYPct: number }>;
};

@Component({
  selector: 'app-mapa-avaria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa-avaria.html',
  styleUrls: ['./mapa-avaria.css'],
})
export class MapaAvariaComponent implements OnChanges, AfterViewInit, OnDestroy {
  private modeloService = inject(ModeloVeiculoService);

  @Input({ required: true }) modeloId = '';
  @Input() veiculoId = '';
  @Input() somenteAbertas = true;
  @Input() readonly = false;
  @Input() destaqueId: string | null = null;
  @Input() marcaInicial: MarcaMapaInicial | null = null;
  @Input() idsCatalogoPermitidos: string[] | null = null;

  @Output() marcaChange = new EventEmitter<MarcaMapaPayload | null>();

  @ViewChild('viewport') private viewport?: ElementRef<HTMLElement>;
  @ViewChild('mapaImg') private mapaImg?: ElementRef<HTMLImageElement>;

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
  readonly tamanhoMarcaPx = computed(() =>
    Math.min(
      MARCA_MAX_PX,
      Math.max(MARCA_MIN_PX, Math.round(this.alturaImagemPx() * MARCA_ALTURA_FATOR)),
    ),
  );
  /** Botão X ~45% do diâmetro do ponto, acompanhando o redimensionamento. */
  readonly tamanhoRemovePx = computed(() =>
    Math.min(20, Math.max(10, Math.round(this.tamanhoMarcaPx() * 0.45))),
  );
  readonly transformMarca = computed(
    () => `translate(-50%, -50%) scale(${1 / Math.max(this.escala(), ZOOM_MIN)})`,
  );
  readonly textoPendentes = computed(() =>
    this.mostrarPendentes() ? 'Ocultar pendentes' : 'Ver pendentes',
  );
  /** Índice 1-based da irregularidade atual no overlay (`1.x`, `2.x`…). */
  readonly indiceOsAtual = signal(1);
  readonly numeroOsAtual = signal<number | null>(null);
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
  readonly indiceArrastando = signal<number | null>(null);
  readonly textoAjudaMapa = computed(() => {
    if (this.readonly) {
      return 'Vermelho = irregularidade atual. Azul = demais (1ª = 1.1/1.2…, 2ª = 2.1/2.2…).';
    }
    if (this.indiceArrastando() !== null) {
      return 'Solte o ponto na nova posição.';
    }
    return 'Clique para adicionar. Arraste um ponto vermelho para mover. O X remove o último.';
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

  private readonly onTouchStartBound = (event: TouchEvent) => this.onTouchStart(event);
  private readonly onTouchMoveBound = (event: TouchEvent) => this.onTouchMove(event);
  private readonly onTouchEndBound = (event: TouchEvent) => this.onTouchEnd(event);

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
    } else if (
      (changes['veiculoId'] || changes['somenteAbertas'] || changes['destaqueId']) &&
      this.vistaId()
    ) {
      await this.carregarMarcacoes();
    }
    if (changes['marcaInicial'] && this.marcaInicial) {
      this.aplicarMarcaInicial();
    }
  }

  ngAfterViewInit(): void {
    const el = this.viewport?.nativeElement;
    if (!el) {
      return;
    }
    el.addEventListener('touchstart', this.onTouchStartBound, { passive: false });
    el.addEventListener('touchmove', this.onTouchMoveBound, { passive: false });
    el.addEventListener('touchend', this.onTouchEndBound);
    el.addEventListener('touchcancel', this.onTouchEndBound);
  }

  ngOnDestroy(): void {
    const el = this.viewport?.nativeElement;
    if (el) {
      el.removeEventListener('touchstart', this.onTouchStartBound);
      el.removeEventListener('touchmove', this.onTouchMoveBound);
      el.removeEventListener('touchend', this.onTouchEndBound);
      el.removeEventListener('touchcancel', this.onTouchEndBound);
    }
    this.revokeObjectUrl();
  }

  async selecionarVista(id: string): Promise<void> {
    const previa = this.vistaId();
    this.vistaId.set(id);
    this.indiceArrastando.set(null);
    this.dragMoved = false;
    this.resetarZoom();
    await this.carregarImagem();
    await this.carregarMarcacoes();
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
    // Após contain/layout: altura real da imagem (marcas escalam com ela)
    requestAnimationFrame(() => {
      const altura = this.mapaImg?.nativeElement.clientHeight ?? 0;
      if (altura > 0) {
        this.alturaImagemPx.set(altura);
      }
    });
  }

  onToqueMapa(event: MouseEvent): void {
    if (this.readonly || this.skipClick || this.indiceArrastando() !== null) {
      this.skipClick = false;
      return;
    }
    const alvo = event.currentTarget as HTMLElement;
    const rect = alvo.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0 || !this.vistaId()) {
      return;
    }
    if (!this.podeAdicionarMarca()) {
      return;
    }
    const posXPct = this.limitarPercentual(
      ((event.clientX - rect.left) / rect.width) * 100,
    );
    const posYPct = this.limitarPercentual(
      ((event.clientY - rect.top) / rect.height) * 100,
    );
    const next = [
      ...this.marcasAtuais(),
      {
        xPct: posXPct,
        yPct: posYPct,
        rotulo: rotuloCirculoMarcacao(
          this.indiceOsAtual(),
          this.marcasAtuais().length,
        ),
        numeroOs: this.numeroOsAtual(),
      },
    ];
    this.marcasAtuais.set(next);
    this.emitirMarcas();
  }

  onMarcaPointerDown(index: number, event: PointerEvent): void {
    if (this.readonly || (event.button !== undefined && event.button !== 0)) {
      return;
    }
    event.stopPropagation();
    event.preventDefault();
    const alvo = event.currentTarget as HTMLElement;
    this.overlayEl = alvo.parentElement;
    try {
      alvo.setPointerCapture(event.pointerId);
    } catch {
      // ignore
    }
    this.indiceArrastando.set(index);
    this.dragMoved = false;
    this.skipClick = true;
    this.mousePanAtivo = false;
    this.atualizarPosicaoPorClient(index, event.clientX, event.clientY, false);
  }

  onMarcaPointerMove(index: number, event: PointerEvent): void {
    if (this.readonly || this.indiceArrastando() !== index) {
      return;
    }
    event.stopPropagation();
    event.preventDefault();
    this.dragMoved = true;
    this.atualizarPosicaoPorClient(index, event.clientX, event.clientY, false);
  }

  onMarcaPointerUp(index: number, event: PointerEvent): void {
    if (this.readonly || this.indiceArrastando() !== index) {
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
    if (this.readonly) {
      return;
    }
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
      numeroOs: this.numeroOsAtual(),
    }));
    this.marcasAtuais.set(restantes);
    this.emitirMarcas();
  }

  limparMarcas(): void {
    if (this.marcasAtuais().length === 0) {
      return;
    }
    const ok = window.confirm('Remover todos os pontos marcados nesta vista?');
    if (!ok) {
      return;
    }
    this.indiceArrastando.set(null);
    this.marcasAtuais.set([]);
    this.marcaChange.emit(null);
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
    const posXPct = this.limitarPercentual(
      ((clientX - rect.left) / rect.width) * 100,
    );
    const posYPct = this.limitarPercentual(
      ((clientY - rect.top) / rect.height) * 100,
    );
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
      Math.abs(nextX - this.translateX()) > 10 ||
      Math.abs(nextY - this.translateY()) > 10
    ) {
      this.pointerMoved = true;
    }
    this.translateX.set(nextX);
    this.translateY.set(nextY);
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
      const vistas = await firstValueFrom(
        this.modeloService.listVistas(this.modeloId, this.readonly ? undefined : true),
      );
      const ativas = this.readonly ? vistas : vistas.filter((v) => v.ativo);
      const filtradas = this.filtrarVistasPermitidas(ativas);
      this.vistas.set(filtradas);
      const preferida = this.marcaInicial?.idVista;
      const inicial =
        filtradas.find((v) => v.id === preferida)?.id ?? filtradas[0]?.id ?? null;
      if (!inicial) {
        this.error.set(
          filtradas.length === 0 && ativas.length > 0
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
    this.revokeObjectUrl();
    const blob = await firstValueFrom(
      this.modeloService.getVistaImagem(this.modeloId, vistaId),
    );
    this.objectUrl = URL.createObjectURL(blob);
    this.imagemUrl.set(this.objectUrl);
  }

  private async carregarMarcacoes(): Promise<void> {
    const vistaId = this.vistaId();
    if (!this.veiculoId || !vistaId) {
      this.pendentes.set([]);
      this.indiceOsAtual.set(1);
      this.numeroOsAtual.set(null);
      this.relabelMarcasAtuais();
      return;
    }
    try {
      const itens = await firstValueFrom(
        this.modeloService.listMarcacoes(this.veiculoId, vistaId, this.somenteAbertas),
      );
      this.aplicarIndicesMarcacoes(itens);
    } catch {
      this.pendentes.set([]);
      this.indiceOsAtual.set(1);
      this.numeroOsAtual.set(null);
      this.relabelMarcasAtuais();
    }
  }

  /**
   * Índice global por irregularidade na vista (ordem de numeroIrregularidade):
   * 1ª → 1.1/1.2…, 2ª → 2.1/2.2…; a atual (destaque ou nova) usa o próprio índice.
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

    let indiceAtual = ultimoIndice + 1;
    let numeroOsAtual: number | null = null;
    if (this.destaqueId && indicePorId.has(this.destaqueId)) {
      indiceAtual = indicePorId.get(this.destaqueId)!;
      numeroOsAtual =
        ordenados.find((i) => i.idIrregularidade === this.destaqueId)
          ?.numeroIrregularidade ?? null;
    }

    this.indiceOsAtual.set(indiceAtual);
    this.numeroOsAtual.set(numeroOsAtual);

    const pendentes: MapaAvariaMarca[] = [];
    for (const item of ordenados) {
      if (item.idIrregularidade === this.destaqueId) {
        continue;
      }
      pendentes.push({
        xPct: item.posXPct,
        yPct: item.posYPct,
        rotulo: rotuloCirculoMarcacao(
          indicePorId.get(item.idIrregularidade) ?? 1,
          item.ordem ?? 0,
        ),
        numeroOs: item.numeroIrregularidade || null,
        resolvido: item.resolvido,
      });
    }
    this.pendentes.set(pendentes);
    this.relabelMarcasAtuais();
  }

  private relabelMarcasAtuais(): void {
    const idx = this.indiceOsAtual();
    const numeroOs = this.numeroOsAtual();
    const atuais = this.marcasAtuais();
    if (atuais.length === 0) {
      return;
    }
    this.marcasAtuais.set(
      atuais.map((marca, ordem) => ({
        ...marca,
        rotulo: rotuloCirculoMarcacao(idx, ordem),
        numeroOs: numeroOs ?? marca.numeroOs,
      })),
    );
  }

  private aplicarMarcaInicial(): void {
    const inicial = this.marcaInicial;
    if (!inicial || inicial.idVista !== this.vistaId()) {
      if (!this.readonly) {
        return;
      }
      this.marcasAtuais.set([]);
      return;
    }
    const pontos =
      inicial.pontos && inicial.pontos.length > 0
        ? inicial.pontos
        : inicial.posXPct !== undefined && inicial.posYPct !== undefined
          ? [{ posXPct: inicial.posXPct, posYPct: inicial.posYPct }]
          : [];
    const idx = this.indiceOsAtual();
    const numeroOs = this.numeroOsAtual();
    this.marcasAtuais.set(
      pontos.map((p, ordem) => ({
        xPct: p.posXPct,
        yPct: p.posYPct,
        rotulo: rotuloCirculoMarcacao(idx, ordem),
        numeroOs,
      })),
    );
  }

  private aplicarEscala(
    valor: number,
    foco?: { x: number; y: number },
  ): void {
    const viewport = this.viewport?.nativeElement;
    const escalaAtual = this.escala();
    const next = Number(
      Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, valor)).toFixed(2),
    );
    if (!viewport || next === escalaAtual) {
      this.escala.set(next);
      if (next <= ZOOM_MIN) {
        this.translateX.set(0);
        this.translateY.set(0);
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
    const viewport = this.viewport?.nativeElement;
    if (!viewport || this.escala() <= ZOOM_MIN) {
      this.translateX.set(0);
      this.translateY.set(0);
      return;
    }
    const maxX = (viewport.clientWidth * (this.escala() - 1)) / 2;
    const maxY = (viewport.clientHeight * (this.escala() - 1)) / 2;
    this.translateX.set(
      Math.min(maxX, Math.max(-maxX, this.translateX())),
    );
    this.translateY.set(
      Math.min(maxY, Math.max(-maxY, this.translateY())),
    );
  }

  private centroViewport(): { x: number; y: number } | undefined {
    const viewport = this.viewport?.nativeElement;
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
    const viewport = this.viewport?.nativeElement;
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
    } else if (event.touches.length === 1 && this.escala() > ZOOM_MIN) {
      this.panStartX = event.touches[0].clientX - this.translateX();
      this.panStartY = event.touches[0].clientY - this.translateY();
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
      this.aplicarEscala(
        this.pinchStartScale * (atual / this.pinchStartDistance),
        mid,
      );
      event.preventDefault();
      return;
    }
    if (event.touches.length === 1 && this.escala() > ZOOM_MIN) {
      this.pointerMoved = true;
      this.translateX.set(event.touches[0].clientX - this.panStartX);
      this.translateY.set(event.touches[0].clientY - this.panStartY);
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
      this.panStartX = event.touches[0].clientX - this.translateX();
      this.panStartY = event.touches[0].clientY - this.translateY();
    }
    if (this.escala() <= ZOOM_MIN) {
      this.resetarZoom();
    } else {
      this.limitarPan();
    }
  }

  private distancia(t1: Touch, t2: Touch): number {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private limitarPercentual(valor: number): number {
    return Math.min(100, Math.max(0, Number(valor.toFixed(3))));
  }

  private revokeObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }
}
