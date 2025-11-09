import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OcorrenciaService } from '../../services/ocorrencia.service';
import { VeiculoService } from '../../services/veiculo.service';
import { MotoristaService } from '../../services/motorista.service';
import { TrechoService } from '../../services/trecho.service';
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
import { Status } from '../../models/status.enum';
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
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  @ViewChild(MapaLocalizacaoComponent) mapaComponent!: MapaLocalizacaoComponent;

  // Enums para uso no template
  statusVeiculoAtivo = StatusVeiculo.ATIVO;
  statusMotoristaAtivo = Status.ATIVO;

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

    // Não carregamos veículos e motoristas inicialmente
    // Eles serão carregados sob demanda ao digitar
    super.ngOnInit();
  }

  protected initializeForm(): void {
    this.form = this.fb.group({
      dataHora: ['', [Validators.required]],
      idVeiculo: ['', [Validators.required]],
      idMotorista: ['', [Validators.required]],
      idTrecho: ['', [Validators.required]],
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
  }

  protected buildFormData(): CreateOcorrenciaDto | UpdateOcorrenciaDto {
    const formValue = this.form.value;
    
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
    
    this.form.patchValue({
      dataHora: dataHoraFormatted,
      idVeiculo: ocorrencia.idVeiculo,
      idMotorista: ocorrencia.idMotorista,
      idTrecho: ocorrencia.idTrecho,
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
