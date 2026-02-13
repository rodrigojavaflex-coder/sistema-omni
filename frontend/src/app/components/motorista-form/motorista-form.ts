import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../base/base-form.component';
import { MotoristaService } from '../../services/motorista.service';
import { EmpresaTerceiraService } from '../../services/empresa-terceira.service';
import { CreateMotoristaDto, UpdateMotoristaDto, Sexo, Terceirizado, StatusMotorista } from '../../models';
import { firstValueFrom } from 'rxjs';
import { EmpresaTerceira } from '../../models/empresa-terceira.model';

@Component({
  selector: 'app-motorista-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './motorista-form.html',
  styleUrls: ['./motorista-form.css']
})
export class MotoristaFormComponent extends BaseFormComponent<CreateMotoristaDto | UpdateMotoristaDto> implements OnInit {
  private empresaService = inject(EmpresaTerceiraService);

  sexoOptions = Object.values(Sexo);
  terceirizadoOptions = Object.values(Terceirizado);
  statusOptions = Object.values(StatusMotorista);
  empresas: EmpresaTerceira[] = [];

  constructor(
    private fb: FormBuilder,
    private motoristaService: MotoristaService,
    private route: ActivatedRoute,
    router: Router
  ) {
    super(router);
  }

  override ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.entityId = id;
    }
    this.empresaService.getAll().subscribe((list) => (this.empresas = list));
    super.ngOnInit();
  }

  protected initializeForm(): void {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(300)]],
      matricula: ['', [Validators.required, Validators.maxLength(30)]],
      dataNascimento: ['', Validators.required],
      dataHabilitacao: ['', Validators.required],
      validadeDaHabilitacao: ['', Validators.required],
      dataAdmissao: ['', Validators.required],
      dataCursoTransporte: [''],
      dataExameToxicologico: [''],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
      identidade: ['', Validators.maxLength(40)],
      sexo: [''],
      endereco: ['', Validators.maxLength(300)],
      bairro: ['', Validators.maxLength(100)],
      cidade: ['', Validators.maxLength(100)],
      cep: ['', Validators.maxLength(10)],
      telefone: ['', Validators.maxLength(20)],
      celular: ['', Validators.maxLength(20)],
      terceirizado: [''],
      status: ['Ativo', Validators.required],
      idEmpresa: ['']
    });
  }

  protected buildFormData(): CreateMotoristaDto | UpdateMotoristaDto {
    const formValue = this.form.value;
    
    // Remover campos opcionais vazios (converter '' para undefined)
    const data: any = { ...formValue };
    
    // Campos de data opcionais
    if (!data.dataCursoTransporte) delete data.dataCursoTransporte;
    if (!data.dataExameToxicologico) delete data.dataExameToxicologico;
    
    // Outros campos opcionais
    if (!data.email) delete data.email;
    if (!data.identidade) delete data.identidade;
    if (!data.sexo) delete data.sexo;
    if (!data.endereco) delete data.endereco;
    if (!data.bairro) delete data.bairro;
    if (!data.cidade) delete data.cidade;
    if (!data.cep) delete data.cep;
    if (!data.telefone) delete data.telefone;
    if (!data.celular) delete data.celular;
    if (!data.terceirizado) delete data.terceirizado;
    if (!data.status) data.status = 'Ativo';
    if (!data.idEmpresa) delete data.idEmpresa;

    return data;
  }

  protected async saveEntity(data: CreateMotoristaDto | UpdateMotoristaDto): Promise<void> {
    await firstValueFrom(this.motoristaService.create(data as CreateMotoristaDto));
  }

  protected async updateEntity(id: string, data: CreateMotoristaDto | UpdateMotoristaDto): Promise<void> {
    await firstValueFrom(this.motoristaService.update(id, data as UpdateMotoristaDto));
  }

  protected async loadEntityById(id: string): Promise<void> {
    const motorista = await firstValueFrom(this.motoristaService.getById(id));
    
    // Formatar datas para o formato do input date (YYYY-MM-DD)
    const formatDateForInput = (dateString: string) => {
      if (!dateString) return '';
      return dateString.split('T')[0];
    };

    // Formatar telefone para exibição
    const formatPhone = (phone: string | undefined) => {
      if (!phone) return '';
      const value = phone.replace(/\D/g, '');
      if (value.length > 10) {
        return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      } else if (value.length > 6) {
        return value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      } else if (value.length > 2) {
        return value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
      }
      return value;
    };

    this.form.patchValue({
      nome: motorista.nome,
      matricula: motorista.matricula,
      dataNascimento: formatDateForInput(motorista.dataNascimento),
      dataHabilitacao: formatDateForInput(motorista.dataHabilitacao),
      validadeDaHabilitacao: formatDateForInput(motorista.validadeDaHabilitacao),
      dataAdmissao: formatDateForInput(motorista.dataAdmissao),
      dataCursoTransporte: motorista.dataCursoTransporte ? formatDateForInput(motorista.dataCursoTransporte) : '',
      dataExameToxicologico: motorista.dataExameToxicologico ? formatDateForInput(motorista.dataExameToxicologico) : '',
      email: motorista.email,
      cpf: motorista.cpf,
      identidade: motorista.identidade,
      sexo: motorista.sexo,
      endereco: motorista.endereco,
      bairro: motorista.bairro,
      cidade: motorista.cidade,
      cep: motorista.cep,
      telefone: motorista.telefone,
      celular: motorista.celular,
      terceirizado: motorista.terceirizado,
      status: motorista.status,
      idEmpresa: motorista.idEmpresa ?? ''
    });

    // Aplicar formatação visual nos inputs após patchValue
    setTimeout(() => {
      const telefoneInput = document.querySelector('input[formControlName="telefone"]') as HTMLInputElement;
      const celularInput = document.querySelector('input[formControlName="celular"]') as HTMLInputElement;
      
      if (telefoneInput && motorista.telefone) {
        telefoneInput.value = formatPhone(motorista.telefone);
      }
      if (celularInput && motorista.celular) {
        celularInput.value = formatPhone(motorista.celular);
      }
    }, 0);
  }

  protected override getListRoute(): string {
    return '/motorista';
  }

  // Formatação de CPF
  onCpfInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input) return;
    
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    
    this.form.get('cpf')?.setValue(value, { emitEvent: false });
    input.value = value;
  }

  // Formatação de CEP
  onCepInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input) return;
    
    let value = input.value.replace(/\D/g, '');
    if (value.length > 8) {
      value = value.substring(0, 8);
    }
    
    this.form.get('cep')?.setValue(value, { emitEvent: false });
    input.value = value;
  }

  // Formatação de telefone e celular
  onPhoneInput(event: Event, field: string): void {
    const input = event.target as HTMLInputElement;
    if (!input) return;
    
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    
    // Aplicar máscara visual
    let formattedValue = value;
    if (value.length > 10) {
      // Celular: (00) 00000-0000
      formattedValue = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (value.length > 6) {
      // Telefone fixo: (00) 0000-0000
      formattedValue = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (value.length > 2) {
      // Apenas DDD e início
      formattedValue = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    }
    
    // Salvar apenas números no form
    this.form.get(field)?.setValue(value, { emitEvent: false });
    // Mostrar formatado no input
    input.value = formattedValue;
  }
}
