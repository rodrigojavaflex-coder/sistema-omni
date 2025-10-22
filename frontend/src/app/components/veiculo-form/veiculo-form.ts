import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { VeiculoService } from '../../services/veiculo.service';
import { CreateVeiculoDto, UpdateVeiculoDto } from '../../models/veiculo.model';
import { Combustivel } from '../../models/veiculo.model';

@Component({
  selector: 'app-veiculo-form',
  standalone: true,
  imports: [CommonModule, NgIf, NgForOf, FormsModule, ReactiveFormsModule],
  templateUrl: './veiculo-form.html',
  styleUrls: ['./veiculo-form.css']
})
export class VeiculoFormComponent implements OnInit {
  veiculoForm: FormGroup;
  isEditMode = false;
  veiculoId?: string;
  loading = false;
  error: string | null = null;
  isSubmitting = false;

  combustivelOptions = Object.values(Combustivel);
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private veiculoService: VeiculoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.veiculoForm = this.createForm();
  }

  ngOnInit(): void {
    this.checkEditMode();
    
    // Limpar mensagem de erro quando o usuário começar a editar
    this.veiculoForm.valueChanges.subscribe(() => {
      if (this.error) {
        this.error = null;
      }
    });
  }

  private createForm(): FormGroup {
    // Regex para placas brasileiras: AAA1234 (antiga) ou AAA1A23 (Mercosul)
    const placaRegex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;

    return this.fb.group({
      descricao: ['', [
        Validators.required, 
        Validators.minLength(3),
        Validators.maxLength(30)
      ]],
      placa: ['', [
        Validators.required, 
        Validators.pattern(placaRegex)
      ]],
      ano: ['', [
        Validators.required, 
        Validators.min(1900), 
        Validators.max(this.currentYear + 1)
      ]],
      chassi: ['', [
        Validators.required, 
        Validators.minLength(17),
        Validators.maxLength(30)
      ]],
      marca: ['', [
        Validators.required, 
        Validators.minLength(2),
        Validators.maxLength(50)
      ]],
      modelo: ['', [
        Validators.required, 
        Validators.minLength(2),
        Validators.maxLength(50)
      ]],
      combustivel: ['', [Validators.required]]
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.veiculoId = id;
      this.loadVeiculo(id);
    } else {
      this.isEditMode = false;
    }
  }

  private loadVeiculo(id: string): void {
    this.loading = true;
    this.veiculoService.getById(id).subscribe({
      next: (v) => {
        this.veiculoForm.patchValue({
          descricao: v.descricao,
          placa: v.placa,
          ano: v.ano,
          chassi: v.chassi,
          marca: v.marca,
          modelo: v.modelo,
          combustivel: v.combustivel
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar veículo:', err);
        this.error = 'Erro ao carregar veículo';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.veiculoForm.invalid || this.isSubmitting) {
      this.markTouched();
      return;
    }
    this.isSubmitting = true;
    const formValue = this.veiculoForm.value;
    // Garantir tipo correto
    formValue.ano = Number(formValue.ano);
    if (this.isEditMode && this.veiculoId) {
      const dto: UpdateVeiculoDto = { ...formValue };
      this.veiculoService.update(this.veiculoId, dto).subscribe({
        next: () => this.router.navigate(['/veiculo']),
        error: (err) => this.handleError(err)
      });
    } else {
      const dto: CreateVeiculoDto = { ...formValue };
      this.veiculoService.create(dto).subscribe({
        next: () => this.router.navigate(['/veiculo']),
        error: (err) => this.handleError(err)
      });
    }
  }

  private handleError(err: any): void {
    console.error('Erro ao salvar veículo:', err);
    this.isSubmitting = false;
    
    // Limpar erro anterior
    this.error = null;
    
    if (err.status === 400) {
      this.error = 'Dados inválidos. Verifique os campos e tente novamente.';
    } else if (err.status === 409) {
      // Erro de conflito - veículo duplicado
      const errorMessage = err.error?.message || 'Veículo já existente';
      this.error = errorMessage;
    } else if (err.status === 500) {
      this.error = 'Erro interno do servidor. Tente novamente em alguns minutos.';
    } else if (err.status === 0) {
      this.error = 'Erro de conexão. Verifique sua internet e tente novamente.';
    } else {
      this.error = 'Erro inesperado. Tente novamente.';
    }
    
    // Scroll para o topo para mostrar a mensagem de erro
    setTimeout(() => {
      const container = document.querySelector('.veiculo-form-container');
      if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  onCancel(): void {
    this.router.navigate(['/veiculo']);
  }

  private markTouched(): void {
    Object.keys(this.veiculoForm.controls).forEach(key => {
      const control = this.veiculoForm.get(key);
      control?.markAsTouched();
    });
  }

  /** Formatação e validação da placa em tempo real */
  onPlacaInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input) return;
    
    // Remover caracteres não alfanuméricos e converter para maiúsculas
    let value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    // Limitar a 7 caracteres (formato brasileiro)
    if (value.length > 7) {
      value = value.substring(0, 7);
    }
    
    // Atualizar o campo do formulário
    this.veiculoForm.get('placa')?.setValue(value, { emitEvent: false });
    
    // Atualizar o valor do input para refletir a formatação
    input.value = value;
  }

  /** Helpers para exibir mensagens de erro no template */
  hasError(controlName: string, errorType: string): boolean {
    const control = this.veiculoForm.get(controlName);
    return !!(control && control.touched && control.hasError(errorType));
  }

  getErrorMessage(controlName: string): string {
    const control = this.veiculoForm.get(controlName);
    if (!control || !control.errors || !control.touched) return '';
    
    const errors = control.errors;
    const fieldLabel = this.getFieldLabel(controlName);
    
    if (errors['required']) return `${fieldLabel} é obrigatório`;
    if (errors['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;
      return `${fieldLabel} deve ter pelo menos ${requiredLength} caracteres`;
    }
    if (errors['maxlength']) {
      const maxLength = errors['maxlength'].requiredLength;
      return `${fieldLabel} não pode ter mais de ${maxLength} caracteres`;
    }
    if (errors['min']) return `${fieldLabel} deve ser maior que ${errors['min'].min}`;
    if (errors['max']) return `${fieldLabel} deve ser menor que ${errors['max'].max}`;
    
    if (errors['pattern']) {
      if (controlName === 'placa') {
        return 'Placa deve estar no formato brasileiro (ABC1234 ou ABC1A23)';
      }
      return `${fieldLabel} inválido`;
    }
    
    return 'Campo inválido';
  }

  private getFieldLabel(controlName: string): string {
    const labels: { [key: string]: string } = {
      descricao: 'Descrição',
      placa: 'Placa',
      ano: 'Ano',
      chassi: 'Chassi',
      marca: 'Marca',
      modelo: 'Modelo',
      combustivel: 'Combustível'
    };
    return labels[controlName] || controlName;
  }

  get descricao() { return this.veiculoForm.get('descricao'); }
  get placa() { return this.veiculoForm.get('placa'); }
  get ano() { return this.veiculoForm.get('ano'); }
}
