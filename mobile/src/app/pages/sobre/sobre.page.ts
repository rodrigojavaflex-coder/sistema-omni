import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-sobre',
  standalone: true,
  templateUrl: './sobre.page.html',
  styleUrls: ['./sobre.page.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonButton,
    IonContent,
    IonCard,
    IonCardContent,
  ],
})
export class SobrePage implements OnInit {
  private router = inject(Router);

  appName = 'OMNI';
  appVersion = '-';
  buildVersion = '-';

  async ngOnInit(): Promise<void> {
    try {
      const info = await App.getInfo();
      this.appName = info.name || this.appName;
      this.appVersion = info.version || '-';
      this.buildVersion = info.build || '-';
    } catch {
      this.appName = 'OMNI';
      this.appVersion = '-';
      this.buildVersion = '-';
    }
  }

  voltar(): void {
    this.router.navigate(['/home']);
  }
}
