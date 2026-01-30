import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AlertController,
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
    DecimalPipe,
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
  private alertController = inject(AlertController);

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
  odometroDisplay = '';
  bateria: number | null = null;
  ultimoOdometro: number | null = null;
  ultimoOdometroData: string | null = null;
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
      this.vistoriasEmAndamento = await this.vistoriaService.listarEmAndamento(
        user?.id,
        this.flowService.getVistoriaId() ?? undefined,
      );
    } catch {
      this.vistoriasEmAndamento = [];
    } finally {
      this.loadingAndamento = false;
    }

    await this.carregarVistoriaEmEdicao();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.carregarVistoriaEmEdicao();
    await this.atualizarListaEmAndamento();
  }

  private async atualizarListaEmAndamento(): Promise<void> {
    this.loadingAndamento = true;
    try {
      const user = this.authService.getCurrentUser();
      this.vistoriasEmAndamento = await this.vistoriaService.listarEmAndamento(
        user?.id,
        this.flowService.getVistoriaId() ?? undefined,
      );
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
        tipoVistoriaDescricao: atualizada.tipoVistoria?.descricao ?? vistoria.tipoVistoria?.descricao,
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
    this.carregarUltimoOdometro(veiculo.id, this.flowService.getVistoriaId() ?? undefined);
    if (!this.isBateriaObrigatoria()) {
      this.bateria = null;
    }
  }

  limparVeiculo(): void {
    this.selectedVeiculo = null;
    this.veiculoSearch = '';
    this.veiculos = [];
    this.odometro = null;
    this.odometroDisplay = '';
    this.ultimoOdometro = null;
    this.ultimoOdometroData = null;
    this.errorMessage = '';
  }

  onOdometroInput(value: string | number | null | undefined): void {
    const parsed = this.parseOdometroValue(value);
    if (parsed === null) {
      this.odometro = null;
      this.odometroDisplay = '';
      return;
    }
    this.odometro = parsed;
    this.odometroDisplay = parsed
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  selecionarMotorista(motorista: Motorista): void {
    this.selectedMotorista = motorista;
    this.motoristas = [];
    this.motoristaSearch = `${motorista.nome} - ${motorista.matricula}`;
  }

  limparMotorista(): void {
    this.selectedMotorista = null;
    this.motoristaSearch = '';
    this.motoristas = [];
    this.errorMessage = '';
  }

  get canStart(): boolean {
    const bateriaObrigatoria = this.isBateriaObrigatoria();
    const bateriaValida =
      this.bateria === null
        ? !bateriaObrigatoria
        : this.bateria >= 0 && this.bateria <= 100;
    return Boolean(
      this.selectedVeiculo &&
        this.selectedMotorista &&
        this.selectedTipoId &&
        this.odometro !== null &&
        this.odometro > 0 &&
        this.odometro <= 9999999 &&
        bateriaValida,
    );
  }

  get startValidationMessage(): string | null {
    if (!this.selectedVeiculo) {
      return 'Selecione um veículo.';
    }
    if (!this.selectedMotorista) {
      return 'Selecione um motorista.';
    }
    if (!this.selectedTipoId) {
      return 'Selecione o tipo de vistoria.';
    }
    if (this.odometro === null || this.odometro <= 0) {
      return 'Informe o odômetro.';
    }
    if (this.odometro > 9999999) {
      return 'Odômetro não pode ser maior que 9.999.999.';
    }
    if (this.isBateriaObrigatoria() && (this.bateria === null || this.bateria < 0 || this.bateria > 100)) {
      return 'Informe a bateria (0 a 100) para veículo elétrico.';
    }
    return null;
  }

  async iniciarVistoria(): Promise<void> {
    if (!this.canStart || !this.selectedVeiculo || !this.selectedMotorista) {
      this.errorMessage = 'Preencha todos os campos obrigatórios.';
      return;
    }

    const odometroOk = await this.validarOdometro();
    if (!odometroOk) {
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
      const tipoSelecionado = this.tipos.find((tipo) => tipo.id === this.selectedTipoId);
      const vistoriaId = this.flowService.getVistoriaId();
      if (vistoriaId) {
        await this.vistoriaService.atualizarVistoria(vistoriaId, {
          idveiculo: this.selectedVeiculo.id,
          idmotorista: this.selectedMotorista.id,
          idtipovistoria: this.selectedTipoId,
          odometro: Number(this.odometro),
          porcentagembateria:
            this.bateria === null ? null : Number(this.bateria),
          datavistoria: this.datavistoriaIso,
        });
        this.flowService.updateContext({
          tipoVistoriaId: this.selectedTipoId,
          veiculoDescricao: this.selectedVeiculo.descricao,
          tipoVistoriaDescricao: tipoSelecionado?.descricao,
          datavistoria: this.datavistoriaIso,
        });
        this.router.navigate(['/vistoria/checklist']);
        return;
      }

      const vistoria = await this.vistoriaService.iniciarVistoria({
        idusuario: user.id,
        idveiculo: this.selectedVeiculo.id,
        idmotorista: this.selectedMotorista.id,
        idtipovistoria: this.selectedTipoId,
        odometro: Number(this.odometro),
        ...(this.bateria !== null ? { porcentagembateria: Number(this.bateria) } : {}),
        datavistoria: this.datavistoriaIso,
      });
      this.flowService.iniciar(vistoria.id, this.selectedTipoId, {
        veiculoDescricao: this.selectedVeiculo.descricao,
        tipoVistoriaDescricao: tipoSelecionado?.descricao,
        datavistoria: this.datavistoriaIso,
      });
      this.router.navigate(['/vistoria/checklist']);
    } catch (error: any) {
      this.errorMessage = error?.message || 'Erro ao iniciar vistoria.';
    } finally {
      this.isSaving = false;
    }
  }

  isBateriaObrigatoria(): boolean {
    const combustivel = this.selectedVeiculo?.combustivel ?? '';
    return combustivel.toLowerCase() === 'eletrico';
  }

  private parseOdometroValue(value: string | number | null | undefined): number | null {
    if (value === null || value === undefined) {
      return null;
    }
    if (typeof value === 'number') {
      return Number.isNaN(value) ? null : Math.floor(value);
    }
    const raw = value.toString().trim();
    if (!raw) {
      return null;
    }
    const hasDot = raw.includes('.');
    const hasComma = raw.includes(',');
    let normalized = raw;
    if (hasDot && hasComma) {
      normalized = raw.replace(/\./g, '').replace(',', '.');
    } else if (hasComma) {
      const parts = raw.split(',');
      normalized = parts[parts.length - 1].length <= 2 ? raw.replace(',', '.') : raw.replace(/,/g, '');
    } else if (hasDot) {
      const parts = raw.split('.');
      normalized = parts[parts.length - 1].length <= 2 ? raw : raw.replace(/\./g, '');
    }
    normalized = normalized.replace(/[^\d.]/g, '');
    if (!normalized) {
      return null;
    }
    const parsed = Number.parseFloat(normalized);
    if (Number.isNaN(parsed)) {
      return null;
    }
    return Math.floor(parsed);
  }

  private async carregarUltimoOdometro(
    idVeiculo: string,
    ignorarVistoriaId?: string,
  ): Promise<void> {
    try {
      const ultimo = await this.vistoriaService.getUltimoOdometro(
        idVeiculo,
        ignorarVistoriaId,
      );
      this.ultimoOdometro = ultimo?.odometro ?? null;
      this.ultimoOdometroData = ultimo?.datavistoria ?? null;
    } catch {
      this.ultimoOdometro = null;
      this.ultimoOdometroData = null;
    }
  }

  private async validarOdometro(): Promise<boolean> {
    if (this.odometro === null || this.odometro <= 0) {
      this.errorMessage = 'Informe um odômetro válido.';
      return false;
    }
    if (this.odometro > 9999999) {
      this.errorMessage = 'Odômetro não pode ser maior que 9.999.999.';
      return false;
    }
    if (this.ultimoOdometro === null || this.ultimoOdometro === undefined) {
      return true;
    }
    if (this.odometro <= this.ultimoOdometro) {
      this.errorMessage = 'Odômetro deve ser maior que o da última vistoria.';
      return false;
    }
    const diff = this.odometro - this.ultimoOdometro;
    if (diff > 200) {
      const alert = await this.alertController.create({
        header: 'Confirmar odômetro',
        message: `Veículo rodou ${diff} km desde a última vistoria. Deseja registrar o odômetro?`,
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          { text: 'Confirmar', role: 'confirm' },
        ],
      });
      await alert.present();
      const { role } = await alert.onDidDismiss();
      return role === 'confirm';
    }
    return true;
  }

  private async carregarVistoriaEmEdicao(): Promise<void> {
    const vistoriaId = this.flowService.getVistoriaId();
    if (!vistoriaId) {
      return;
    }
    try {
      const vistoria = await this.vistoriaService.getById(vistoriaId);
      if (vistoria?.veiculo) {
        this.selectedVeiculo = {
          id: vistoria.idVeiculo,
          descricao: vistoria.veiculo?.descricao ?? '',
          placa: vistoria.veiculo?.placa ?? '',
          status: 'ATIVO',
          combustivel: vistoria.veiculo?.combustivel,
        };
        this.veiculoSearch = `${this.selectedVeiculo.descricao} - ${this.selectedVeiculo.placa}`;
        this.carregarUltimoOdometro(this.selectedVeiculo.id, vistoria.id);
      }
      if (vistoria?.motorista) {
        this.selectedMotorista = {
          id: vistoria.idMotorista,
          nome: vistoria.motorista?.nome ?? '',
          matricula: vistoria.motorista?.matricula ?? '',
          status: 'ATIVO',
        } as Motorista;
        this.motoristaSearch = `${this.selectedMotorista.nome} - ${this.selectedMotorista.matricula}`;
      }
      this.selectedTipoId = vistoria.idTipoVistoria;
      this.onOdometroInput(vistoria.odometro);
      if (this.isBateriaObrigatoria()) {
        this.bateria =
          vistoria.porcentagembateria === null || vistoria.porcentagembateria === undefined
            ? null
            : Number(vistoria.porcentagembateria);
      } else {
        this.bateria = null;
      }
      if (vistoria.datavistoria) {
        const date = new Date(vistoria.datavistoria);
        this.datavistoriaDisplay = date.toLocaleString('pt-BR');
        this.datavistoriaIso = date.toISOString();
      }
      this.flowService.updateContext({
        tipoVistoriaId: vistoria.idTipoVistoria,
        veiculoDescricao: vistoria.veiculo?.descricao,
        tipoVistoriaDescricao: vistoria.tipoVistoria?.descricao,
        datavistoria: vistoria.datavistoria,
      });
    } catch {
      // mantém dados atuais se falhar
    }
  }
}
