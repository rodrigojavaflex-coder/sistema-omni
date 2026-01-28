import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { refreshOutline } from 'ionicons/icons';
import { Capacitor } from '@capacitor/core';
import { TipoVistoriaService } from '../../services/tipo-vistoria.service';
import { VeiculoService } from '../../services/veiculo.service';
import { MotoristaService } from '../../services/motorista.service';
import { VistoriaService } from '../../services/vistoria.service';
import { VistoriaFlowService } from '../../services/vistoria-flow.service';
import { TipoVistoria } from '../../models/tipo-vistoria.model';
import { Veiculo } from '../../models/veiculo.model';
import { Motorista } from '../../models/motorista.model';
import { Vistoria } from '../../models/vistoria.model';
import { SystemService } from '../../services/system.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-vistoria-inicio',
  standalone: true,
  templateUrl: './vistoria-inicio.page.html',
  styleUrls: ['./vistoria-inicio.page.scss'],
  imports: [
    NgIf,
    NgFor,
    DatePipe,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonCard,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonList,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonText,
  ],
})
export class VistoriaInicioPage implements OnInit {
  private tipoService = inject(TipoVistoriaService);
  private veiculoService = inject(VeiculoService);
  private motoristaService = inject(MotoristaService);
  private vistoriaService = inject(VistoriaService);
  private flowService = inject(VistoriaFlowService);
  private router = inject(Router);
  private systemService = inject(SystemService);
  private authService = inject(AuthService);

  tipos: TipoVistoria[] = [];
  veiculos: Veiculo[] = [];
  motoristas: Motorista[] = [];
  vistoriasEmAndamento: Vistoria[] = [];

  veiculoSearch = '';
  motoristaSearch = '';
  selectedVeiculo: Veiculo | null = null;
  selectedMotorista: Motorista | null = null;
  selectedTipoId = '';

  odometro: number | null = null;
  bateria: number | null = null;
  datavistoriaDisplay = '';
  datavistoriaIso = '';

  loadingTipos = false;
  loadingVeiculos = false;
  loadingMotoristas = false;
  isSaving = false;
  loadingAndamento = false;
  errorMessage = '';
  isNative = Capacitor.getPlatform() !== 'web';

  constructor() {
    addIcons({ refreshOutline });
  }

  async ngOnInit(): Promise<void> {
    await this.atualizarDataHora();

    this.loadingTipos = true;
    try {
      this.tipos = await this.tipoService.getAtivos();
    } catch (error) {
      this.errorMessage = 'Erro ao carregar tipos de vistoria.';
    } finally {
      this.loadingTipos = false;
    }

    this.loadingAndamento = true;
    try {
      const user = this.authService.getCurrentUser();
      this.vistoriasEmAndamento = await this.vistoriaService.listarEmAndamento(user?.id);
    } catch {
      this.vistoriasEmAndamento = [];
    } finally {
      this.loadingAndamento = false;
    }
  }

  async atualizarDataHora(): Promise<void> {
    try {
      const serverTime = await this.systemService.getServerTime();
      const serverDate = new Date(serverTime);
      this.datavistoriaDisplay = serverDate.toLocaleString('pt-BR');
      this.datavistoriaIso = serverDate.toISOString();
    } catch {
      const now = new Date();
      this.datavistoriaDisplay = now.toLocaleString('pt-BR');
      this.datavistoriaIso = now.toISOString();
    }
  }

  formatarMatricula(matricula: string): string {
    const clean = matricula?.toString() ?? '';
    const suffix = clean.slice(-3);
    return `***${suffix}`;
  }

  async continuarVistoria(vistoria: Vistoria): Promise<void> {
    try {
      const atualizada = await this.vistoriaService.retomarVistoria(vistoria.id);
      const tipoId = atualizada.idTipoVistoria || vistoria.idTipoVistoria;
      this.flowService.iniciar(atualizada.id, tipoId, {
        veiculoDescricao: atualizada.veiculo?.descricao ?? vistoria.veiculo?.descricao,
        datavistoria: atualizada.datavistoria ?? vistoria.datavistoria,
      });
      this.router.navigate(['/vistoria/checklist']);
    } catch (error: any) {
      this.errorMessage = error?.message || 'Não foi possível retomar a vistoria.';
    }
  }

  async onBuscarVeiculos(event: CustomEvent): Promise<void> {
    const value = (event.detail?.value ?? '').toString();
    this.veiculoSearch = value;
    if (!value.trim()) {
      this.veiculos = [];
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

  async onBuscarMotoristas(event: CustomEvent): Promise<void> {
    const value = (event.detail?.value ?? '').toString();
    this.motoristaSearch = value;
    if (!value.trim()) {
      this.motoristas = [];
      return;
    }
    this.loadingMotoristas = true;
    try {
      this.motoristas = await this.motoristaService.searchAtivos(value);
    } catch {
      this.motoristas = [];
    } finally {
      this.loadingMotoristas = false;
    }
  }

  selecionarVeiculo(veiculo: Veiculo): void {
    this.selectedVeiculo = veiculo;
    this.veiculos = [];
    this.veiculoSearch = `${veiculo.descricao} - ${veiculo.placa}`;
  }

  selecionarMotorista(motorista: Motorista): void {
    this.selectedMotorista = motorista;
    this.motoristas = [];
    this.motoristaSearch = `${motorista.nome} - ${motorista.matricula}`;
  }

  get canStart(): boolean {
    return Boolean(
      this.selectedVeiculo &&
        this.selectedMotorista &&
        this.selectedTipoId &&
        this.odometro !== null &&
        this.odometro > 0 &&
        this.bateria !== null &&
        this.bateria >= 0 &&
        this.bateria <= 100,
    );
  }

  async iniciarVistoria(): Promise<void> {
    if (!this.canStart || !this.selectedVeiculo || !this.selectedMotorista) {
      this.errorMessage = 'Preencha todos os campos obrigatórios.';
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user?.id) {
      this.errorMessage = 'Usuário não encontrado na sessão.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    try {
      const vistoria = await this.vistoriaService.iniciarVistoria({
        idusuario: user.id,
        idveiculo: this.selectedVeiculo.id,
        idmotorista: this.selectedMotorista.id,
        idtipovistoria: this.selectedTipoId,
        odometro: Number(this.odometro),
        porcentagembateria: Number(this.bateria),
        datavistoria: this.datavistoriaIso,
      });
      this.flowService.iniciar(vistoria.id, this.selectedTipoId, {
        veiculoDescricao: this.selectedVeiculo.descricao,
        datavistoria: this.datavistoriaIso,
      });
      this.router.navigate(['/vistoria/checklist']);
    } catch (error: any) {
      this.errorMessage = error?.message || 'Erro ao iniciar vistoria.';
    } finally {
      this.isSaving = false;
    }
  }
}
