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
import { MapaAvariaMarca } from '../../models/mapa-avaria.model';

const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const ZOOM_PASSO = 0.5;
const MARCA_ALTURA_FATOR = 0.22;
const MARCA_MIN_PX = 16;
const MARCA_MAX_PX = 40;

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
  @Input() marcaInicial: { idVista: string; posXPct: number; posYPct: number } | null =
    null;
  @Input() idsCatalogoPermitidos: string[] | null = null;

  @Output() marcaChange = new EventEmitter<{
    idVista: string;
    posXPct: number;
    posYPct: number;
  } | null>();

  @ViewChild('viewport') private viewport?: ElementRef<HTMLElement>;
  @ViewChild('mapaImg') private mapaImg?: ElementRef<HTMLImageElement>;

  readonly vistas = signal<ModeloVeiculoVista[]>([]);
  readonly vistaId = signal<string | null>(null);
  readonly imagemUrl = signal<string | null>(null);
  readonly pendentes = signal<MapaAvariaMarca[]>([]);
  readonly mostrarPendentes = signal(true);
  readonly marcaAtual = signal<MapaAvariaMarca | null>(null);
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
  readonly transformMarca = computed(
    () => `translate(-50%, -50%) scale(${1 / Math.max(this.escala(), ZOOM_MIN)})`,
  );
  readonly textoPendentes = computed(() =>
    this.mostrarPendentes() ? 'Ocultar pendentes' : 'Ver pendentes',
  );

  private objectUrl: string | null = null;
  private pinchStartDistance: number | null = null;
  private pinchStartScale = ZOOM_MIN;
  private pinchLastMid: { x: number; y: number } | null = null;
  private panStartX = 0;
  private panStartY = 0;
  private pointerMoved = false;
  private skipClick = false;
  private mousePanAtivo = false;

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
    this.vistaId.set(id);
    this.resetarZoom();
    await this.carregarImagem();
    await this.carregarMarcacoes();
    this.aplicarMarcaInicial();
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
    const altura = this.mapaImg?.nativeElement.clientHeight ?? 0;
    if (altura > 0) {
      this.alturaImagemPx.set(altura);
    }
  }

  onToqueMapa(event: MouseEvent): void {
    if (this.readonly || this.skipClick) {
      this.skipClick = false;
      return;
    }
    const alvo = event.currentTarget as HTMLElement;
    const rect = alvo.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0 || !this.vistaId()) {
      return;
    }
    const posXPct = this.limitarPercentual(((event.clientX - rect.left) / rect.width) * 100);
    const posYPct = this.limitarPercentual(((event.clientY - rect.top) / rect.height) * 100);
    this.marcaAtual.set({ xPct: posXPct, yPct: posYPct, rotulo: 'Nova' });
    this.marcaChange.emit({
      idVista: this.vistaId()!,
      posXPct,
      posYPct,
    });
  }

  onMouseDown(event: MouseEvent): void {
    if (event.button !== 0 || this.escala() <= ZOOM_MIN) {
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
      return;
    }
    try {
      const itens = await firstValueFrom(
        this.modeloService.listMarcacoes(this.veiculoId, vistaId, this.somenteAbertas),
      );
      this.pendentes.set(
        itens
          .filter((item) => item.idIrregularidade !== this.destaqueId)
          .map((item) => ({
            xPct: item.posXPct,
            yPct: item.posYPct,
            rotulo: item.numeroIrregularidade
              ? String(item.numeroIrregularidade)
              : 'P',
            resolvido: item.resolvido,
          })),
      );
    } catch {
      this.pendentes.set([]);
    }
  }

  private aplicarMarcaInicial(): void {
    const inicial = this.marcaInicial;
    if (!inicial || inicial.idVista !== this.vistaId()) {
      if (!this.readonly) {
        return;
      }
      this.marcaAtual.set(null);
      return;
    }
    this.marcaAtual.set({
      xPct: inicial.posXPct,
      yPct: inicial.posYPct,
      rotulo: 'Atual',
    });
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
