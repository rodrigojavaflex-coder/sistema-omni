import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  OnDestroy,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Capacitor } from '@capacitor/core';
import { Router } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import '@google/model-viewer';
import { VeiculoService } from '../../services/veiculo.service';
import { VistoriaService } from '../../services/vistoria.service';
import { IrregularidadeResumo } from '../../models/irregularidade.model';
import { ErrorMessageService } from '../../services/error-message.service';
import {
  DIMENSOES_ONIBUS_FALLBACK,
  DimensoesModelo3d,
  FaceVista3d,
  faceVisivelNoOrbit,
  mapearMarcacaoParaHotspot3d,
} from './mapa-marcacao-3d.util';

export type TipoOnibus3d = 'articulado' | 'biarticulado';
export type CorOnibus3d = 'verde' | 'azul';

/** Prefixo/descrição de teste para carregar marcações no viewer. */
const VEICULO_MARCACOES_TESTE = '1210';

export interface HotspotMarcacao3d {
  slot: string;
  position: string;
  normal: string;
  face: FaceVista3d;
  label: string;
  titulo: string;
  descricaoVista: string;
  idIrregularidade: string;
}

@Component({
  selector: 'app-prototipo-veiculo-3d',
  standalone: true,
  templateUrl: './prototipo-veiculo-3d.page.html',
  styleUrls: ['./prototipo-veiculo-3d.page.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonButton,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonSpinner,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PrototipoVeiculo3dPage implements AfterViewInit, OnDestroy {
  private router = inject(Router);
  private veiculoService = inject(VeiculoService);
  private vistoriaService = inject(VistoriaService);
  private errorMessageService = inject(ErrorMessageService);

  private readonly modelViewerRef =
    viewChild<ElementRef<HTMLElement>>('modelViewer');

  readonly isNative = Capacitor.getPlatform() !== 'web';
  readonly tipo = signal<TipoOnibus3d>('articulado');
  readonly cor = signal<CorOnibus3d>('verde');

  readonly carregandoMarcacoes = signal(false);
  readonly erroMarcacoes = signal<string | null>(null);
  readonly veiculoLabel = signal<string | null>(null);
  readonly idVeiculo = signal<string | null>(null);
  readonly pendentesComMarca = signal<IrregularidadeResumo[]>([]);
  readonly hotspots = signal<HotspotMarcacao3d[]>([]);
  readonly dimsModelo = signal<DimensoesModelo3d>(DIMENSOES_ONIBUS_FALLBACK);
  /** Ângulo azimutal do orbit (rad); usado para ocultar frente/trás no perfil. */
  readonly cameraTheta = signal(0);

  private loadListener?: EventListener;
  private cameraChangeListener?: EventListener;

  /** Servido a partir de `mobile/public/3d/` (angular.json assets → public). */
  readonly modelSrc = computed(
    () => `/3d/${this.tipo()}-${this.cor()}.glb?v=meshy8`,
  );

  readonly modelAlt = computed(() => {
    const tipoLabel =
      this.tipo() === 'articulado' ? 'Ônibus articulado' : 'Ônibus biarticulado';
    const corLabel = this.cor() === 'verde' ? 'verde' : 'azul';
    const meshy =
      this.tipo() === 'articulado' && this.cor() === 'verde'
        ? ' — Meshy biometano'
        : '';
    return `${tipoLabel} (${corLabel})${meshy} — protótipo 3D`;
  });

  readonly usandoMeshy = computed(
    () => this.tipo() === 'articulado' && this.cor() === 'verde',
  );

  readonly mostrarMarcacoes = computed(() => this.tipo() === 'articulado');

  readonly cameraOrbit = computed(() =>
    this.usandoMeshy() ? '25deg 70deg 105%' : '45deg 75deg 110%',
  );

  readonly minCameraOrbit = 'auto auto 50%';
  readonly maxCameraOrbit = 'auto auto 350%';

  ngAfterViewInit(): void {
    void this.carregarMarcacoesVeiculoTeste();
    this.registrarLoadViewer();
    this.registrarCameraChange();
  }

  ngOnDestroy(): void {
    this.removerLoadViewer();
    this.removerCameraChange();
  }

  onTipoChange(value: string | number | undefined): void {
    if (value === 'articulado' || value === 'biarticulado') {
      this.tipo.set(value);
      this.recalcularHotspots();
      queueMicrotask(() => {
        this.registrarLoadViewer();
        this.registrarCameraChange();
      });
    }
  }

  onCorChange(value: string | number | undefined): void {
    if (value === 'verde' || value === 'azul') {
      this.cor.set(value);
      queueMicrotask(() => {
        this.registrarLoadViewer();
        this.registrarCameraChange();
      });
    }
  }

  onModelLoad(): void {
    this.atualizarDimensoesDoViewer();
    this.atualizarCameraTheta();
    this.recalcularHotspots();
    // Alguns GLBs (Meshy) só reportam bbox estável no frame seguinte
    requestAnimationFrame(() => {
      this.atualizarDimensoesDoViewer();
      this.atualizarCameraTheta();
      this.recalcularHotspots();
    });
  }

  /** Pin só aparece se a face da marcação estiver de frente para a câmera. */
  hotspotVisivel(face: FaceVista3d): boolean {
    return faceVisivelNoOrbit(face, this.cameraTheta());
  }

  voltar(): void {
    void this.router.navigateByUrl('/home');
  }

  private registrarLoadViewer(): void {
    this.removerLoadViewer();
    const el = this.modelViewerRef()?.nativeElement;
    if (!el) {
      return;
    }
    this.loadListener = () => this.onModelLoad();
    el.addEventListener('load', this.loadListener);
  }

  private removerLoadViewer(): void {
    const el = this.modelViewerRef()?.nativeElement;
    if (el && this.loadListener) {
      el.removeEventListener('load', this.loadListener);
    }
    this.loadListener = undefined;
  }

  private registrarCameraChange(): void {
    this.removerCameraChange();
    const el = this.modelViewerRef()?.nativeElement;
    if (!el) {
      return;
    }
    this.cameraChangeListener = () => this.atualizarCameraTheta();
    el.addEventListener('camera-change', this.cameraChangeListener);
    this.atualizarCameraTheta();
  }

  private removerCameraChange(): void {
    const el = this.modelViewerRef()?.nativeElement;
    if (el && this.cameraChangeListener) {
      el.removeEventListener('camera-change', this.cameraChangeListener);
    }
    this.cameraChangeListener = undefined;
  }

  private atualizarCameraTheta(): void {
    const el = this.modelViewerRef()?.nativeElement as
      | (HTMLElement & {
          getCameraOrbit?: () => { theta: number; phi: number; radius: number };
        })
      | undefined;
    const orbit = el?.getCameraOrbit?.();
    if (orbit && Number.isFinite(orbit.theta)) {
      this.cameraTheta.set(orbit.theta);
    }
  }

  private atualizarDimensoesDoViewer(): void {
    const el = this.modelViewerRef()?.nativeElement as
      | (HTMLElement & { getDimensions?: () => { x: number; y: number; z: number } })
      | undefined;
    const dims = el?.getDimensions?.();
    if (
      dims &&
      Number.isFinite(dims.x) &&
      Number.isFinite(dims.y) &&
      Number.isFinite(dims.z) &&
      dims.x > 0 &&
      dims.y > 0 &&
      dims.z > 0
    ) {
      this.dimsModelo.set({ x: dims.x, y: dims.y, z: dims.z });
    }
  }

  private async carregarMarcacoesVeiculoTeste(): Promise<void> {
    this.carregandoMarcacoes.set(true);
    this.erroMarcacoes.set(null);
    try {
      const veiculos = await this.veiculoService.searchAtivos(VEICULO_MARCACOES_TESTE);
      const veiculo =
        veiculos.find(
          (v) =>
            v.descricao?.trim() === VEICULO_MARCACOES_TESTE ||
            v.descricao?.includes(VEICULO_MARCACOES_TESTE) ||
            v.placa?.includes(VEICULO_MARCACOES_TESTE),
        ) ?? veiculos[0];

      if (!veiculo?.id) {
        this.erroMarcacoes.set(
          `Veículo ${VEICULO_MARCACOES_TESTE} não encontrado (ativos).`,
        );
        this.pendentesComMarca.set([]);
        this.hotspots.set([]);
        return;
      }

      this.idVeiculo.set(veiculo.id);
      this.veiculoLabel.set(
        `${veiculo.descricao}${veiculo.placa ? ` — ${veiculo.placa}` : ''}`,
      );

      const pendentes =
        await this.vistoriaService.listarIrregularidadesPendentes(veiculo.id);
      const comMarca = pendentes.filter((p) => {
        const marcas = p.marcacoes?.length ? p.marcacoes : p.marcacao ? [p.marcacao] : [];
        return marcas.length > 0;
      });
      this.pendentesComMarca.set(comMarca);
      this.recalcularHotspots();
    } catch (err) {
      this.erroMarcacoes.set(
        this.errorMessageService.fromApi(
          err,
          'Não foi possível carregar as marcações do veículo.',
        ),
      );
      this.pendentesComMarca.set([]);
      this.hotspots.set([]);
    } finally {
      this.carregandoMarcacoes.set(false);
    }
  }

  private recalcularHotspots(): void {
    if (!this.mostrarMarcacoes()) {
      this.hotspots.set([]);
      return;
    }

    const dims = this.dimsModelo();
    const lista: HotspotMarcacao3d[] = [];

    const ordenados = [...this.pendentesComMarca()].sort((a, b) => {
      const na = a.numeroIrregularidade ?? Number.MAX_SAFE_INTEGER;
      const nb = b.numeroIrregularidade ?? Number.MAX_SAFE_INTEGER;
      if (na !== nb) return na - nb;
      return (a.atualizadoEm ?? '').localeCompare(b.atualizadoEm ?? '');
    });

    let indiceOs = 0;
    for (const item of ordenados) {
      indiceOs += 1;
      const marcas =
        item.marcacoes && item.marcacoes.length > 0
          ? [...item.marcacoes].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))
          : item.marcacao
            ? [item.marcacao]
            : [];

      marcas.forEach((marca, idx) => {
        const ordemPonto = (marca.ordem ?? idx) + 1;
        const mapped = mapearMarcacaoParaHotspot3d(
          marca.descricaoVista,
          marca.posXPct,
          marca.posYPct,
          dims,
        );
        const os = item.numeroIrregularidade ?? indiceOs;
        const rotulo = `${indiceOs}.${ordemPonto}`;
        lista.push({
          slot: `hotspot-os-${item.id}-${marca.ordem ?? idx}`,
          position: mapped.position,
          normal: mapped.normal,
          face: mapped.face,
          label: rotulo,
          titulo: `OS ${os} — ${item.descricaoSintoma ?? item.nomeComponente ?? 'Irregularidade'}`,
          descricaoVista: marca.descricaoVista || 'Vista',
          idIrregularidade: item.id,
        });
      });
    }

    this.hotspots.set(lista);
  }
}
