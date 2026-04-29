import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent,
  IonSpinner,
  IonIcon,
  ToastController,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { fingerPrintOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { ErrorMessageService } from '../../services/error-message.service';

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
    IonIcon,
    RouterLink,
  ],
})
export class LoginPage implements OnInit {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastController = inject(ToastController);
  private alertController = inject(AlertController);
  private errorMessageService = inject(ErrorMessageService);

  loginForm: FormGroup;
  isLoading = false;
  isBiometricLoading = false;
  errorMessage = '';
  biometricAvailable = false;
  biometricEnabled = false;

  constructor() {
    const pwdValidators = [Validators.required, Validators.minLength(6)];
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', pwdValidators],
    });

    addIcons({ fingerPrintOutline });
  }

  async ngOnInit(): Promise<void> {
    await this.refreshBiometricState();
  }

  async ionViewWillEnter(): Promise<void> {
    this.loginForm.reset({ email: '', password: '' });
    this.errorMessage = '';
    this.isLoading = false;
    this.isBiometricLoading = false;
    await this.refreshBiometricState();
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.loginForm.disable();

    try {
      const email = this.loginForm.get('email')!.value.trim();
      const password = this.loginForm.get('password')!.value;
      await this.authService.login(email, password, { navigate: false });
      await this.maybeEnableBiometrics(email, password);
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.errorMessage = this.errorMessageService.fromApi(
        error,
        'Erro ao fazer login. Tente novamente.',
      );
      const toast = await this.toastController.create({
        message: this.errorMessage,
        duration: 3000,
        color: 'danger',
        position: 'top',
      });
      await toast.present();
    } finally {
      this.isLoading = false;
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
      this.errorMessage = this.errorMessageService.fromApi(
        error,
        'Erro ao autenticar com biometria. Tente novamente.',
      );
      await this.refreshBiometricState();
      const toast = await this.toastController.create({
        message: this.errorMessage,
        duration: 3000,
        color: 'danger',
        position: 'top',
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
          role: 'cancel',
        },
        {
          text: 'Ativar',
          role: 'confirm',
        },
      ],
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
    if (role === 'confirm') {
      const enabled = await this.authService.enableBiometricLogin(email, password);
      this.biometricEnabled = enabled;
    }
  }
}
