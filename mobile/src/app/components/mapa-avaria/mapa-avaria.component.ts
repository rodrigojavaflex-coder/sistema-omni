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
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, eyeOffOutline, eyeOutline, removeOutline } from 'ionicons/icons';
import { VistoriaService } from '../../services/vistoria.service';
import { ModeloVeiculoVista } from '../../models/mapa-avaria.model';

const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const ZOOM_PASSO = 0.5;
const PAN_LIMIAR_PX = 10;
const MARCA_ALTURA_FATOR = 0.22;
const MARCA_MIN_PX = 16;
const MARCA_MAX_PX = 40;

export interface MarcaMapaEvento {
  idVista: string;
  posXPct: number;
  posYPct: number;
}

@Component({
  selector: 'app-mapa-avaria',
  standalone: true,
  templateUrl: './mapa-avaria.component.html',
  styleUrls: ['./mapa-avaria.component.scss'],
  imports: [NgIf, NgFor, IonButton, IonIcon],
})
export class MapaAvariaComponent implements OnChanges, OnDestroy {
  private vistoriaService = inject(VistoriaService);

  @Input({ required: true }) modeloId = '';
  @Input() veiculoId = '';
  @Input() marcaInicial: MarcaMapaEvento | null = null;
  @Input() idsCatalogoPermitidos: string[] | null = null;

  @Output() marcaChange = new EventEmitter<MarcaMapaEvento | null>();

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
  readonly pendentes = signal<Array<{ xPct: number; yPct: number; rotulo: string }>>([]);
  readonly mostrarPendentes = signal(true);
  readonly marcaAtual = signal<{ xPct: number; yPct: number; rotulo: string } | null>(null);
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

  private objectUrl: string | null = null;
  private pinchStartDistance: number | null = null;
  private pinchStartScale = ZOOM_MIN;
  private panStartX = 0;
  private panStartY = 0;
  private pointerMoved = false;
  private skipClick = false;
  private mousePanAtivo = false;

  private readonly onTouchStartBound = (event: TouchEvent) =>
    this.onTouchStart(event);
  private readonly onTouchMoveBound = (event: TouchEvent) =>
    this.onTouchMove(event);
  private readonly onTouchEndBound = (event: TouchEvent) =>
    this.onTouchEnd(event);
  private readonly onWheelBound = (event: WheelEvent) => this.onWheel(event);

  constructor() {
    addIcons({ addOutline, eyeOffOutline, eyeOutline, removeOutline });
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
    this.vistaId.set(id);
    this.resetarZoom();
    await this.carregarImagem();
    await this.carregarMarcacoes();
    if (this.marcaInicial?.idVista === id) {
      this.marcaAtual.set({
        xPct: this.marcaInicial.posXPct,
        yPct: this.marcaInicial.posYPct,
        rotulo: 'Nova',
      });
    } else {
      this.marcaAtual.set(null);
      this.marcaChange.emit(null);
    }
  }

  alternarPendentes(): void {
    this.mostrarPendentes.update((v) => !v);
  }

  zoomIn(): void {
    this.aplicarEscala(this.escala() + ZOOM_PASSO);
  }

  zoomOut(): void {
    this.aplicarEscala(this.escala() - ZOOM_PASSO);
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
    if (this.skipClick) {
      this.skipClick = false;
      return;
    }
    const alvo = event.currentTarget as HTMLElement;
    const rect = alvo.getBoundingClientRect();
    const vistaId = this.vistaId();
    if (rect.width <= 0 || rect.height <= 0 || !vistaId) {
      return;
    }
    const posXPct = this.limitar(((event.clientX - rect.left) / rect.width) * 100);
    const posYPct = this.limitar(((event.clientY - rect.top) / rect.height) * 100);
    this.marcaAtual.set({ xPct: posXPct, yPct: posYPct, rotulo: 'Nova' });
    this.marcaChange.emit({ idVista: vistaId, posXPct, posYPct });
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
            : 'Cadastre ao menos uma vista no modelo do veículo para sintomas que exigem localização.',
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
    const blob = await this.vistoriaService.obterImagemVista(this.modeloId, vistaId);
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
      const itens = await this.vistoriaService.listarMarcacoesVista(
        this.veiculoId,
        vistaId,
        true,
      );
      this.pendentes.set(
        itens.map((item) => ({
          xPct: item.posXPct,
          yPct: item.posYPct,
          rotulo: item.numeroIrregularidade ? String(item.numeroIrregularidade) : 'P',
        })),
      );
    } catch {
      this.pendentes.set([]);
    }
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
    this.pointerMoved = false;
    if (event.touches.length === 2) {
      this.skipClick = true;
      this.pinchStartDistance = this.distancia(event.touches[0], event.touches[1]);
      this.pinchStartScale = this.escala();
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
    if (event.touches.length === 2 && this.pinchStartDistance) {
      const atual = this.distancia(event.touches[0], event.touches[1]);
      this.aplicarEscala(this.pinchStartScale * (atual / this.pinchStartDistance));
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
    }
    if (this.pointerMoved) {
      this.skipClick = true;
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
    this.aplicarEscala(this.escala() + delta);
  }

  private aplicarEscala(valor: number): void {
    const next = this.clamp(valor, ZOOM_MIN, ZOOM_MAX);
    this.escala.set(Number(next.toFixed(2)));
    if (this.escala() <= ZOOM_MIN) {
      this.translateX.set(0);
      this.translateY.set(0);
      return;
    }
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

  private medirImagem(): void {
    const altura = this.mapaImg?.nativeElement.clientHeight ?? 0;
    if (altura > 0) {
      this.alturaImagemPx.set(altura);
    }
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
