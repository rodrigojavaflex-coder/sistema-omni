import { Component, OnInit, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonText,
  IonSpinner,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { VistoriaFlowService } from '../../services/vistoria-flow.service';
import { AreaVistoriadaService } from '../../services/area-vistoriada.service';
import { VistoriaService } from '../../services/vistoria.service';
import { AreaVistoriada } from '../../models/area-vistoriada.model';

@Component({
  selector: 'app-vistoria-areas',
  standalone: true,
  templateUrl: './vistoria-areas.page.html',
  styleUrls: ['./vistoria-areas.page.scss'],
  imports: [
    NgIf,
    NgFor,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonText,
    IonSpinner,
  ],
})
export class VistoriaAreasPage implements OnInit {
  private flowService = inject(VistoriaFlowService);
  private areaService = inject(AreaVistoriadaService);
  private vistoriaService = inject(VistoriaService);
  private router = inject(Router);

  areas: AreaVistoriada[] = [];
  contagemPorArea: Record<string, number> = {};
  loading = false;
  errorMessage = '';

  async ngOnInit(): Promise<void> {
    const vistoriaId = this.flowService.getVistoriaId();
    const modeloId = this.flowService.getVeiculoModeloId();
    if (!vistoriaId || !modeloId) {
      this.router.navigate(['/vistoria/inicio']);
      return;
    }

    this.loading = true;
    try {
      this.areas = await this.areaService.listarPorModelo(modeloId);
      const irregularidades = await this.vistoriaService.listarIrregularidades(vistoriaId);
      this.contagemPorArea = irregularidades.reduce((acc, item) => {
        acc[item.idarea] = (acc[item.idarea] ?? 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    } catch {
      this.errorMessage = 'Erro ao carregar áreas.';
    } finally {
      this.loading = false;
    }
  }

  abrirArea(area: AreaVistoriada): void {
    this.router.navigate([`/vistoria/areas/${area.id}`], {
      state: { areaNome: area.nome },
    });
  }

  finalizarVistoria(): void {
    this.router.navigate(['/vistoria/finalizar']);
  }
}
