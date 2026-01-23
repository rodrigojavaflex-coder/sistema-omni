import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonSpinner,
  IonIcon,
  ToastController,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { fingerPrintOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonSpinner,
    IonIcon
  ]
})
export class LoginPage implements OnInit {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastController = inject(ToastController);
  private alertController = inject(AlertController);

  loginForm: FormGroup;
  isLoading = false;
  isBiometricLoading = false;
  errorMessage = '';
  biometricAvailable = false;
  biometricEnabled = false;

  constructor() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    addIcons({ fingerPrintOutline });
  }

  async ngOnInit(): Promise<void> {
    await this.refreshBiometricState();
  }

  ionViewWillEnter(): void {
    this.loginForm.reset({ email: '', password: '' });
    this.errorMessage = '';
    this.isLoading = false;
    this.isBiometricLoading = false;
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    // Desabilitar controles durante o loading
    this.loginForm.disable();

    try {
      const { email, password } = this.loginForm.value;
      await this.authService.login(email, password, { navigate: false });
      await this.maybeEnableBiometrics(email, password);
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.errorMessage = error.message || 'Erro ao fazer login';
      const toast = await this.toastController.create({
        message: this.errorMessage,
        duration: 3000,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
    } finally {
      this.isLoading = false;
      // Reabilitar controles após o loading
      this.loginForm.enable();
    }
  }

  async onBiometricLogin(): Promise<void> {
    if (this.isBiometricLoading || this.isLoading) {
      return;
    }

    this.isBiometricLoading = true;
    this.errorMessage = '';

    try {
      await this.authService.loginWithBiometrics();
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.errorMessage = error.message || 'Erro ao autenticar com biometria';
      const toast = await this.toastController.create({
        message: this.errorMessage,
        duration: 3000,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
    } finally {
      this.isBiometricLoading = false;
    }
  }

  private async refreshBiometricState(): Promise<void> {
    this.biometricAvailable = await this.authService.isBiometricAvailable();
    this.biometricEnabled = await this.authService.isBiometricEnabled();
  }

  private async maybeEnableBiometrics(email: string, password: string): Promise<void> {
    await this.refreshBiometricState();
    if (!this.biometricAvailable || this.biometricEnabled) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Ativar login por digital?',
      message: 'Você poderá entrar mais rápido usando a biometria.',
      buttons: [
        {
          text: 'Agora não',
          role: 'cancel'
        },
        {
          text: 'Ativar',
          role: 'confirm'
        }
      ]
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
    if (role === 'confirm') {
      const enabled = await this.authService.enableBiometricLogin(email, password);
      this.biometricEnabled = enabled;
    }
  }
}
