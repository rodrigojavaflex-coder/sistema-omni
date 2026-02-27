import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonText,
  IonSpinner,
} from '@ionic/angular/standalone';
import { AreaVistoriadaService } from '../../services/area-vistoriada.service';
import { VistoriaFlowService } from '../../services/vistoria-flow.service';
import { VistoriaService } from '../../services/vistoria.service';
import { AreaComponente } from '../../models/area-vistoriada.model';

@Component({
  selector: 'app-vistoria-componentes',
  standalone: true,
  templateUrl: './vistoria-componentes.page.html',
  styleUrls: ['./vistoria-componentes.page.scss'],
  imports: [
    NgIf,
    NgFor,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonLabel,
    IonText,
    IonSpinner,
  ],
})
export class VistoriaComponentesPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private areaService = inject(AreaVistoriadaService);
  private flowService = inject(VistoriaFlowService);
  private vistoriaService = inject(VistoriaService);

  areaId = '';
  areaNome = '';
  componentes: AreaComponente[] = [];
  irregularidadesPorComponente = new Set<string>();
  loading = false;
  errorMessage = '';

  async ngOnInit(): Promise<void> {
    const vistoriaId = this.flowService.getVistoriaId();
    if (!vistoriaId) {
      this.router.navigate(['/vistoria/inicio']);
      return;
    }

    this.areaId = this.route.snapshot.paramMap.get('areaId') ?? '';
    if (!this.areaId) {
      this.router.navigate(['/vistoria/areas']);
      return;
    }
    const state = this.router.getCurrentNavigation()?.extras?.state as { areaNome?: string } | undefined;
    this.areaNome = state?.areaNome ?? 'Área';

    this.loading = true;
    try {
      this.componentes = await this.areaService.listarComponentes(this.areaId);
      const irregularidades = await this.vistoriaService.listarIrregularidades(vistoriaId);
      irregularidades
        .filter((item) => item.idarea === this.areaId)
        .forEach((item) => this.irregularidadesPorComponente.add(item.idcomponente));
    } catch {
      this.errorMessage = 'Erro ao carregar componentes.';
    } finally {
      this.loading = false;
    }
  }

  abrirComponente(item: AreaComponente): void {
    const componenteId = item.idComponente;
    if (!componenteId) {
      return;
    }
    this.router.navigate([`/vistoria/areas/${this.areaId}/componentes/${componenteId}`], {
      state: {
        areaNome: this.areaNome,
        componenteNome: item.componente?.nome ?? 'Componente',
      },
    });
  }
}
