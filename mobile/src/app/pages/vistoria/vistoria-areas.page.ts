import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import {
  AlertController,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonText,
  IonSpinner,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { VistoriaFlowService } from '../../services/vistoria-flow.service';
import { AreaVistoriadaService } from '../../services/area-vistoriada.service';
import { VistoriaService } from '../../services/vistoria.service';
import { VistoriaBootstrapService } from '../../services/vistoria-bootstrap.service';
import { AreaVistoriada, AreaComponente } from '../../models/area-vistoriada.model';
import { IrregularidadeResumo } from '../../models/irregularidade.model';
import { VistoriaBootstrap } from '../../models/vistoria-bootstrap.model';
import { ErrorMessageService } from '../../services/error-message.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-vistoria-areas',
  standalone: true,
  templateUrl: './vistoria-areas.page.html',
  styleUrls: ['./vistoria-areas.page.scss'],
  imports: [
    NgIf,
    NgFor,
    IonContent,
    IonFooter,
    IonHeader,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonButton,
    IonText,
    IonSpinner,
  ],
})
export class VistoriaAreasPage implements OnInit {
  private flowService = inject(VistoriaFlowService);
  private areaService = inject(AreaVistoriadaService);
  private vistoriaService = inject(VistoriaService);
  private bootstrapService = inject(VistoriaBootstrapService);
  private alertController = inject(AlertController);
  private errorMessageService = inject(ErrorMessageService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  areas: AreaVistoriada[] = [];
  contagemPorArea: Record<string, number> = {};
  contagemPendentesPorArea: Record<string, number> = {};
  loading = false;
  errorMessage = '';

  /** Bottom sheet de componentes (mesma aba) */
  selectedArea: AreaVistoriada | null = null;
  componentes: AreaComponente[] = [];
  loadingComponentes = false;
  irregularidadesPorComponente: Record<string, number> = {};
  contagemPendentesPorComponente: Record<string, number> = {};
  private irregularidadesList: IrregularidadeResumo[] = [];
  private pendentesList: IrregularidadeResumo[] = [];
  private reopenAreaId: string | null = null;
  private initialized = false;

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

  voltarOuFechar(): void {
    if (this.selectedArea !== null) {
      this.fecharSheetComponentes();
    } else {
      this.router.navigate(['/vistoria/inicio']);
    }
  }

  ngOnInit(): void {
    const vistoriaId = this.flowService.getVistoriaId();
    if (!vistoriaId) {
      this.router.navigate(['/vistoria/inicio']);
      return;
    }
    const navState = (this.router.getCurrentNavigation()?.extras?.state ??
      history.state ??
      {}) as { reopenAreaId?: string };
    this.reopenAreaId = navState.reopenAreaId ?? null;

    if (!this.flowService.getNumeroVistoria() && vistoriaId) {
      this.vistoriaService.getById(vistoriaId).then((v) => {
        if (v?.numeroVistoria != null) {
          this.flowService.updateContext({ numeroVistoria: v.numeroVistoria });
          this.cdr.detectChanges();
        }
      });
    }
    this.initialized = true;
    this.carregarAreas();
  }

  async ionViewWillEnter(): Promise<void> {
    if (!this.initialized) {
      return;
    }
    const navState = (history.state ?? {}) as { reopenAreaId?: string };
    this.reopenAreaId = navState.reopenAreaId ?? this.reopenAreaId;
    await this.carregarAreas();
  }

  async carregarAreas(): Promise<void> {
    const vistoriaId = this.flowService.getVistoriaId();
    const modeloId = this.flowService.getVeiculoModeloId();
    if (!vistoriaId) return;

    this.loading = true;
    this.errorMessage = '';
    try {
      const bootstrap = await this.bootstrapService.getOrFetch(vistoriaId);
      if (bootstrap) {
        this.aplicarBootstrap(bootstrap);
        await this.recarregarIndicadores(vistoriaId);
        if (!this.flowService.getNumeroVistoria() && bootstrap.vistoria?.numeroVistoria != null) {
          this.flowService.updateContext({ numeroVistoria: bootstrap.vistoria.numeroVistoria });
        }
        if (this.reopenAreaId) {
          const area = this.areas.find((a) => a.id === this.reopenAreaId);
          if (area) {
            await this.abrirArea(area);
          }
          this.reopenAreaId = null;
        }
        return;
      }

      if (modeloId) {
        this.areas = await this.areaService.listarPorModelo(modeloId);
      }
      if (this.areas.length === 0) {
        this.areas = await this.areaService.listarAtivas();
      }
      const [irregularidades, pendentes] = await Promise.all([
        this.vistoriaService.listarIrregularidades(vistoriaId),
        this.flowService.getVeiculoId()
          ? this.vistoriaService.listarIrregularidadesPendentes(this.flowService.getVeiculoId()!)
          : Promise.resolve([]),
      ]);
      this.aplicarIndicadores(irregularidades, pendentes);

      // Ao retornar do salvamento de irregularidade, reabre a área para recarregar seus componentes.
      if (this.reopenAreaId) {
        const area = this.areas.find((a) => a.id === this.reopenAreaId);
        if (area) {
          await this.abrirArea(area);
        }
        this.reopenAreaId = null;
      }
    } catch {
      this.errorMessage = 'Erro ao carregar áreas. Tente novamente.';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async abrirArea(area: AreaVistoriada): Promise<void> {
    this.errorMessage = '';
    this.selectedArea = area;
    this.componentes = [];
    this.irregularidadesPorComponente = {};
    this.contagemPendentesPorComponente = {};
    await this.carregarComponentesDaArea();
  }

  /** Recarrega componentes da área selecionada (uso após erro ou retry). */
  async carregarComponentesDaArea(): Promise<void> {
    const area = this.selectedArea;
    if (!area) return;
    this.errorMessage = '';
    this.loadingComponentes = true;
    this.irregularidadesPorComponente = {};
    this.contagemPendentesPorComponente = {};
    this.cdr.detectChanges();
    try {
      const vistoriaId = this.flowService.getVistoriaId();
      const bootstrap = vistoriaId ? this.bootstrapService.getSnapshot(vistoriaId) : null;
      const areaBootstrap = bootstrap?.areas?.find((a) => a.id === area.id);
      if (areaBootstrap) {
        this.componentes = areaBootstrap.componentes as AreaComponente[];
      } else {
        this.componentes = await this.areaService.listarComponentes(area.id);
      }
      this.irregularidadesList
        .filter((item) => item.idarea === area.id)
        .forEach((item) => {
          this.irregularidadesPorComponente[item.idcomponente] =
            (this.irregularidadesPorComponente[item.idcomponente] ?? 0) + 1;
        });
      this.pendentesList
        .filter((item) => item.idarea === area.id)
        .forEach((item) => {
          this.contagemPendentesPorComponente[item.idcomponente] =
            (this.contagemPendentesPorComponente[item.idcomponente] ?? 0) + 1;
        });
    } catch {
      this.errorMessage = 'Erro ao carregar componentes. Tente novamente.';
    } finally {
      this.loadingComponentes = false;
      this.cdr.detectChanges();
    }
  }

  private aplicarBootstrap(bootstrap: VistoriaBootstrap): void {
    this.areas = bootstrap.areas;
    this.aplicarIndicadores(
      bootstrap.irregularidadesVistoria ?? [],
      bootstrap.pendentesVeiculo ?? [],
    );
  }

  private aplicarIndicadores(
    irregularidades: IrregularidadeResumo[],
    pendentesRaw: IrregularidadeResumo[],
  ): void {
    this.irregularidadesList = irregularidades;
    const idsDaVistoriaAtual = new Set(irregularidades.map((item) => item.id));
    this.pendentesList = pendentesRaw.filter((item) => !idsDaVistoriaAtual.has(item.id));

    this.contagemPorArea = irregularidades.reduce((acc, item) => {
      acc[item.idarea] = (acc[item.idarea] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.contagemPendentesPorArea = this.pendentesList.reduce((acc, item) => {
      acc[item.idarea] = (acc[item.idarea] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private async recarregarIndicadores(vistoriaId: string): Promise<void> {
    const veiculoId = this.flowService.getVeiculoId();
    const [irregularidades, pendentes] = await Promise.all([
      this.vistoriaService.listarIrregularidades(vistoriaId),
      veiculoId ? this.vistoriaService.listarIrregularidadesPendentes(veiculoId) : Promise.resolve([]),
    ]);
    this.aplicarIndicadores(irregularidades, pendentes);
  }

  fecharSheetComponentes(): void {
    this.selectedArea = null;
    this.componentes = [];
    this.errorMessage = '';
    this.cdr.detectChanges();
  }

  abrirComponente(item: AreaComponente): void {
    const areaId = this.selectedArea?.id;
    const componenteId = item.idComponente;
    if (!areaId || !componenteId) return;
    this.router.navigate([`/vistoria/areas/${areaId}/componentes/${componenteId}`], {
      state: {
        areaNome: this.selectedArea?.nome ?? 'Área',
        componenteNome: item.componente?.nome ?? 'Componente',
      },
    });
  }

  finalizarVistoria(): void {
    this.router.navigate(['/vistoria/finalizar']);
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

  private escapeHtml(value: string): string {
    return (value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
