import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import {
  AlertController,
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonButtons,
  IonMenuButton,
  IonSpinner,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { VistoriaFlowService } from '../../services/vistoria-flow.service';
import { VistoriaService } from '../../services/vistoria.service';

@Component({
  selector: 'app-vistoria-finalizar',
  standalone: true,
  templateUrl: './vistoria-finalizar.page.html',
  styleUrls: ['./vistoria-finalizar.page.scss'],
  imports: [
    NgIf,
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
    IonSpinner,
    IonText,
  ],
})
export class VistoriaFinalizarPage implements OnInit {
  private flowService = inject(VistoriaFlowService);
  private vistoriaService = inject(VistoriaService);
  private router = inject(Router);
  private alertController = inject(AlertController);

  observacao = '';
  tempoMinutos = 0;
  isSaving = false;
  errorMessage = '';
  isNative = Capacitor.getPlatform() !== 'web';

  ngOnInit(): void {
    this.tempoMinutos = this.flowService.getTempoEmMinutos();
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
      this.flowService.finalizar();
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.errorMessage = error?.message || 'Erro ao finalizar vistoria.';
    } finally {
      this.isSaving = false;
    }
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
}
