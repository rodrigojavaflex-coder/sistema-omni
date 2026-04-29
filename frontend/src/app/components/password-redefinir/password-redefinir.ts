import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/index';

type Step = 1 | 2;

interface FormEmail {
  email: FormControl<string>;
}

interface FormConfirmar {
  code: FormControl<string>;
  newPassword: FormControl<string>;
  confirmPassword: FormControl<string>;
}

@Component({
  selector: 'app-password-redefinir',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './password-redefinir.html',
  styleUrls: ['../login/login.css', './password-redefinir.css'],
})
export class PasswordRedefinirComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  step: Step = 1;
  emailPendente = '';
  isLoading = false;
  errorMessage = '';
  infoMessage = '';
  sucesso = false;
  sucessoMensagem = '';

  private readonly strongPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;

  formEmail: FormGroup<FormEmail> = this.fb.group<FormEmail>({
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
  });

  formConfirmar: FormGroup<FormConfirmar> = this.fb.group<FormConfirmar>({
    code: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(/^\d{6}$/)]),
    newPassword: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(50),
      Validators.pattern(this.strongPassword),
    ]),
    confirmPassword: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(6)]),
  });

  get emailF() {
    return this.formEmail.get('email');
  }

  get codeF() {
    return this.formConfirmar.get('code');
  }

  get newPasswordF() {
    return this.formConfirmar.get('newPassword');
  }

  get confirmPasswordF() {
    return this.formConfirmar.get('confirmPassword');
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
    this.isLoading = true;
    this.errorMessage = '';
    this.infoMessage = '';
    this.formEmail.disable();
    try {
      const res = await this.auth.requestPasswordReset(this.formEmail.getRawValue().email.trim());
      this.emailPendente = this.formEmail.getRawValue().email.trim();
      this.infoMessage = res.message;
      this.step = 2;
    } catch (err: unknown) {
      this.errorMessage = this.mensagemDeErro(err, 'Não foi possível enviar a solicitação.');
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
    } catch (err: unknown) {
      this.errorMessage = this.mensagemDeErro(err, 'Não foi possível redefinir a senha.');
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

  private mensagemDeErro(err: unknown, padrao: string): string {
    if (err && typeof err === 'object' && 'error' in err) {
      const e = (err as { error?: { message?: string | string[] } }).error;
      if (e && typeof e === 'object' && e.message) {
        return Array.isArray(e.message) ? e.message[0] : e.message;
      }
    }
    return padrao;
  }
}
