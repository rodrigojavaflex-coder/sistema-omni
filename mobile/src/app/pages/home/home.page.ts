import { Component, inject, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { Capacitor } from '@capacitor/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonMenuButton,
  IonButtons
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
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonMenuButton,
    IonButtons
  ]
})
export class HomePage implements OnInit {
  private authService = inject(AuthService);

  user: Usuario | null = null;
  isNative = Capacitor.getPlatform() !== 'web';

  async ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }
}
