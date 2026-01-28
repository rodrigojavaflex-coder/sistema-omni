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
import { Usuario } from '../../models/usuario.model';

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
}
