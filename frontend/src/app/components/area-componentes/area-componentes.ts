import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AreaVistoriadaService } from '../../services/area-vistoriada.service';
import { ComponenteService } from '../../services/componente.service';
import { AreaVistoriada, AreaComponente, SetAreaComponentesDto } from '../../models/area-vistoriada.model';
import { Componente } from '../../models/componente.model';

@Component({
  selector: 'app-area-componentes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './area-componentes.html',
  styleUrls: ['./area-componentes.css'],
})
export class AreaComponentesComponent implements OnInit {
  areaId = '';
  areaNome = '';
  loading = false;
  saving = false;
  error = '';

  componentes: Componente[] = [];
  selecionados = new Map<string, { ordem: number }>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private areaService: AreaVistoriadaService,
    private componenteService: ComponenteService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.areaId = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.areaId) {
      this.router.navigate(['/areas-vistoriadas']);
      return;
    }

    this.loading = true;
    this.error = '';
    try {
      const area: AreaVistoriada = await firstValueFrom(this.areaService.getById(this.areaId));
      this.areaNome = area.nome;

      const [componentes, areaComponentes] = await Promise.all([
        firstValueFrom(this.componenteService.getAll(true)),
        firstValueFrom(this.areaService.listComponentes(this.areaId)),
      ]);
      this.componentes = componentes;
      this.hidratarSelecionados(areaComponentes);
    } catch {
      this.error = 'Erro ao carregar componentes da área.';
    } finally {
      this.loading = false;
    }
  }

  isSelected(componenteId: string): boolean {
    return this.selecionados.has(componenteId);
  }

  toggleComponente(componenteId: string): void {
    if (this.selecionados.has(componenteId)) {
      this.selecionados.delete(componenteId);
      return;
    }
    const ordem = this.getNextOrdem();
    this.selecionados.set(componenteId, { ordem });
  }

  updateOrdem(componenteId: string, value: string): void {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return;
    const current = this.selecionados.get(componenteId);
    if (!current) return;
    this.selecionados.set(componenteId, { ordem: Math.max(0, Math.floor(parsed)) });
  }

  async salvar(): Promise<void> {
    this.saving = true;
    this.error = '';
    try {
      const payload: SetAreaComponentesDto = {
        componentes: Array.from(this.selecionados.entries())
          .map(([idcomponente, data]) => ({
            idcomponente,
            ordem_visual: data.ordem,
          }))
          .sort((a, b) => (a.ordem_visual ?? 0) - (b.ordem_visual ?? 0)),
      };
      await firstValueFrom(this.areaService.setComponentes(this.areaId, payload));
      this.router.navigate(['/areas-vistoriadas']);
    } catch {
      this.error = 'Erro ao salvar componentes da área.';
    } finally {
      this.saving = false;
    }
  }

  cancelar(): void {
    this.router.navigate(['/areas-vistoriadas']);
  }

  private hidratarSelecionados(itens: AreaComponente[]): void {
    itens.forEach((item) => {
      this.selecionados.set(item.idComponente, { ordem: item.ordemVisual ?? 0 });
    });
  }

  private getNextOrdem(): number {
    if (this.selecionados.size === 0) return 1;
    const max = Math.max(...Array.from(this.selecionados.values()).map((item) => item.ordem));
    return max + 1;
  }
}
