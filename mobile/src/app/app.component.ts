import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Capacitor } from '@capacitor/core';
import {
  AlertController,
  IonApp,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonRouterOutlet,
  IonTitle,
  IonToggle,
  IonToolbar,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';
import { AuthService } from './services/auth.service';
import { Usuario } from './models/usuario.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  styleUrls: ['app.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    IonApp,
    IonRouterOutlet,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonToggle,
    IonButton,
    IonIcon
  ]
})
export class AppComponent {
  private authService = inject(AuthService);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);

  user: Usuario | null = null;
  isAuthenticated = false;
  isNative = Capacitor.getPlatform() !== 'web';
  biometricAvailable = false;
  biometricEnabled = false;
  biometricSaving = false;

  constructor() {
    addIcons({ logOutOutline });

    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });

    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      if (isAuthenticated) {
        this.refreshBiometricState();
      } else {
        this.biometricAvailable = false;
        this.biometricEnabled = false;
      }
    });
  }

  async logout(): Promise<void> {
    await this.authService.logout();
  }

  async onBiometricToggle(event: CustomEvent): Promise<void> {
    if (this.biometricSaving) {
      return;
    }

    const shouldEnable = Boolean(event.detail?.checked);
    if (!shouldEnable) {
      this.biometricSaving = true;
      await this.authService.disableBiometricLogin();
      this.biometricEnabled = false;
      this.biometricSaving = false;
      return;
    }

    if (!this.user?.email) {
      this.biometricEnabled = false;
      await this.presentToast('Não foi possível identificar o usuário atual.');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Ativar login por digital',
      message: 'Confirme sua senha para habilitar o login por biometria.',
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Senha'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Ativar',
          role: 'confirm'
        }
      ]
    });

    await alert.present();
    const { role, data } = await alert.onDidDismiss();
    const password = data?.values?.password?.trim();
    if (role !== 'confirm' || !password) {
      this.biometricEnabled = false;
      return;
    }

    this.biometricSaving = true;
    const enabled = await this.authService.enableBiometricLogin(this.user.email, password);
    this.biometricEnabled = enabled;
    this.biometricSaving = false;

    if (!enabled) {
      await this.presentToast('Não foi possível ativar o login por biometria.');
    }
  }

  private async refreshBiometricState(): Promise<void> {
    this.biometricAvailable = await this.authService.isBiometricAvailable();
    this.biometricEnabled = await this.authService.isBiometricEnabled();
  }

  private async presentToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      color: 'danger',
      position: 'top'
    });
    await toast.present();
  }
}
