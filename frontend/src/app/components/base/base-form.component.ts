import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NotificationService } from '../../services/notification.service';

@Component({
  template: ''
})
export abstract class BaseFormComponent<T> implements OnInit, OnDestroy {
  form!: FormGroup;
  loading = false;
  submitted = false;
  editMode = false;
  entityId?: string;
  
  protected destroy$ = new Subject<void>();
  protected notificationService = inject(NotificationService);

  constructor(protected router: Router) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected abstract initializeForm(): void;
  protected abstract buildFormData(): T;
  protected abstract saveEntity(data: T): Promise<void>;
  protected abstract updateEntity(id: string, data: T): Promise<void>;
  protected abstract loadEntityById(id: string): Promise<void>;

  protected async loadData(): Promise<void> {
    if (this.editMode && this.entityId) {
      this.loading = true;
      try {
        await this.loadEntityById(this.entityId);
      } catch (error) {
        this.handleError(error, 'Erro ao carregar dados');
      } finally {
        this.loading = false;
      }
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field || !field.errors) return '';

    const errors = field.errors;
    
    if (errors['required']) return 'Campo obrigatório';
    if (errors['email']) return 'E-mail inválido';
    if (errors['minlength']) return `Mínimo de ${errors['minlength'].requiredLength} caracteres`;
    if (errors['maxlength']) return `Máximo de ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['min']) return `Valor mínimo: ${errors['min'].min}`;
    if (errors['max']) return `Valor máximo: ${errors['max'].max}`;
    if (errors['pattern']) return 'Formato inválido';
    
    return 'Campo inválido';
  }

  markAllAsTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  resetForm(): void {
    this.form.reset();
    this.submitted = false;
  }

  cancel(): void {
    console.log('🔵 Cancel clicked - navigating to:', this.getListRoute());
    this.router.navigate([this.getListRoute()]);
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;

    if (this.form.invalid) {
      this.markAllAsTouched();
      this.showValidationError();
      return;
    }

    this.loading = true;

    try {
      const formData = this.buildFormData();

      if (this.editMode && this.entityId) {
        await this.updateEntity(this.entityId, formData);
      } else {
        await this.saveEntity(formData);
      }

      // Volta para a listagem SEM exibir mensagem de sucesso
      console.log('✅ Save successful - navigating to:', this.getListRoute());
      this.router.navigate([this.getListRoute()]);
    } catch (error) {
      // Apenas erros são exibidos
      this.handleError(error, 'Erro ao salvar');
    } finally {
      this.loading = false;
    }
  }

  protected getListRoute(): string {
    const componentName = this.constructor.name;
    const entityName = componentName.replace('FormComponent', '').toLowerCase();
    return `/${entityName}`;
  }

  toggleField(fieldName: string, enable: boolean): void {
    const field = this.form.get(fieldName);
    if (field) {
      enable ? field.enable() : field.disable();
    }
  }

  setFieldValue(fieldName: string, value: any): void {
    this.form.get(fieldName)?.setValue(value);
  }

  getFieldValue(fieldName: string): any {
    return this.form.get(fieldName)?.value;
  }

  /**
   * Trata erros do backend com mensagens amigáveis
   */
  protected handleError(error: any, defaultMessage: string): void {
    console.error('❌ ERROR:', error);

    let message = defaultMessage;

    // Verifica se é erro HTTP
    if (error?.status) {
      switch (error.status) {
        case 400: // Bad Request
          message = this.extractErrorMessage(error) || 'Dados inválidos';
          break;
        case 401: // Unauthorized
          message = 'Sessão expirada. Faça login novamente';
          this.router.navigate(['/login']);
          break;
        case 403: // Forbidden
          message = 'Você não tem permissão para realizar esta ação';
          break;
        case 404: // Not Found
          message = 'Registro não encontrado';
          break;
        case 409: // Conflict
          message = this.extractErrorMessage(error) || 'Registro duplicado';
          break;
        case 422: // Unprocessable Entity
          message = this.extractErrorMessage(error) || 'Dados inválidos';
          break;
        case 500: // Internal Server Error
          message = 'Erro no servidor. Tente novamente mais tarde';
          break;
        default:
          message = this.extractErrorMessage(error) || defaultMessage;
      }
    } else {
      message = error?.message || defaultMessage;
    }

    this.notificationService.error(message);
  }

  /**
   * Extrai mensagem de erro do backend
   */
  private extractErrorMessage(error: any): string | null {
    // Formato: { error: { message: "Já existe um veículo com esta placa" } }
    if (error?.error?.message) {
      return error.error.message;
    }

    // Formato: { error: { errors: [{ message: "..." }] } }
    if (error?.error?.errors && Array.isArray(error.error.errors)) {
      return error.error.errors
        .map((e: any) => e.message || e.msg)
        .filter(Boolean)
        .join(', ');
    }

    // Formato: { message: "..." }
    if (error?.message) {
      return error.message;
    }

    // Formato: string direto
    if (typeof error === 'string') {
      return error;
    }

    return null;
  }

  /**
   * Exibe erro de validação de formulário
   */
  protected showValidationError(): void {
    this.notificationService.warning('Por favor, preencha todos os campos obrigatórios');
  }

  /**
   * Exibe mensagem informativa
   */
  protected showInfo(message: string): void {
    this.notificationService.info(message);
  }

  /**
   * Exibe mensagem de sucesso
   */
  protected showSuccess(message: string): void {
    this.notificationService.success(message);
  }

  isEditMode(): boolean {
    return this.editMode;
  }

  isCreateMode(): boolean {
    return !this.editMode;
  }

  getFormTitle(): string {
    return this.editMode ? 'Editar' : 'Nova';
  }

  getSubmitButtonText(): string {
    return this.editMode ? 'Atualizar' : 'Salvar';
  }
}
