import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AlertController,
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonButtons,
  IonMenuButton,
  IonProgressBar,
  IonSpinner,
  IonTextarea,
  IonTitle,
  IonToolbar,
  IonText,
  IonIcon,
  IonChip,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  cameraOutline,
  trashOutline,
  checkmarkCircle,
  arrowBackOutline,
  arrowForwardOutline,
} from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { VistoriaFlowService } from '../../services/vistoria-flow.service';
import { ItemVistoriadoService } from '../../services/item-vistoriado.service';
import { VistoriaService } from '../../services/vistoria.service';
import { ItemVistoriado } from '../../models/item-vistoriado.model';

interface FotoChecklist {
  nomeArquivo: string;
  tamanho: number;
  dadosBase64: string;
  preview: string;
}

@Component({
  selector: 'app-vistoria-checklist',
  standalone: true,
  templateUrl: './vistoria-checklist.page.html',
  styleUrls: ['./vistoria-checklist.page.scss'],
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonItem,
    IonLabel,
    IonTextarea,
    IonButton,
    IonList,
    IonProgressBar,
    IonSpinner,
    IonText,
    IonIcon,
    IonChip,
  ],
})
export class VistoriaChecklistPage implements OnInit {
  private flowService = inject(VistoriaFlowService);
  private itemService = inject(ItemVistoriadoService);
  private vistoriaService = inject(VistoriaService);
  private router = inject(Router);
  private alertController = inject(AlertController);

  @ViewChild('observacaoInput', { read: IonTextarea })
  observacaoInput?: IonTextarea;

  itens: ItemVistoriado[] = [];
  currentIndex = 0;
  currentConforme = true;
  currentObservacao = '';
  currentSituacao: 'conforme' | 'nao' = 'conforme';
  itemFotos: Record<string, FotoChecklist[]> = {};
  itemState: Record<string, { observacao: string; conforme: boolean }> = {};
  savedIds = new Set<string>();

  loadingItens = false;
  isSaving = false;
  errorMessage = '';
  isNative = Capacitor.getPlatform() !== 'web';

  constructor() {
    addIcons({
      cameraOutline,
      trashOutline,
      checkmarkCircle,
      arrowBackOutline,
      arrowForwardOutline,
    });
  }

  async ngOnInit(): Promise<void> {
    const tipoId = this.flowService.getTipoVistoriaId();
    const vistoriaId = this.flowService.getVistoriaId();
    if (!tipoId) {
      this.router.navigate(['/vistoria/inicio']);
      return;
    }

    this.loadingItens = true;
    try {
      this.itens = await this.itemService.getAtivosPorTipo(tipoId);
      this.itens.sort((a, b) => a.sequencia - b.sequencia);
      if (vistoriaId) {
        const salvos = await this.vistoriaService.listarChecklist(vistoriaId);
        salvos.forEach((salvo) => {
          this.itemState[salvo.iditemvistoriado] = {
            conforme: salvo.conforme,
            observacao: salvo.observacao ?? '',
          };
          this.savedIds.add(salvo.iditemvistoriado);
        });
        const imagens = await this.vistoriaService.listarChecklistImagens(vistoriaId);
        imagens.forEach((item) => {
          this.itemFotos[item.iditemvistoriado] = item.imagens.map((imagem) => ({
            nomeArquivo: imagem.nomeArquivo,
            tamanho: imagem.tamanho,
            dadosBase64: imagem.dadosBase64,
            preview: `data:image/jpeg;base64,${imagem.dadosBase64}`,
          }));
        });
        if (salvos.length > 0) {
          const ultimoSalvo = salvos[0];
          const index = this.itens.findIndex(
            (item) => item.id === ultimoSalvo.iditemvistoriado,
          );
          if (index >= 0) {
            this.currentIndex = index;
          }
        }
      }
      this.resetItemState();
    } catch {
      this.errorMessage = 'Erro ao carregar checklist.';
    } finally {
      this.loadingItens = false;
    }
  }

  get currentItem(): ItemVistoriado | null {
    return this.itens[this.currentIndex] ?? null;
  }

  get progress(): number {
    if (this.itens.length === 0) {
      return 0;
    }
    return (this.currentIndex + 1) / this.itens.length;
  }

  get currentFotos(): FotoChecklist[] {
    const item = this.currentItem;
    if (!item) {
      return [];
    }
    return this.itemFotos[item.id] ?? [];
  }

  async adicionarFoto(): Promise<void> {
    const item = this.currentItem;
    if (!item) {
      return;
    }

    const photo = await Camera.getPhoto({
      quality: 60,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      width: 1024,
      height: 1024,
      correctOrientation: true,
    });

    if (!photo.base64String) {
      return;
    }

    const base64 = photo.base64String;
    const veiculo = this.sanitizeFilename(
      this.flowService.getVeiculoDescricao() ?? 'veiculo',
    );
    const data = this.formatDateFilename(
      this.flowService.getDataVistoriaIso() ?? new Date().toISOString(),
    );
    const itemNome = this.sanitizeFilename(item.descricao ?? 'item');
    const imageIndex = (this.itemFotos[item.id]?.length ?? 0) + 1;
    const nomeArquivo = `${veiculo}_${itemNome}_${data}_IMG_${imageIndex}.jpg`;
    const tamanho = this.estimateBase64Size(base64);

    const foto: FotoChecklist = {
      nomeArquivo,
      tamanho,
      dadosBase64: base64,
      preview: `data:image/jpeg;base64,${base64}`,
    };

    const fotos = this.itemFotos[item.id] ?? [];
    fotos.push(foto);
    this.itemFotos[item.id] = fotos;
  }

  removerFoto(index: number): void {
    const item = this.currentItem;
    if (!item) {
      return;
    }
    const fotos = this.itemFotos[item.id] ?? [];
    fotos.splice(index, 1);
    this.itemFotos[item.id] = fotos;
  }

  async salvarItem(): Promise<void> {
    const item = this.currentItem;
    const vistoriaId = this.flowService.getVistoriaId();
    if (!item || !vistoriaId) {
      return;
    }

    if (!this.currentConforme && item.obrigafoto && this.currentFotos.length === 0) {
      this.errorMessage = 'Foto obrigatória para item não conforme.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    try {
      const checklist = await this.vistoriaService.salvarChecklistItem(vistoriaId, {
        iditemvistoriado: item.id,
        conforme: this.currentConforme,
        observacao: this.currentObservacao?.trim() || undefined,
      });

      if (this.currentFotos.length > 0) {
        const files = this.currentFotos.map((foto) => ({
          nomeArquivo: foto.nomeArquivo,
          blob: this.base64ToBlob(foto.dadosBase64),
        }));
        await this.vistoriaService.uploadChecklistImagens(
          vistoriaId,
          checklist.id,
          files,
        );
      }
      this.savedIds.add(item.id);
      this.proximo();
    } catch (error: any) {
      this.errorMessage = error?.message || 'Erro ao salvar item.';
    } finally {
      this.isSaving = false;
    }
  }

  anterior(): void {
    if (this.currentIndex > 0) {
      this.persistCurrentState();
      this.currentIndex -= 1;
      this.resetItemState();
    }
  }

  proximo(): void {
    if (this.currentIndex < this.itens.length - 1) {
      this.persistCurrentState();
      this.currentIndex += 1;
      this.resetItemState();
      return;
    }
    this.router.navigate(['/vistoria/finalizar']);
  }

  async cancelarVistoria(): Promise<void> {
    const vistoriaId = this.flowService.getVistoriaId();
    if (!vistoriaId) {
      return;
    }
    const alert = await this.alertController.create({
      header: 'Cancelar vistoria?',
      message: 'Os itens já registrados serão mantidos como cancelados.',
      buttons: [
        { text: 'Voltar', role: 'cancel' },
        {
          text: 'Cancelar vistoria',
          role: 'destructive',
          handler: async () => {
            await this.vistoriaService.cancelarVistoria(vistoriaId);
            this.flowService.finalizar();
            this.router.navigate(['/home']);
          },
        },
      ],
    });
    await alert.present();
  }

  private resetItemState(): void {
    const item = this.currentItem;
    if (!item) {
      return;
    }
    const savedState = this.itemState[item.id];
    this.currentConforme = savedState?.conforme ?? true;
    this.currentObservacao = savedState?.observacao ?? '';
    this.currentSituacao = this.currentConforme ? 'conforme' : 'nao';
    this.errorMessage = '';
    if (!this.itemFotos[item.id]) {
      this.itemFotos[item.id] = [];
    }

    // Força limpeza visual do textarea ao trocar de item
    setTimeout(() => {
      const input = this.observacaoInput;
      if (!input) {
        return;
      }
      input.value = this.currentObservacao;
      input
        .getInputElement()
        .then((el) => {
          el.value = this.currentObservacao;
        })
        .catch(() => undefined);
    }, 0);
  }

  private persistCurrentState(): void {
    const item = this.currentItem;
    if (!item) {
      return;
    }
    this.itemState[item.id] = {
      observacao: this.currentObservacao,
      conforme: this.currentConforme,
    };
  }

  setSituacao(value: 'conforme' | 'nao'): void {
    this.currentSituacao = value === 'nao' ? 'nao' : 'conforme';
    this.currentConforme = this.currentSituacao === 'conforme';
  }

  private estimateBase64Size(base64: string): number {
    const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
    return Math.floor((base64.length * 3) / 4) - padding;
  }

  private sanitizeFilename(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9-_]+/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_+|_+$/g, '')
      .toLowerCase();
  }

  private formatDateFilename(dateValue: string): string {
    const date = new Date(dateValue);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dd = pad(date.getDate());
    const mm = pad(date.getMonth() + 1);
    const yyyy = date.getFullYear();
    return `${dd}${mm}${yyyy}`;
  }

  formatarTamanho(bytes: number): string {
    const mb = bytes / 1048576;
    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    }
    const kb = bytes / 1024;
    return `${kb.toFixed(1)} KB`;
  }

  private base64ToBlob(base64: string): Blob {
    const byteString = atob(base64);
    const bytes = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i += 1) {
      bytes[i] = byteString.charCodeAt(i);
    }
    return new Blob([bytes], { type: 'image/jpeg' });
  }
}
