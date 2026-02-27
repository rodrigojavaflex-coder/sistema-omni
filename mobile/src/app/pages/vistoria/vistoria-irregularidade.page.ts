import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonTextarea,
  IonText,
  IonTitle,
  IonToolbar,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cameraOutline, trashOutline } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import { MatrizCriticidadeService } from '../../services/matriz-criticidade.service';
import { VistoriaFlowService } from '../../services/vistoria-flow.service';
import { VistoriaService } from '../../services/vistoria.service';
import { MatrizCriticidade } from '../../models/matriz-criticidade.model';

interface FotoIrregularidade {
  nomeArquivo: string;
  tamanho: number;
  dadosBase64: string;
  preview: string;
}

@Component({
  selector: 'app-vistoria-irregularidade',
  standalone: true,
  templateUrl: './vistoria-irregularidade.page.html',
  styleUrls: ['./vistoria-irregularidade.page.scss'],
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonText,
    IonTextarea,
    IonSpinner,
  ],
})
export class VistoriaIrregularidadePage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private matrizService = inject(MatrizCriticidadeService);
  private flowService = inject(VistoriaFlowService);
  private vistoriaService = inject(VistoriaService);

  @ViewChild('observacaoInput', { read: IonTextarea })
  observacaoInput?: IonTextarea;

  areaId = '';
  componenteId = '';
  areaNome = '';
  componenteNome = '';

  matriz: MatrizCriticidade[] = [];
  selectedMatriz: MatrizCriticidade | null = null;
  observacao = '';
  fotos: FotoIrregularidade[] = [];
  audioBase64?: string;
  audioMimeType?: string;
  audioDurationMs?: number;
  gravandoAudio = false;
  podeGravarAudio = true;
  loading = false;
  saving = false;
  errorMessage = '';
  isNative = Capacitor.getPlatform() !== 'web';

  constructor() {
    addIcons({ cameraOutline, trashOutline });
  }

  async ngOnInit(): Promise<void> {
    const vistoriaId = this.flowService.getVistoriaId();
    if (!vistoriaId) {
      this.router.navigate(['/vistoria/inicio']);
      return;
    }

    this.areaId = this.route.snapshot.paramMap.get('areaId') ?? '';
    this.componenteId = this.route.snapshot.paramMap.get('componenteId') ?? '';
    if (!this.areaId || !this.componenteId) {
      this.router.navigate(['/vistoria/areas']);
      return;
    }
    const state = this.router.getCurrentNavigation()?.extras?.state as
      | { areaNome?: string; componenteNome?: string }
      | undefined;
    this.areaNome = state?.areaNome ?? 'Área';
    this.componenteNome = state?.componenteNome ?? 'Componente';

    this.loading = true;
    try {
      await this.vistoriaService.getById(vistoriaId);
      this.matriz = await this.matrizService.listarPorComponente(this.componenteId);
      const canRecord = await VoiceRecorder.canDeviceVoiceRecord();
      this.podeGravarAudio = canRecord.value === true;
    } catch {
      this.errorMessage = 'Erro ao carregar sintomas.';
    } finally {
      this.loading = false;
    }
  }

  selecionarSintoma(item: MatrizCriticidade): void {
    this.selectedMatriz = item;
  }

  async adicionarFoto(): Promise<void> {
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
    const area = this.sanitizeFilename(this.areaNome ?? 'area');
    const componente = this.sanitizeFilename(this.componenteNome ?? 'componente');
    const imageIndex = this.fotos.length + 1;
    const nomeArquivo = `${veiculo}_${area}_${componente}_${data}_IMG_${imageIndex}.jpg`;
    const tamanho = this.estimateBase64Size(base64);

    this.fotos.push({
      nomeArquivo,
      tamanho,
      dadosBase64: base64,
      preview: `data:image/jpeg;base64,${base64}`,
    });
  }

  removerFoto(index: number): void {
    this.fotos.splice(index, 1);
  }

  async iniciarAudio(): Promise<void> {
    try {
      const permission = await VoiceRecorder.hasAudioRecordingPermission();
      if (!permission.value) {
        const request = await VoiceRecorder.requestAudioRecordingPermission();
        if (!request.value) {
          this.errorMessage = 'Permissão de áudio negada.';
          return;
        }
      }
      await VoiceRecorder.startRecording();
      this.gravandoAudio = true;
    } catch {
      this.errorMessage = 'Não foi possível iniciar a gravação.';
    }
  }

  async pararAudio(): Promise<void> {
    try {
      const result = await VoiceRecorder.stopRecording();
      this.audioBase64 = result.value.recordDataBase64;
      this.audioMimeType = result.value.mimeType;
      this.audioDurationMs = result.value.msDuration;
      this.gravandoAudio = false;
    } catch {
      this.errorMessage = 'Não foi possível finalizar a gravação.';
      this.gravandoAudio = false;
    }
  }

  limparAudio(): void {
    this.audioBase64 = undefined;
    this.audioMimeType = undefined;
    this.audioDurationMs = undefined;
  }

  async salvarIrregularidade(): Promise<void> {
    const vistoriaId = this.flowService.getVistoriaId();
    if (!vistoriaId || !this.selectedMatriz) {
      this.errorMessage = 'Selecione um sintoma.';
      return;
    }

    if (this.selectedMatriz.exigeFoto && this.fotos.length === 0) {
      this.errorMessage = 'Foto obrigatória para este sintoma.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    try {
      const irregularidade = await this.vistoriaService.criarIrregularidade(vistoriaId, {
        idarea: this.areaId,
        idcomponente: this.componenteId,
        idsintoma: this.selectedMatriz.idSintoma,
        observacao: this.observacao?.trim() || undefined,
      });

      if (this.fotos.length > 0) {
        const files = this.fotos.map((foto) => ({
          nomeArquivo: foto.nomeArquivo,
          blob: this.base64ToBlob(foto.dadosBase64),
        }));
        await this.vistoriaService.uploadIrregularidadeImagens(irregularidade.id, files);
      }

      if (this.audioBase64 && this.selectedMatriz.permiteAudio) {
        const blob = this.base64ToBlob(this.audioBase64, this.audioMimeType || 'audio/m4a');
        await this.vistoriaService.uploadIrregularidadeAudio(
          irregularidade.id,
          blob,
          `audio_${Date.now()}.m4a`,
          this.audioDurationMs,
        );
      }

      this.router.navigate([`/vistoria/areas/${this.areaId}`], {
        state: { areaNome: this.areaNome },
      });
    } catch (error: any) {
      this.errorMessage = error?.message || 'Erro ao salvar irregularidade.';
    } finally {
      this.saving = false;
    }
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

  private base64ToBlob(base64: string, mimeType = 'application/octet-stream'): Blob {
    const byteString = atob(base64);
    const bytes = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i += 1) {
      bytes[i] = byteString.charCodeAt(i);
    }
    return new Blob([bytes], { type: mimeType });
  }
}
