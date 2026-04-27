import { Component, inject, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { Capacitor } from '@capacitor/core';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonMenuButton,
  IonButtons,
  IonButton
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { Perfil, Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonMenuButton,
    IonButtons,
    IonButton
  ]
})
export class HomePage implements OnInit {
  private authService = inject(AuthService);

  user: Usuario | null = null;
  isNative = Capacitor.getPlatform() !== 'web';

  async ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }

  get canStartVistoria(): boolean {
    return this.authService.hasPermission('vistoria_mobile:create');
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
