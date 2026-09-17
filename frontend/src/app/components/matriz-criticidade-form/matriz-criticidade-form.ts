import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BaseFormComponent } from '../base/base-form.component';
import {
  MatrizCriticidade,
  CreateMatrizCriticidadeDto,
  UpdateMatrizCriticidadeDto,
  GravidadeCriticidade,
} from '../../models/matriz-criticidade.model';
import { MatrizCriticidadeService } from '../../services/matriz-criticidade.service';
import { Componente } from '../../models/componente.model';
import { Sintoma } from '../../models/sintoma.model';
import { ComponenteService } from '../../services/componente.service';
import { SintomaService } from '../../services/sintoma.service';
import { VistaVeiculo } from '../../models/vista-veiculo.model';
import { VistaVeiculoService } from '../../services/vista-veiculo.service';

@Component({
  selector: 'app-matriz-criticidade-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './matriz-criticidade-form.html',
  styleUrls: ['./matriz-criticidade-form.css'],
})
export class MatrizCriticidadeFormComponent
  extends BaseFormComponent<CreateMatrizCriticidadeDto | UpdateMatrizCriticidadeDto>
  implements OnInit
{
  componentes: Componente[] = [];
  sintomas: Sintoma[] = [];
  vistasCatalogo: VistaVeiculo[] = [];
  gravidades: GravidadeCriticidade[] = ['VERDE', 'AMARELO', 'VERMELHO'];

  constructor(
    private fb: FormBuilder,
    private matrizService: MatrizCriticidadeService,
    private componenteService: ComponenteService,
    private sintomaService: SintomaService,
    private vistaVeiculoService: VistaVeiculoService,
    private route: ActivatedRoute,
    router: Router,
  ) {
    super(router);
  }

  override ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.entityId = id;
    }
    this.loadCatalogos();
    this.loadVistasCatalogo();
    super.ngOnInit();
  }

  protected initializeForm(): void {
    this.form = this.fb.group({
      idcomponente: ['', [Validators.required]],
      idsintoma: ['', [Validators.required]],
      gravidade: ['VERDE', [Validators.required]],
      exige_foto: [false],
      permite_audio: [false],
      id_vistas: [[] as string[]],
    });
  }

  protected buildFormData(): CreateMatrizCriticidadeDto | UpdateMatrizCriticidadeDto {
    const formValue = this.form.value;
    return {
      idcomponente: formValue.idcomponente,
      idsintoma: formValue.idsintoma,
      gravidade: formValue.gravidade,
      exige_foto: !!formValue.exige_foto,
      permite_audio: !!formValue.permite_audio,
      id_vistas: this.sintomaExigeMapa
        ? [...((formValue.id_vistas as string[] | undefined) ?? [])]
        : [],
    };
  }

  protected async saveEntity(data: CreateMatrizCriticidadeDto): Promise<void> {
    await firstValueFrom(this.matrizService.create(data));
  }

  protected async updateEntity(id: string, data: UpdateMatrizCriticidadeDto): Promise<void> {
    await firstValueFrom(this.matrizService.update(id, data));
  }

  protected async loadEntityById(id: string): Promise<void> {
    const matriz: MatrizCriticidade = await firstValueFrom(this.matrizService.getById(id));
    this.form.patchValue({
      idcomponente: matriz.idComponente,
      idsintoma: matriz.idSintoma,
      gravidade: matriz.gravidade,
      exige_foto: matriz.exigeFoto,
      permite_audio: matriz.permiteAudio,
      id_vistas: [...(matriz.idVistas ?? [])],
    });
  }

  protected override getListRoute(): string {
    return '/matriz-criticidade';
  }

  get sintomaExigeMapa(): boolean {
    const id = this.form?.get('idsintoma')?.value as string | undefined;
    if (!id) {
      return false;
    }
    return !!this.sintomas.find((s) => s.id === id)?.exigeMarcacaoMapa;
  }

  isVistaSelecionada(id: string): boolean {
    const atuais = (this.form?.get('id_vistas')?.value as string[] | undefined) ?? [];
    return atuais.includes(id);
  }

  toggleVista(id: string): void {
    const ctrl = this.form.get('id_vistas');
    const atuais = [...((ctrl?.value as string[] | undefined) ?? [])];
    const idx = atuais.indexOf(id);
    if (idx >= 0) {
      atuais.splice(idx, 1);
    } else {
      atuais.push(id);
    }
    ctrl?.setValue(atuais);
    ctrl?.markAsDirty();
  }

  private loadCatalogos(): void {
    this.componenteService.getAll(true).subscribe({
      next: (items) => {
        this.componentes = items;
      },
    });
    this.sintomaService.getAll(true).subscribe({
      next: (items) => {
        this.sintomas = items;
      },
    });
  }

  private loadVistasCatalogo(): void {
    this.vistaVeiculoService.getAll(true).subscribe({
      next: (items) => {
        this.vistasCatalogo = items;
      },
      error: () => {
        this.vistasCatalogo = [];
      },
    });
  }
}
