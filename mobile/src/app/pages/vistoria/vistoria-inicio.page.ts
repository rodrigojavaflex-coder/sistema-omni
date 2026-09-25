import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AlertController,
  IonButton,
  IonCard,
  IonContent,
  IonFooter,
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
import { VeiculoService } from '../../services/veiculo.service';
import { MotoristaService } from '../../services/motorista.service';
import { VistoriaService } from '../../services/vistoria.service';
import { VistoriaFlowService } from '../../services/vistoria-flow.service';
import { VistoriaBootstrapService } from '../../services/vistoria-bootstrap.service';
import { Veiculo } from '../../models/veiculo.model';
import { Motorista } from '../../models/motorista.model';
import {
  TIPO_VISTORIA_OPCOES,
  TipoVistoria,
  Vistoria,
} from '../../models/vistoria.model';
import { SystemService } from '../../services/system.service';
import { AuthService } from '../../services/auth.service';
import { ErrorMessageService } from '../../services/error-message.service';
import {
  exigePercentualNivel,
  mensagemPercentualNivelObrigatorio,
  rotuloPercentualNivel as rotuloPercentualNivelCombustivel,
} from '../../models/combustivel.enum';

@Component({
  selector: 'app-vistoria-inicio',
  standalone: true,
  templateUrl: './vistoria-inicio.page.html',
  styleUrls: ['./vistoria-inicio.page.scss'],
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    IonContent,
    IonFooter,
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
export class VistoriaInicioPage implements OnInit, OnDestroy {
  private veiculoService = inject(VeiculoService);
  private motoristaService = inject(MotoristaService);
  private vistoriaService = inject(VistoriaService);
  private flowService = inject(VistoriaFlowService);
  private bootstrapService = inject(VistoriaBootstrapService);
  private router = inject(Router);
  private systemService = inject(SystemService);
  private authService = inject(AuthService);
  private alertController = inject(AlertController);
  private errorMessageService = inject(ErrorMessageService);

  @ViewChild('odometroInput') private odometroInput?: IonInput;

  veiculos: Veiculo[] = [];
  motoristas: Motorista[] = [];
  vistoriasEmAndamento: Vistoria[] = [];

  veiculoSearch = '';
  motoristaSearch = '';
  selectedVeiculo: Veiculo | null = null;
  selectedMotorista: Motorista | null = null;

  odometro: number | null = null;
  odometroDisplay = '';
  bateria: number | null = null;
  tipo: TipoVistoria = 'CORRETIVA';
  readonly tipoOpcoes = TIPO_VISTORIA_OPCOES;
  ultimoOdometro: number | null = null;
  ultimoOdometroData: string | null = null;
  odometroDiffMaxKm = 500;
  datavistoriaDisplay = '';
  datavistoriaIso = '';

  loadingVeiculos = false;
  loadingMotoristas = false;
  isSaving = false;
  loadingAndamento = false;
  errorMessage = '';
  isNative = Capacitor.getPlatform() !== 'web';
  private scrollFocusTimeout: number | null = null;
  private keyboardFocusListener: (() => void) | null = null;

  constructor() {
    addIcons({ refreshOutline });
  }

  async ngOnInit(): Promise<void> {
    await this.atualizarDataHora();
    await this.carregarParametrosVistoria();

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

  ngOnDestroy(): void {
    this.limparScrollFocusPendente();
  }

  async ionViewWillEnter(): Promise<void> {
    if (this.flowService.getVistoriaId()) {
      this.router.navigate(['/vistoria/areas']);
      return;
    }
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
      const modeloId =
        atualizada.veiculo?.idModelo ??
        atualizada.veiculo?.modeloVeiculo?.id ??
        vistoria.veiculo?.idModelo ??
        vistoria.veiculo?.modeloVeiculo?.id;
      const modeloNome =
        atualizada.veiculo?.modeloVeiculo?.nome ??
        vistoria.veiculo?.modeloVeiculo?.nome;
      this.flowService.iniciar(atualizada.id, {
        numeroVistoria: atualizada.numeroVistoria ?? vistoria.numeroVistoria,
        veiculoId: atualizada.idVeiculo ?? vistoria.idVeiculo,
        veiculoDescricao: atualizada.veiculo?.descricao ?? vistoria.veiculo?.descricao,
        veiculoModeloId: modeloId ?? undefined,
        veiculoModeloNome: modeloNome ?? undefined,
        datavistoria: atualizada.datavistoria ?? vistoria.datavistoria,
      });
      this.router.navigate(['/vistoria/areas']);
    } catch (error: any) {
      this.errorMessage = this.errorMessageService.fromApi(
        error,
        'Nao foi possivel retomar a vistoria. Tente novamente.',
      );
    }
  }

  formatarDataHora24(dateValue?: string | Date | null): string {
    if (!dateValue) {
      return '-';
    }
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
      return '-';
    }
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dd = pad(date.getDate());
    const mm = pad(date.getMonth() + 1);
    const yyyy = date.getFullYear();
    const hh = pad(date.getHours());
    const mi = pad(date.getMinutes());
    return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
  }

  async cancelarVistoriaEmAndamento(vistoria: Vistoria): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Excluir vistoria',
      message: 'Deseja excluir a vistoria?',
      cssClass: 'alert-excluir-vistoria',
      buttons: [
        { text: 'Voltar', role: 'cancel', cssClass: 'alert-button-continuar' },
        { text: 'Excluir vistoria', role: 'confirm', cssClass: 'alert-button-excluir' },
      ],
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
    if (role !== 'confirm') {
      return;
    }

    try {
      await this.vistoriaService.cancelarVistoria(vistoria.id);
      const flowVistoriaId = this.flowService.getVistoriaId();
      if (flowVistoriaId === vistoria.id) {
        this.flowService.finalizar();
      }
      this.bootstrapService.invalidate(vistoria.id);
      await this.atualizarListaEmAndamento();
    } catch (error: any) {
      this.errorMessage = this.errorMessageService.fromApi(
        error,
        'Nao foi possivel excluir a vistoria. Tente novamente.',
      );
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
    this.aplicarOdometroInteiro(value, true);
  }

  onOdometroBlur(): void {
    this.aplicarOdometroInteiro(this.odometroDisplay || this.odometro, true);
    // Sempre força o DOM no blur (ponto/vírgula podem ter ficado na tela).
    void this.sincronizarInputOdometro(this.odometroDisplay);
  }

  /** Remove ponto/vírgula e demais não-dígitos; odômetro só inteiro. */
  private aplicarOdometroInteiro(
    value: string | number | null | undefined,
    forcarDom: boolean,
  ): void {
    const raw = String(value ?? '');
    const digits = raw.replace(/\D/g, '');
    if (!digits) {
      this.odometro = null;
      this.odometroDisplay = '';
      if (forcarDom) {
        void this.sincronizarInputOdometro('');
      }
      return;
    }
    const parsed = Number(digits);
    if (!Number.isFinite(parsed)) {
      this.odometro = null;
      this.odometroDisplay = '';
      if (forcarDom) {
        void this.sincronizarInputOdometro('');
      }
      return;
    }
    this.odometro = parsed;
    this.odometroDisplay = digits;
    if (forcarDom && raw !== digits) {
      void this.sincronizarInputOdometro(digits);
    }
  }

  private async sincronizarInputOdometro(digits: string): Promise<void> {
    const input = this.odometroInput;
    if (!input) {
      return;
    }
    try {
      const native = await input.getInputElement();
      if (native.value !== digits) {
        native.value = digits;
      }
    } catch {
      // Input ainda não montado.
    }
  }

  formatarNumeroSemSeparador(value: number | null): string {
    if (value === null || value === undefined) {
      return 'Sem histórico';
    }
    return Math.trunc(Number(value)).toString();
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
    if (this.odometro === null || this.odometro <= 0) {
      return 'Informe o odômetro.';
    }
    if (this.odometro > 9999999) {
      return 'Odômetro não pode ser maior que 9.999.999.';
    }
    if (this.isBateriaObrigatoria() && (this.bateria === null || this.bateria < 0 || this.bateria > 100)) {
      return mensagemPercentualNivelObrigatorio(this.selectedVeiculo?.combustivel);
    }
    return null;
  }

  async iniciarVistoria(): Promise<void> {
    this.onOdometroBlur();
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
      const vistoria = await this.vistoriaService.iniciarVistoria({
        idusuario: user.id,
        idveiculo: this.selectedVeiculo.id,
        idmotorista: this.selectedMotorista.id,
        odometro: Math.trunc(Number(this.odometro)),
        ...(this.bateria !== null ? { porcentagembateria: Number(this.bateria) } : {}),
        datavistoria: this.datavistoriaIso,
        tipo: this.tipo,
      });
      this.flowService.iniciar(vistoria.id, {
        numeroVistoria: vistoria.numeroVistoria,
        veiculoId: this.selectedVeiculo.id,
        veiculoDescricao: this.selectedVeiculo.descricao,
        veiculoModeloId: this.selectedVeiculo.idModelo ?? this.selectedVeiculo.modeloVeiculo?.id,
        veiculoModeloNome: this.selectedVeiculo.modeloVeiculo?.nome ?? undefined,
        datavistoria: this.datavistoriaIso,
      });
      this.router.navigate(['/vistoria/areas']);
    } catch (error: any) {
      this.errorMessage = this.errorMessageService.fromApi(
        error,
        'Erro ao iniciar vistoria. Tente novamente.',
      );
    } finally {
      this.isSaving = false;
    }
  }

  isBateriaObrigatoria(): boolean {
    return exigePercentualNivel(this.selectedVeiculo?.combustivel);
  }

  get rotuloPercentualNivel(): string {
    return rotuloPercentualNivelCombustivel(this.selectedVeiculo?.combustivel);
  }

  async onCampoFocus(cardId: string): Promise<void> {
    const card = document.getElementById(cardId);
    if (!card) {
      return;
    }
    this.limparScrollFocusPendente();
    await this.rolarCardParaTopo(card);
    this.scrollFocusTimeout = window.setTimeout(() => {
      void this.rolarCardParaTopo(card);
    }, 350);

    this.keyboardFocusListener = () => {
      this.limparScrollFocusPendente();
      window.setTimeout(() => {
        void this.rolarCardParaTopo(card);
      }, 50);
    };
    window.addEventListener('ionKeyboardDidShow', this.keyboardFocusListener, {
      once: true,
    });
  }

  private async rolarCardParaTopo(card: HTMLElement): Promise<void> {
    const contentEl = card.closest('ion-content');
    if (!contentEl || !this.isConteudoRolavel(contentEl)) {
      return;
    }

    const scrollEl = await contentEl.getScrollElement();
    const pagina = card.closest('.ion-page');
    const header = (pagina ?? document).querySelector('ion-header');
    const topoVisivel = header
      ? header.getBoundingClientRect().bottom
      : scrollEl.getBoundingClientRect().top;
    const y =
      scrollEl.scrollTop + card.getBoundingClientRect().top - topoVisivel - 8;
    await contentEl.scrollToPoint(0, Math.max(0, y), 250);
  }

  private isConteudoRolavel(
    el: Element,
  ): el is HTMLElement & {
    getScrollElement: () => Promise<HTMLElement>;
    scrollToPoint: (
      x: number | undefined,
      y: number,
      duration?: number,
    ) => Promise<void>;
  } {
    const candidato = el as HTMLElement & {
      getScrollElement?: () => Promise<HTMLElement>;
      scrollToPoint?: (
        x: number | undefined,
        y: number,
        duration?: number,
      ) => Promise<void>;
    };
    return (
      typeof candidato.getScrollElement === 'function' &&
      typeof candidato.scrollToPoint === 'function'
    );
  }

  private limparScrollFocusPendente(): void {
    if (this.scrollFocusTimeout !== null) {
      window.clearTimeout(this.scrollFocusTimeout);
      this.scrollFocusTimeout = null;
    }
    if (this.keyboardFocusListener) {
      window.removeEventListener('ionKeyboardDidShow', this.keyboardFocusListener);
      this.keyboardFocusListener = null;
    }
  }

  private async carregarParametrosVistoria(): Promise<void> {
    try {
      const params = await this.vistoriaService.getParametros();
      const valor = Number(params?.odometroDiffMaxKm);
      this.odometroDiffMaxKm =
        Number.isFinite(valor) && valor >= 1 ? Math.trunc(valor) : 500;
    } catch {
      this.odometroDiffMaxKm = 500;
    }
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
    if (diff > this.odometroDiffMaxKm) {
      this.errorMessage = `Odômetro não pode ser mais de ${this.odometroDiffMaxKm} km acima do da última vistoria.`;
      return false;
    }
    return true;
  }

}
