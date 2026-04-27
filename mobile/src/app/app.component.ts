import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Capacitor } from '@capacitor/core';
import { Router } from '@angular/router';
import {
  AlertController,
  IonApp,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
  MenuController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  clipboardOutline,
  informationCircleOutline,
  logOutOutline,
  playCircleOutline,
  settingsOutline,
} from 'ionicons/icons';
import { AuthService } from './services/auth.service';
import { Perfil, Usuario } from './models/usuario.model';
import { VistoriaFlowService } from './services/vistoria-flow.service';

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
    IonButtons,
    IonContent,
    IonList,
    IonItem,
    IonButton,
    IonIcon
  ]
})
export class AppComponent {
  private authService = inject(AuthService);
  private flowService = inject(VistoriaFlowService);
  private router = inject(Router);
  private alertController = inject(AlertController);
  private menuController = inject(MenuController);

  fecharMenu(): void {
    this.menuController.close();
  }

  user: Usuario | null = null;
  isAuthenticated = false;
  isNative = Capacitor.getPlatform() !== 'web';

  get canViewHistoricoVeiculo(): boolean {
    return this.authService.hasPermission('vistoria_web_historico_veiculo:read');
  }

  get canStartVistoria(): boolean {
    return this.authService.hasPermission('vistoria_mobile:create');
  }

  get hasVistoriaEmAndamento(): boolean {
    return Boolean(this.flowService.getVistoriaId());
  }

  get profileDisplayName(): string {
    const perfis = this.getUserProfiles();
    if (perfis.length === 0) {
      return 'Sem perfil';
    }
    return perfis.map((perfil) => perfil.nomePerfil).filter(Boolean).join(', ');
  }

  get userAtivo(): boolean {
    if (!this.user) {
      return false;
    }
    if (typeof this.user.ativo === 'boolean') {
      return this.user.ativo;
    }
    return (this.user.status ?? '').toUpperCase() === 'ATIVO';
  }

  constructor() {
    addIcons({
      logOutOutline,
      settingsOutline,
      clipboardOutline,
      informationCircleOutline,
      playCircleOutline,
    });

    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });

    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    });
  }

  async goTo(route: string, state?: Record<string, unknown>): Promise<void> {
    if (
      this.hasVistoriaEmAndamento &&
      (route === '/vistoria/pendencias-veiculo' || route === '/configuracoes' || route === '/sobre')
    ) {
      return;
    }
    await this.menuController.close();
    await this.router.navigate([route], state ? { state } : undefined);
  }

  async logout(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Sair do aplicativo',
      message: 'Deseja realmente sair?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Sair',
          role: 'confirm',
        },
      ],
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
    if (role !== 'confirm') {
      return;
    }

    await this.authService.logout();
  }

  private getUserProfiles(): Perfil[] {
    if (!this.user) {
      return [];
    }
    if (Array.isArray(this.user.perfis) && this.user.perfis.length > 0) {
      return this.user.perfis;
    }
    if (this.user.perfil) {
      return [this.user.perfil];
    }
    return [];
  }
}
