import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
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
import { VistoriaFlowService } from '../../services/vistoria-flow.service';
import { VistoriaService } from '../../services/vistoria.service';
import { AuthService } from '../../services/auth.service';
import { ErrorMessageService } from '../../services/error-message.service';

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
  resumoBateria = '-';
  resumoIrregularidades = 0;
  resumoIrregularidadesDetalhes: string[] = [];
  sucessoVisivel = false;
  private sucessoResolver: (() => void) | null = null;

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
      await this.mostrarResumoConclusao();
      this.flowService.finalizar();
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.errorMessage = this.errorMessageService.fromApi(
        error,
        'Erro ao finalizar vistoria. Tente novamente.',
      );
    } finally {
      this.isSaving = false;
    }
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
    await new Promise<void>((resolve) => {
      this.sucessoResolver = resolve;
    });
  }

  confirmarConclusao(): void {
    this.sucessoVisivel = false;
    if (this.sucessoResolver) {
      this.sucessoResolver();
      this.sucessoResolver = null;
    }
  }
}
