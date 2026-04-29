import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonSpinner, ToastController } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { ErrorMessageService } from '../../services/error-message.service';

type Step = 1 | 2;

@Component({
  selector: 'app-redefinir-senha',
  templateUrl: './redefinir-senha.page.html',
  styleUrls: ['../login/login.page.scss', './redefinir-senha.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonContent, IonSpinner, RouterLink],
})
export class RedefinirSenhaPage {
  private formBuilder = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastController);
  private errorMessageService = inject(ErrorMessageService);

  private readonly strongPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;

  step: Step = 1;
  emailPendente = '';
  isLoading = false;
  errorMessage = '';
  infoMessage = '';
  sucesso = false;
  sucessoMensagem = '';
  /** Aviso após desativar credenciais do login por digital (troca de senha). */
  avisoDigital = '';

  formEmail: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  formConfirmar: FormGroup = this.formBuilder.group({
    code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    newPassword: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(50), Validators.pattern(this.strongPassword)],
    ],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  ionViewWillEnter(): void {
    if (!this.sucesso) {
      this.errorMessage = '';
    }
  }

  onCodeInput(e: Event): void {
    const t = e.target as HTMLInputElement;
    const d = t.value.replace(/\D/g, '').slice(0, 6);
    this.formConfirmar.get('code')?.setValue(d, { emitEvent: false });
    t.value = d;
  }

  async onSubmitEmail(): Promise<void> {
    if (this.formEmail.invalid) {
      this.formEmail.markAllAsTouched();
      return;
    }
    const email = this.formEmail.getRawValue().email.trim();
    this.isLoading = true;
    this.errorMessage = '';
    this.infoMessage = '';
    this.formEmail.disable();
    try {
      const res = await this.auth.requestPasswordReset(email);
      this.emailPendente = email;
      this.infoMessage = res.message;
      this.step = 2;
    } catch (err: unknown) {
      this.errorMessage =
        this.extractApiMessage(err) ??
        this.errorMessageService.fromApi(err, 'Não foi possível enviar a solicitação.');
      const t = await this.toast.create({
        message: this.errorMessage,
        duration: 3500,
        color: 'danger',
        position: 'top',
      });
      await t.present();
    } finally {
      this.isLoading = false;
      this.formEmail.enable();
    }
  }

  async onSubmitConfirmar(): Promise<void> {
    if (this.formConfirmar.invalid) {
      this.formConfirmar.markAllAsTouched();
      return;
    }
    const { code, newPassword, confirmPassword } = this.formConfirmar.getRawValue();
    if (newPassword !== confirmPassword) {
      this.errorMessage = 'As senhas não conferem.';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    this.formConfirmar.disable();
    try {
      const res = await this.auth.confirmPasswordReset({
        email: this.emailPendente,
        code,
        newPassword,
        confirmPassword,
      });
      this.sucesso = true;
      this.sucessoMensagem = res.message;
      try {
        await this.auth.disableBiometricLogin();
      } catch {
        // Credenciais podem estar ausentes; seguir em frente sem bloquear a UX.
      }
      this.avisoDigital =
        'Por segurança, o login por digital foi desativado. Você poderá ativá-lo novamente após entrar com a nova senha.';
    } catch (err: unknown) {
      this.errorMessage =
        this.extractApiMessage(err) ??
        this.errorMessageService.fromApi(err, 'Não foi possível redefinir a senha.');
      const t = await this.toast.create({
        message: this.errorMessage,
        duration: 4000,
        color: 'danger',
        position: 'top',
      });
      await t.present();
    } finally {
      this.isLoading = false;
      this.formConfirmar.enable();
    }
  }

  irParaLogin(): void {
    void this.router.navigate(['/login']);
  }

  voltarEmail(): void {
    this.step = 1;
    this.errorMessage = '';
    this.infoMessage = '';
    this.formEmail.enable();
    this.formConfirmar.reset({
      code: '',
      newPassword: '',
      confirmPassword: '',
    });
    this.formConfirmar.enable();
  }

  private extractApiMessage(err: unknown): string | null {
    const e = err as { error?: { message?: string | string[] } };
    const raw = e?.error?.message;
    if (raw == null) {
      return null;
    }
    return Array.isArray(raw) ? raw[0] ?? null : String(raw);
  }
}
