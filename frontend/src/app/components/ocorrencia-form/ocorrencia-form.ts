import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OcorrenciaService } from '../../services/ocorrencia.service';
import { VeiculoService } from '../../services/veiculo.service';
import { MotoristaService } from '../../services/motorista.service';
import { TrechoService } from '../../services/trecho.service';
import { OrigemOcorrenciaService } from '../../services/origem-ocorrencia.service';
import { CategoriaOcorrenciaService } from '../../services/categoria-ocorrencia.service';
import { EmpresaTerceiraService } from '../../services/empresa-terceira.service';
import { CreateOcorrenciaDto, UpdateOcorrenciaDto } from '../../models/ocorrencia.model';
import { TipoOcorrencia } from '../../models/tipo-ocorrencia.enum';
import { Linha } from '../../models/linha.enum';
import { Arco } from '../../models/arco.enum';
import { SentidoVia } from '../../models/sentido-via.enum';
import { TipoLocal } from '../../models/tipo-local.enum';
import { Culpabilidade } from '../../models/culpabilidade.enum';
import { SimNao } from '../../models/sim-nao.enum';
import { Sexo } from '../../models/sexo.enum';
import { StatusVeiculo } from '../../models/veiculo.model';
import { StatusMotorista } from '../../models/status-motorista.enum';
import { Veiculo, Motorista, Trecho } from '../../models';
import { BaseFormComponent } from '../base/base-form.component';
import { VeiculoAutocompleteComponent } from '../shared/veiculo-autocomplete/veiculo-autocomplete.component';
import { MotoristaAutocompleteComponent } from '../shared/motorista-autocomplete/motorista-autocomplete.component';
import { TrechoAutocompleteComponent } from '../shared/trecho-autocomplete/trecho-autocomplete.component';
import { MapaLocalizacaoComponent, PontoLocalizacao } from '../shared/mapa-localizacao/mapa-localizacao.component';
import { DataHoraPickerComponent } from '../shared/data-hora-picker/data-hora-picker.component';
import { firstValueFrom } from 'rxjs';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-ocorrencia-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    VeiculoAutocompleteComponent,
    MotoristaAutocompleteComponent,
    TrechoAutocompleteComponent,
    MapaLocalizacaoComponent,
    DataHoraPickerComponent
  ],
  templateUrl: './ocorrencia-form.html',
  styleUrls: ['./ocorrencia-form.css']
})
export class OcorrenciaFormComponent extends BaseFormComponent<CreateOcorrenciaDto | UpdateOcorrenciaDto> implements OnInit {
  private ocorrenciaService = inject(OcorrenciaService);
  private veiculoService = inject(VeiculoService);
  private motoristaService = inject(MotoristaService);
  private trechoService = inject(TrechoService);
  private origemService = inject(OrigemOcorrenciaService);
  private categoriaService = inject(CategoriaOcorrenciaService);
  private empresaService = inject(EmpresaTerceiraService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  origens: { id: string; descricao: string }[] = [];
  categorias: { id: string; descricao: string; idOrigem: string }[] = [];
  empresas: { id: string; descricao: string }[] = [];
  motoristaComEmpresa = false;

  @ViewChild(MapaLocalizacaoComponent) mapaComponent!: MapaLocalizacaoComponent;

  // Enums para uso no template
  statusVeiculoAtivo = StatusVeiculo.ATIVO;
  statusMotoristaAtivo = StatusMotorista.ATIVO;

  // Opções de selects
  tipoOptions = Object.values(TipoOcorrencia);
  linhaOptions = Object.values(Linha);
  arcoOptions = Object.values(Arco);
  sentidoViaOptions = Object.values(SentidoVia);
  tipoLocalOptions = Object.values(TipoLocal);
  culpabilidadeOptions = Object.values(Culpabilidade);
  simNaoOptions = Object.values(SimNao);
  sexoOptions = Object.values(Sexo);

  localizacaoSelecionada: PontoLocalizacao | null = null;

  constructor(router: Router) {
    super(router);
  }

  override ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.entityId = id;
    }
    this.origemService.getAll().subscribe((list) => (this.origens = list));
    this.empresaService.getAll().subscribe((list) => (this.empresas = list));
    super.ngOnInit();
  }

  protected initializeForm(): void {
    this.form = this.fb.group({
      dataHora: ['', [Validators.required]],
      idVeiculo: ['', [Validators.required]],
      idMotorista: ['', [Validators.required]],
      idTrecho: [''],
      idOrigem: ['', [Validators.required]],
      idCategoria: ['', [Validators.required]],
      processoSei: ['', [Validators.maxLength(50)]],
      numeroOrcamento: ['', [Validators.maxLength(50)]],
      valorDoOrcamento: [null as number | null, [Validators.min(0)]],
      idEmpresaDoMotorista: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      descricao: ['', [Validators.required, Validators.minLength(10)]],
      observacoesTecnicas: [''],
      linha: [''],
      arco: [''],
      sentidoVia: [''],
      tipoLocal: [''],
      localDetalhado: ['', [Validators.maxLength(400)]],
      culpabilidade: [''],
      informacoesTerceiros: [''],
      aberturaPAP: ['', [Validators.maxLength(200)]],
      boletimOcorrencia: ['', [Validators.maxLength(100)]],
      houveVitimas: ['', [Validators.required]],
      numVitimasComLesoes: [0, [Validators.min(0)]],
      numVitimasFatais: [0, [Validators.min(0)]],
      nomeDaVitima: ['', [Validators.maxLength(150)]],
      documentoDaVitima: ['', [Validators.maxLength(50)]],
      dataNascimentoDaVitima: [''],
      sexoDaVitima: [''],
      nomeDaMaeDaVitima: ['', [Validators.maxLength(150)]],
      informacoesVitimas: [''],
      enderecoVitimas: [''],
      informacoesTestemunhas: ['']
    });
    // Categoria só fica habilitada quando houver origem selecionada (evita [disabled] no template)
    this.form.get('idCategoria')?.disable();
  }

  protected buildFormData(): CreateOcorrenciaDto | UpdateOcorrenciaDto {
    const formValue = this.form.getRawValue();
    
    console.log('🔍 buildFormData - Valores do formulário:', {
      idVeiculo: formValue.idVeiculo,
      idMotorista: formValue.idMotorista,
      idTrecho: formValue.idTrecho
    });
    
    const data: any = {
      dataHora: formValue.dataHora,
      idVeiculo: formValue.idVeiculo,
      idMotorista: formValue.idMotorista,
      idTrecho: formValue.idTrecho,
      idOrigem: formValue.idOrigem || undefined,
      idCategoria: formValue.idCategoria || undefined,
      processoSei: formValue.processoSei || undefined,
      numeroOrcamento: formValue.numeroOrcamento || undefined,
      valorDoOrcamento:
        formValue.valorDoOrcamento != null && formValue.valorDoOrcamento !== ''
          ? Number(formValue.valorDoOrcamento)
          : undefined,
      idEmpresaDoMotorista: formValue.idEmpresaDoMotorista || undefined,
      tipo: formValue.tipo,
      descricao: formValue.descricao,
      houveVitimas: formValue.houveVitimas
    };

    console.log('📤 Dados a enviar para o backend:', {
      idVeiculo: data.idVeiculo,
      idMotorista: data.idMotorista,
      idTrecho: data.idTrecho
    });

    // Campos opcionais
    if (formValue.observacoesTecnicas) data.observacoesTecnicas = formValue.observacoesTecnicas;
    
    // Adicionar localização se definida
    if (this.localizacaoSelecionada) {
      data.localizacao = {
        type: 'Point',
        coordinates: [this.localizacaoSelecionada.longitude, this.localizacaoSelecionada.latitude]
      };
    }
    
    if (formValue.linha) data.linha = formValue.linha;
    if (formValue.arco) data.arco = formValue.arco;
    if (formValue.sentidoVia) data.sentidoVia = formValue.sentidoVia;
    if (formValue.tipoLocal) data.tipoLocal = formValue.tipoLocal;
    if (formValue.localDetalhado) data.localDetalhado = formValue.localDetalhado;
    if (formValue.culpabilidade) data.culpabilidade = formValue.culpabilidade;
    if (formValue.informacoesTerceiros) data.informacoesTerceiros = formValue.informacoesTerceiros;
    if (formValue.aberturaPAP) data.aberturaPAP = formValue.aberturaPAP;
    if (formValue.boletimOcorrencia) data.boletimOcorrencia = formValue.boletimOcorrencia;
    if (formValue.numVitimasComLesoes) data.numVitimasComLesoes = formValue.numVitimasComLesoes;
    if (formValue.numVitimasFatais) data.numVitimasFatais = formValue.numVitimasFatais;
    
    // SEMPRE enviar os 5 campos de vítima para o backend validar
    // Quando houveVitimas = 'SIM': backend vai validar se estão vazios
    // Quando houveVitimas != 'SIM': backend vai permitir vazios
    data.nomeDaVitima = formValue.nomeDaVitima || '';
    data.documentoDaVitima = formValue.documentoDaVitima || '';
    data.dataNascimentoDaVitima = formValue.dataNascimentoDaVitima || '';
    data.sexoDaVitima = formValue.sexoDaVitima || '';
    data.nomeDaMaeDaVitima = formValue.nomeDaMaeDaVitima || '';
    
    if (formValue.informacoesVitimas) data.informacoesVitimas = formValue.informacoesVitimas;
    if (formValue.enderecoVitimas) data.enderecoVitimas = formValue.enderecoVitimas;
    if (formValue.informacoesTestemunhas) data.informacoesTestemunhas = formValue.informacoesTestemunhas;

    return data;
  }

  protected async saveEntity(data: CreateOcorrenciaDto): Promise<void> {
    await firstValueFrom(this.ocorrenciaService.create(data));
    this.notificationService.success('Ocorrência cadastrada com sucesso!');
  }

  protected async updateEntity(id: string, data: UpdateOcorrenciaDto): Promise<void> {
    await firstValueFrom(this.ocorrenciaService.update(id, data));
    this.notificationService.success('Ocorrência atualizada com sucesso!');
  }

  protected async loadEntityById(id: string): Promise<void> {
    const ocorrencia = await firstValueFrom(this.ocorrenciaService.getById(id));
    
    // A data vem como Date object que JavaScript já converteu para local time
    // Mas quando enviamos para o form input datetime-local, ele espera a hora LOCAL
    // Então basta usar getHours/getMinutes que já retorna a hora local
    let dataHoraFormatted = '';
    if (ocorrencia.dataHora) {
      const dataObj = new Date(ocorrencia.dataHora);
      
      const ano = dataObj.getFullYear();
      const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
      const dia = String(dataObj.getDate()).padStart(2, '0');
      const horas = String(dataObj.getHours()).padStart(2, '0');
      const minutos = String(dataObj.getMinutes()).padStart(2, '0');
      
      dataHoraFormatted = `${ano}-${mes}-${dia}T${horas}:${minutos}`;
    }
    
    // Extrair localização se existir
    if (ocorrencia.localizacao && ocorrencia.localizacao.coordinates) {
      const [longitude, latitude] = ocorrencia.localizacao.coordinates;
      this.localizacaoSelecionada = { latitude, longitude };
    }
    
    if (ocorrencia.idOrigem) {
      this.categoriaService.getByOrigem(ocorrencia.idOrigem).subscribe((list) => {
        this.categorias = list;
      });
    }
    this.form.patchValue({
      dataHora: dataHoraFormatted,
      idVeiculo: ocorrencia.idVeiculo,
      idMotorista: ocorrencia.idMotorista,
      idTrecho: ocorrencia.idTrecho,
      idOrigem: ocorrencia.idOrigem,
      idCategoria: ocorrencia.idCategoria,
      processoSei: ocorrencia.processoSei,
      numeroOrcamento: ocorrencia.numeroOrcamento,
      valorDoOrcamento:
        ocorrencia.valorDoOrcamento != null
          ? Number(ocorrencia.valorDoOrcamento)
          : null,
      idEmpresaDoMotorista: ocorrencia.idEmpresaDoMotorista,
      tipo: ocorrencia.tipo,
      descricao: ocorrencia.descricao,
      observacoesTecnicas: ocorrencia.observacoesTecnicas,
      linha: ocorrencia.linha,
      arco: ocorrencia.arco,
      sentidoVia: ocorrencia.sentidoVia,
      tipoLocal: ocorrencia.tipoLocal,
      localDetalhado: ocorrencia.localDetalhado,
      culpabilidade: ocorrencia.culpabilidade,
      informacoesTerceiros: ocorrencia.informacoesTerceiros,
      aberturaPAP: ocorrencia.aberturaPAP,
      boletimOcorrencia: ocorrencia.boletimOcorrencia,
      houveVitimas: ocorrencia.houveVitimas,
      numVitimasComLesoes: ocorrencia.numVitimasComLesoes || 0,
      numVitimasFatais: ocorrencia.numVitimasFatais || 0,
      nomeDaVitima: ocorrencia.nomeDaVitima,
      documentoDaVitima: ocorrencia.documentoDaVitima,
      dataNascimentoDaVitima: ocorrencia.dataNascimentoDaVitima,
      sexoDaVitima: ocorrencia.sexoDaVitima,
      nomeDaMaeDaVitima: ocorrencia.nomeDaMaeDaVitima,
      informacoesVitimas: ocorrencia.informacoesVitimas,
      enderecoVitimas: ocorrencia.enderecoVitimas,
      informacoesTestemunhas: ocorrencia.informacoesTestemunhas
    });
    const mot = (ocorrencia as any).motorista;
    this.motoristaComEmpresa = !!(mot?.idEmpresa ?? mot?.empresa);
    if (this.motoristaComEmpresa && mot?.idEmpresa) {
      this.form.get('idEmpresaDoMotorista')?.disable();
    } else {
      this.form.get('idEmpresaDoMotorista')?.enable();
    }
    // Categoria: habilitar só se houver origem ao editar
    if (ocorrencia.idOrigem) {
      this.form.get('idCategoria')?.enable();
    } else {
      this.form.get('idCategoria')?.disable();
    }
  }

  protected override getListRoute(): string {
    return '/ocorrencia';
  }

  // Callbacks dos autocompletes
  onVeiculoSelected(veiculo: Veiculo): void {
    this.form.patchValue({ idVeiculo: veiculo.id });
    this.form.get('idVeiculo')?.markAsTouched();
  }

  onMotoristaSelected(motorista: Motorista): void {
    this.form.patchValue({ idMotorista: motorista.id });
    this.form.get('idMotorista')?.markAsTouched();
    const temEmpresa = !!(motorista as any).idEmpresa || !!(motorista as any).empresa;
    this.motoristaComEmpresa = temEmpresa;
    if (temEmpresa) {
      const idEmpresa = (motorista as any).idEmpresa ?? (motorista as any).empresa?.id;
      this.form.patchValue({ idEmpresaDoMotorista: idEmpresa });
      this.form.get('idEmpresaDoMotorista')?.disable();
    } else {
      this.form.get('idEmpresaDoMotorista')?.enable();
      this.form.patchValue({ idEmpresaDoMotorista: '' });
    }
  }

  onOrigemSelected(): void {
    const idOrigem = this.form.get('idOrigem')?.value;
    this.form.patchValue({ idCategoria: '' });
    if (!idOrigem) {
      this.categorias = [];
      this.form.get('idCategoria')?.disable();
      return;
    }
    this.form.get('idCategoria')?.enable();
    this.categoriaService.getByOrigem(idOrigem).subscribe((list) => {
      this.categorias = list;
    });
  }

  /** Exibe o valor do orçamento formatado (pt-BR: 1.234,56) */
  getValorOrcamentoDisplay(): string {
    const v = this.form.get('valorDoOrcamento')?.value;
    if (v == null || v === '') return '';
    const n = Number(v);
    if (isNaN(n) || n < 0) return '';
    return n.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  /** Formata o valor ao digitar (pt-BR). Aceita vírgula; se houver mais de 2 decimais, os extras viram parte inteira (ex.: "3,000" -> 30,00). */
  onValorOrcamentoInput(e: Event): void {
    const input = e.target as HTMLInputElement;
    let raw = input.value.replace(/[^\d,]/g, '');
    const commaIdx = raw.indexOf(',');
    let intPart: string;
    let decPart: string;
    if (commaIdx >= 0) {
      intPart = raw.slice(0, commaIdx).replace(/\D/g, '');
      const after = raw.slice(commaIdx + 1).replace(/\D/g, '');
      if (after.length > 2) {
        intPart = intPart + after.slice(0, -2);
        decPart = after.slice(-2);
      } else {
        decPart = after;
      }
    } else {
      intPart = raw;
      decPart = '';
    }
    if (intPart === '' && decPart === '') {
      this.form.patchValue({ valorDoOrcamento: null });
      this.form.get('valorDoOrcamento')?.updateValueAndValidity();
      input.value = '';
      return;
    }
    const num = parseFloat(`${intPart || '0'}.${(decPart || '00').padEnd(2, '0').slice(0, 2)}`);
    if (!isNaN(num) && num >= 0) {
      this.form.patchValue({ valorDoOrcamento: num });
      this.form.get('valorDoOrcamento')?.updateValueAndValidity();
      input.value = num.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  }

  onTrechoSelected(trecho: any): void {
    this.form.patchValue({ idTrecho: trecho.id });
  }

  buscarTrechoPorLocalizacao(): void {
    // Verificar se há localização selecionada
    if (!this.localizacaoSelecionada) {
      this.notificationService.error('Selecione uma localização no mapa antes de buscar o trecho');
      return;
    }

    this.loading = true;
    const { latitude, longitude } = this.localizacaoSelecionada;

    this.trechoService.findByLocation(latitude, longitude).subscribe({
      next: (trechos: Trecho[]) => {
        this.loading = false;

        if (!trechos || trechos.length === 0) {
          this.notificationService.error('Nenhum trecho encontrado para esta localização');
          return;
        }

        // Pegar o primeiro trecho da lista
        const trechoEncontrado = trechos[0];
        this.form.patchValue({ idTrecho: trechoEncontrado.id });
        this.notificationService.success(`Trecho "${trechoEncontrado.descricao}" selecionado com sucesso!`);
      },
      error: (error) => {
        this.loading = false;
        const errorMessage = error.error?.message || 'Erro ao buscar trecho pela localização';
        this.notificationService.error(errorMessage);
      }
    });
  }

  // Callback do mapa
  onLocalizacaoSelecionada(localizacao: PontoLocalizacao | null): void {
    this.localizacaoSelecionada = localizacao;
  }

  // Buscar localização ao clicar no botão
  buscarLocalizacao(): void {
    const endereco = this.form.get('localDetalhado')?.value;
    
    if (!endereco || endereco.trim() === '') {
      this.notificationService.error('Preencha o campo "Local Detalhado" para buscar a localização');
      return;
    }

    if (this.mapaComponent) {
      this.mapaComponent.geocodificarEnderecoDoCampo(endereco);
    }
  }

  override async onSubmit(): Promise<void> {
    this.submitted = true;

    if (this.form.invalid) {
      this.markAllAsTouched();
      this.notificationService.error('Por favor, preencha todos os campos obrigatórios antes de salvar');
      return;
    }

    this.loading = true;
    try {
      const formData = this.buildFormData();

      if (this.editMode && this.entityId) {
        await this.updateEntity(this.entityId, formData);
      } else {
        await this.saveEntity(formData as CreateOcorrenciaDto);
      }

      this.router.navigate([this.getListRoute()]);
    } catch (error: any) {
      const errorMessage = error.error?.message || 'Erro ao salvar ocorrência';
      this.notificationService.error(errorMessage);
    } finally {
      this.loading = false;
    }
  }
}
