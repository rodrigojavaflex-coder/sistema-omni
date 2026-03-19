import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import {
  AlertController,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonMenuButton,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { AreaVistoriadaService } from '../../services/area-vistoriada.service';
import { VistoriaFlowService } from '../../services/vistoria-flow.service';
import { VistoriaService } from '../../services/vistoria.service';
import { VistoriaBootstrapService } from '../../services/vistoria-bootstrap.service';
import { ErrorMessageService } from '../../services/error-message.service';
import { AuthService } from '../../services/auth.service';
import { AreaComponente } from '../../models/area-vistoriada.model';

@Component({
  selector: 'app-vistoria-componentes',
  standalone: true,
  templateUrl: './vistoria-componentes.page.html',
  styleUrls: ['./vistoria-componentes.page.scss'],
  imports: [
    NgIf,
    NgFor,
    IonContent,
    IonFooter,
    IonHeader,
    IonModal,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonText,
    IonSpinner,
  ],
})
export class VistoriaComponentesPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private areaService = inject(AreaVistoriadaService);
  private flowService = inject(VistoriaFlowService);
  private vistoriaService = inject(VistoriaService);
  private bootstrapService = inject(VistoriaBootstrapService);
  private alertController = inject(AlertController);
  private errorMessageService = inject(ErrorMessageService);
  private authService = inject(AuthService);

  areaId = '';
  areaNome = '';
  componentes: AreaComponente[] = [];
  irregularidadesPorComponente: Record<string, number> = {};
  pendentesPorComponente = new Set<string>();
  loading = false;
  errorMessage = '';
  private initialized = false;

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

  voltar(): void {
    this.router.navigate(['/vistoria/areas']);
  }

  irParaFinalizar(): void {
    this.router.navigate(['/vistoria/finalizar']);
  }

  async ngOnInit(): Promise<void> {
    const vistoriaId = this.flowService.getVistoriaId();
    if (!vistoriaId) {
      this.router.navigate(['/vistoria/inicio']);
      return;
    }

    this.areaId = this.route.snapshot.paramMap.get('areaId') ?? '';
    if (!this.areaId) {
      this.router.navigate(['/vistoria/areas']);
      return;
    }
    const state = this.router.getCurrentNavigation()?.extras?.state as { areaNome?: string } | undefined;
    this.areaNome = state?.areaNome ?? 'Área';
    this.initialized = true;
    await this.carregarDados();
  }

  async ionViewWillEnter(): Promise<void> {
    if (!this.initialized) {
      return;
    }
    await this.carregarDados();
  }

  private async carregarDados(): Promise<void> {
    const vistoriaId = this.flowService.getVistoriaId();
    if (!vistoriaId) {
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    this.irregularidadesPorComponente = {};
    this.pendentesPorComponente = new Set<string>();
    try {
      const bootstrap = await this.bootstrapService.getOrFetch(vistoriaId);
      const areaBootstrap = bootstrap?.areas?.find((a) => a.id === this.areaId);
      if (bootstrap && areaBootstrap) {
        this.componentes = areaBootstrap.componentes as AreaComponente[];
        await this.recarregarIndicadores(vistoriaId);
        return;
      }

      this.componentes = await this.areaService.listarComponentes(this.areaId);
      const veiculoId = this.flowService.getVeiculoId();
      const [irregularidades, pendentes] = await Promise.all([
        this.vistoriaService.listarIrregularidades(vistoriaId),
        veiculoId ? this.vistoriaService.listarIrregularidadesPendentes(veiculoId) : Promise.resolve([]),
      ]);
      const idsDaVistoriaAtual = new Set(irregularidades.map((item) => item.id));
      const pendentesAnteriores = pendentes.filter((item) => !idsDaVistoriaAtual.has(item.id));
      irregularidades
        .filter((item) => item.idarea === this.areaId)
        .forEach((item) => {
          this.irregularidadesPorComponente[item.idcomponente] =
            (this.irregularidadesPorComponente[item.idcomponente] ?? 0) + 1;
        });
      pendentesAnteriores
        .filter((item) => item.idarea === this.areaId)
        .forEach((item) => this.pendentesPorComponente.add(item.idcomponente));
    } catch {
      this.errorMessage = 'Erro ao carregar componentes.';
    } finally {
      this.loading = false;
    }
  }

  abrirComponente(item: AreaComponente): void {
    const componenteId = item.idComponente;
    if (!componenteId) {
      return;
    }
    this.router.navigate([`/vistoria/areas/${this.areaId}/componentes/${componenteId}`], {
      state: {
        areaNome: this.areaNome,
        componenteNome: item.componente?.nome ?? 'Componente',
      },
    });
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
    this.router.navigate(['/vistoria/historico-veiculo'], {
      state: { fromMenu: false },
    });
  }

  private async recarregarIndicadores(vistoriaId: string): Promise<void> {
    const veiculoId = this.flowService.getVeiculoId();
    const [irregularidades, pendentes] = await Promise.all([
      this.vistoriaService.listarIrregularidades(vistoriaId),
      veiculoId ? this.vistoriaService.listarIrregularidadesPendentes(veiculoId) : Promise.resolve([]),
    ]);

    this.irregularidadesPorComponente = {};
    irregularidades
      .filter((item) => item.idarea === this.areaId)
      .forEach((item) => {
        this.irregularidadesPorComponente[item.idcomponente] =
          (this.irregularidadesPorComponente[item.idcomponente] ?? 0) + 1;
      });

    const idsDaVistoriaAtual = new Set(irregularidades.map((item) => item.id));
    const pendentesAnteriores = pendentes.filter((item) => !idsDaVistoriaAtual.has(item.id));
    this.pendentesPorComponente = new Set(
      pendentesAnteriores
        .filter((item) => item.idarea === this.areaId)
        .map((item) => item.idcomponente),
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
