import { Component, OnInit, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AlertController,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCheckbox,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import { AuthService } from '../../services/auth.service';
import { ErrorMessageService } from '../../services/error-message.service';
import { IrregularidadeService } from '../../services/irregularidade.service';
import { VeiculoService } from '../../services/veiculo.service';
import {
  IrregularidadeFluxoItem,
  IrregularidadeFluxoMidia,
  StatusIrregularidade,
} from '../../models/irregularidade-fluxo.model';
import { Veiculo } from '../../models/veiculo.model';

interface MidiaView {
  id: string;
  nomeArquivo: string;
  mimeType: string;
  src: string;
  tipo: 'imagem' | 'audio';
}

@Component({
  selector: 'app-validacao-inicio',
  standalone: true,
  templateUrl: './validacao-inicio.page.html',
  styleUrls: ['./validacao-inicio.page.scss'],
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonFooter,
    IonItem,
    IonLabel,
    IonInput,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonSpinner,
    IonText,
    IonCheckbox,
  ],
})
export class ValidacaoInicioPage implements OnInit {
  private veiculoService = inject(VeiculoService);
  private irregularidadeService = inject(IrregularidadeService);
  private authService = inject(AuthService);
  private errorMessageService = inject(ErrorMessageService);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);

  isNative = Capacitor.getPlatform() !== 'web';
  veiculoSearch = '';
  veiculos: Veiculo[] = [];
  loadingVeiculos = false;
  selectedVeiculo: Veiculo | null = null;

  itens: IrregularidadeFluxoItem[] = [];
  loadingLista = false;
  errorMessage = '';
  loteLoading = false;

  selectedIds = new Set<string>();
  expandedMidias = new Set<string>();
  imagemSelecionada: { nomeArquivo: string; src: string } | null = null;

  get canUpdate(): boolean {
    return this.authService.hasPermission(
      'irregularidade_validacao_final_mobile:update',
    );
  }

  get selectedCount(): number {
    return this.selectedIds.size;
  }

  ngOnInit(): void {
    // Lista só após seleção de veículo.
  }

  async onBuscarVeiculos(event: CustomEvent): Promise<void> {
    const value = (event.detail?.value ?? '').toString();
    this.veiculoSearch = value;
    if (!value.trim()) {
      this.veiculos = [];
      this.limparVeiculoSelecionado();
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

  async selecionarVeiculo(veiculo: Veiculo): Promise<void> {
    this.selectedVeiculo = veiculo;
    this.veiculoSearch = veiculo.descricao || veiculo.placa || '';
    this.veiculos = [];
    await this.carregarPendentes();
  }

  limparVeiculoSelecionado(): void {
    this.selectedVeiculo = null;
    this.itens = [];
    this.errorMessage = '';
    this.resetSelecaoEExpansoes();
  }

  async carregarPendentes(): Promise<void> {
    if (!this.selectedVeiculo?.id) {
      this.itens = [];
      return;
    }

    this.loadingLista = true;
    this.errorMessage = '';
    this.resetSelecaoEExpansoes();
    try {
      const response = await this.irregularidadeService.listarPorStatus(
        [StatusIrregularidade.CONCLUIDA],
        {
          idVeiculo: this.selectedVeiculo.id,
          page: 1,
          limit: 100,
        },
      );
      this.itens = response.data ?? [];
    } catch (error: unknown) {
      this.itens = [];
      this.errorMessage = this.errorMessageService.fromApi(
        error,
        'Não foi possível carregar as OS para validação.',
      );
    } finally {
      this.loadingLista = false;
    }
  }

  isSelected(id: string): boolean {
    return this.selectedIds.has(id);
  }

  toggleItem(id: string, checked: boolean): void {
    if (checked) {
      this.selectedIds.add(id);
    } else {
      this.selectedIds.delete(id);
    }
  }

  onCheckboxChange(id: string, event: CustomEvent): void {
    this.toggleItem(id, Boolean(event.detail?.checked));
  }

  quantidadeFotos(item: IrregularidadeFluxoItem): number {
    return item.quantidadeFotos ?? item.fotos?.length ?? 0;
  }

  quantidadeAudios(item: IrregularidadeFluxoItem): number {
    return item.quantidadeAudios ?? item.audios?.length ?? 0;
  }

  isMidiaExpanded(id: string): boolean {
    return this.expandedMidias.has(id);
  }

  toggleMidias(item: IrregularidadeFluxoItem): void {
    if (this.expandedMidias.has(item.id)) {
      this.expandedMidias.delete(item.id);
      return;
    }
    this.expandedMidias.add(item.id);
  }

  getImagens(item: IrregularidadeFluxoItem): MidiaView[] {
    return (item.fotos ?? []).map((foto, index) =>
      this.toMidiaView(foto, 'imagem', item.id, index),
    );
  }

  getAudios(item: IrregularidadeFluxoItem): MidiaView[] {
    return (item.audios ?? []).map((audio, index) =>
      this.toMidiaView(audio, 'audio', item.id, index),
    );
  }

  abrirImagem(midia: MidiaView): void {
    this.imagemSelecionada = {
      nomeArquivo: midia.nomeArquivo,
      src: midia.src,
    };
  }

  fecharImagem(): void {
    this.imagemSelecionada = null;
  }

  textoConclusao(item: IrregularidadeFluxoItem): string {
    const texto = item.observacaoConclusao?.trim();
    return texto || 'Sem registro de conclusão para esta OS.';
  }

  async confirmarValidarLote(): Promise<void> {
    const ids = [...this.selectedIds];
    if (!this.canUpdate || this.loteLoading || !ids.length) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Validar OS',
      message: `Confirma a validação de ${ids.length} OS selecionada(s)?`,
      inputs: [
        {
          name: 'observacao',
          type: 'textarea',
          placeholder: 'Observação (opcional)',
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Validar', role: 'confirm' },
      ],
    });
    await alert.present();
    const { role, data } = await alert.onDidDismiss();
    if (role !== 'confirm') {
      return;
    }

    const observacao = (data?.values?.observacao ?? '').toString().trim();
    await this.executarLote(
      ids,
      (id) =>
        this.irregularidadeService.validarFinal(
          id,
          observacao ? { observacao } : {},
        ),
      'OS validadas com sucesso.',
      'Não foi possível validar todas as OS selecionadas.',
    );
  }

  async confirmarReprovarLote(): Promise<void> {
    const ids = [...this.selectedIds];
    if (!this.canUpdate || this.loteLoading || !ids.length) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Reprovar OS',
      message: `As ${ids.length} OS selecionada(s) voltarão para Retrabalho. Informe a observação obrigatória.`,
      inputs: [
        {
          name: 'observacao',
          type: 'textarea',
          placeholder: 'Observação (obrigatória)',
          attributes: { required: true },
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Reprovar', role: 'confirm' },
      ],
    });
    await alert.present();
    const { role, data } = await alert.onDidDismiss();
    if (role !== 'confirm') {
      return;
    }

    const observacao = (data?.values?.observacao ?? '').toString().trim();
    if (!observacao) {
      this.errorMessage = 'Informe a observação para reprovar as OS.';
      return;
    }

    await this.executarLote(
      ids,
      (id) => this.irregularidadeService.reprovarFinal(id, { observacao }),
      'OS reprovadas e devolvidas para retrabalho/garantia.',
      'Não foi possível reprovar todas as OS selecionadas.',
    );
  }

  rotuloOs(item: IrregularidadeFluxoItem): string {
    const partes: string[] = [];
    if (item.numeroIrregularidade != null) {
      partes.push(`OS ${item.numeroIrregularidade}`);
    }
    if (item.erpCodigoPedido) {
      partes.push(`OMNI ${item.erpCodigoPedido}`);
    }
    if (item.numOsExternoAtual != null) {
      partes.push(`BRT ${item.numOsExternoAtual}`);
    }
    return partes.join(' · ') || 'OS';
  }

  private async executarLote(
    ids: string[],
    action: (id: string) => Promise<unknown>,
    successMessage: string,
    failFallback: string,
  ): Promise<void> {
    this.loteLoading = true;
    this.errorMessage = '';
    const falhas: string[] = [];
    try {
      for (const id of ids) {
        try {
          await action(id);
        } catch (error: unknown) {
          const item = this.itens.find((i) => i.id === id);
          const rotulo = item
            ? this.rotuloOs(item)
            : id.slice(0, 8);
          falhas.push(
            `${rotulo}: ${this.errorMessageService.fromApi(error, 'erro')}`,
          );
        }
      }
      if (falhas.length === 0) {
        await this.mostrarToast(successMessage);
      } else if (falhas.length < ids.length) {
        this.errorMessage = `Parcial: ${ids.length - falhas.length} ok; falhas: ${falhas.join(' | ')}`;
        await this.mostrarToast('Algumas OS foram processadas.');
      } else {
        this.errorMessage = this.errorMessageService.fromApi(
          null,
          `${failFallback} ${falhas.join(' | ')}`,
        );
      }
      await this.carregarPendentes();
    } finally {
      this.loteLoading = false;
    }
  }

  private toMidiaView(
    midia: IrregularidadeFluxoMidia,
    tipo: 'imagem' | 'audio',
    itemId: string,
    index: number,
  ): MidiaView {
    const mimeType =
      midia.mimeType ||
      (tipo === 'imagem' ? 'image/jpeg' : 'audio/mpeg');
    return {
      id: midia.id || `${tipo}-${itemId}-${index}`,
      nomeArquivo: midia.nomeArquivo,
      mimeType,
      tipo,
      src: this.buildMidiaSrc(midia.dadosBase64, mimeType),
    };
  }

  private buildMidiaSrc(dadosBase64: string, mimeType: string): string {
    if (!dadosBase64) {
      return '';
    }
    if (dadosBase64.startsWith('data:')) {
      return dadosBase64;
    }
    return `data:${mimeType};base64,${dadosBase64}`;
  }

  private resetSelecaoEExpansoes(): void {
    this.selectedIds.clear();
    this.expandedMidias.clear();
    this.imagemSelecionada = null;
  }

  private async mostrarToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      color: 'success',
      position: 'bottom',
    });
    await toast.present();
  }
}
