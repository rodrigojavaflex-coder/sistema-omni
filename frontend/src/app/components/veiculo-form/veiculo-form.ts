import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { FormsModule, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { VeiculoService } from '../../services/veiculo.service';
import { CreateVeiculoDto, UpdateVeiculoDto, StatusVeiculo } from '../../models/veiculo.model';
import { Combustivel } from '../../models/combustivel.enum';
import { BaseFormComponent } from '../base/base-form.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-veiculo-form',
  standalone: true,
  imports: [CommonModule, NgIf, NgForOf, FormsModule, ReactiveFormsModule],
  templateUrl: './veiculo-form.html',
  styleUrls: ['./veiculo-form.css']
})
export class VeiculoFormComponent extends BaseFormComponent<CreateVeiculoDto | UpdateVeiculoDto> implements OnInit {
  combustivelOptions = Object.values(Combustivel);
  statusOptions = Object.values(StatusVeiculo);
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private veiculoService: VeiculoService,
    private route: ActivatedRoute,
    router: Router
  ) {
    super(router);
  }

  override ngOnInit(): void {
    // Verifica se está em modo edição
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.entityId = id;
    }

    super.ngOnInit();
  }

  // Implementação dos métodos abstratos

  protected initializeForm(): void {
    // Regex para placas brasileiras: AAA1234 (antiga) ou AAA1A23 (Mercosul)
    const placaRegex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;

    this.form = this.fb.group({
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
      combustivel: ['', [Validators.required]],
      status: [StatusVeiculo.ATIVO],
      marcaDaCarroceria: ['', [Validators.maxLength(50)]],
      modeloDaCarroceria: ['', [Validators.maxLength(50)]]
    });
  }

  protected buildFormData(): CreateVeiculoDto | UpdateVeiculoDto {
    const formValue = this.form.value;
    return {
      ...formValue,
      ano: Number(formValue.ano)
    };
  }

  protected async saveEntity(data: CreateVeiculoDto | UpdateVeiculoDto): Promise<void> {
    await firstValueFrom(this.veiculoService.create(data as CreateVeiculoDto));
  }

  protected async updateEntity(id: string, data: CreateVeiculoDto | UpdateVeiculoDto): Promise<void> {
    await firstValueFrom(this.veiculoService.update(id, data as UpdateVeiculoDto));
  }

  protected async loadEntityById(id: string): Promise<void> {
    const veiculo = await firstValueFrom(this.veiculoService.getById(id));
    this.form.patchValue({
      descricao: veiculo.descricao,
      placa: veiculo.placa,
      ano: veiculo.ano,
      chassi: veiculo.chassi,
      marca: veiculo.marca,
      modelo: veiculo.modelo,
      combustivel: veiculo.combustivel,
      status: veiculo.status || StatusVeiculo.ATIVO,
      marcaDaCarroceria: veiculo.marcaDaCarroceria || '',
      modeloDaCarroceria: veiculo.modeloDaCarroceria || ''
    });

    // Formatar placa no input após carregar
    setTimeout(() => {
      const placaInput = document.querySelector('input[formControlName="placa"]') as HTMLInputElement;
      if (placaInput && veiculo.placa) {
        placaInput.value = this.formatPlacaDisplay(veiculo.placa);
      }
    }, 0);
  }

  // Sobrescreve o método para garantir a rota correta
  protected override getListRoute(): string {
    return '/veiculo';
  }

  // Métodos específicos do componente

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
    
    // Adicionar hífen na posição correta
    let formattedValue = value;
    if (value.length > 3) {
      formattedValue = value.substring(0, 3) + '-' + value.substring(3);
    }
    
    // Atualizar o campo do formulário (sem hífen para validação)
    this.form.get('placa')?.setValue(value, { emitEvent: false });
    
    // Atualizar o valor do input para refletir a formatação visual
    input.value = formattedValue;
  }

  /** Formatar placa ao carregar dados */
  private formatPlacaDisplay(placa: string): string {
    if (!placa || placa.length < 4) return placa;
    return placa.substring(0, 3) + '-' + placa.substring(3);
  }

  // Getters para facilitar acesso no template
  get descricao() { return this.form.get('descricao'); }
  get placa() { return this.form.get('placa'); }
  get ano() { return this.form.get('ano'); }
  get status() { return this.form.get('status'); }
  get marcaDaCarroceria() { return this.form.get('marcaDaCarroceria'); }
  get modeloDaCarroceria() { return this.form.get('modeloDaCarroceria'); }
}
