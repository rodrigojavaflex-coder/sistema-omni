import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { BaseListComponent } from '../base-list.component';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal';
import { HistoricoAuditoriaComponent } from '../historico-auditoria/historico-auditoria.component';
import { MatrizCriticidade } from '../../models/matriz-criticidade.model';
import { MatrizCriticidadeService } from '../../services/matriz-criticidade.service';
import { Componente } from '../../models/componente.model';
import { Sintoma } from '../../models/sintoma.model';
import { ComponenteService } from '../../services/componente.service';
import { SintomaService } from '../../services/sintoma.service';
import { Permission } from '../../models/usuario.model';

@Component({
  selector: 'app-matriz-criticidade-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationModalComponent, HistoricoAuditoriaComponent],
  templateUrl: './matriz-criticidade-list.html',
  styleUrls: ['./matriz-criticidade-list.css'],
})
export class MatrizCriticidadeListComponent extends BaseListComponent<MatrizCriticidade> {
  private matrizService = inject(MatrizCriticidadeService);
  private componenteService = inject(ComponenteService);
  private sintomaService = inject(SintomaService);
  private router = inject(Router);

  allItems: MatrizCriticidade[] = [];
  componentes: Componente[] = [];
  sintomas: Sintoma[] = [];

  filterComponente = '';
  filterGravidade = '';

  canCreate = this.authService.hasPermission(Permission.MATRIZCRITICIDADE_CREATE);
  canEdit = this.authService.hasPermission(Permission.MATRIZCRITICIDADE_UPDATE);
  canDelete = this.authService.hasPermission(Permission.MATRIZCRITICIDADE_DELETE);
  canAudit = this.authService.hasPermission(Permission.MATRIZCRITICIDADE_READ);

  showAuditModal = false;
  selectedItemForAudit: MatrizCriticidade | null = null;

  override ngOnInit(): void {
    this.loadCatalogos();
    super.ngOnInit();
  }

  protected override loadItems(): void {
    this.loading = true;
    this.error = '';

    this.matrizService.getAll(this.filterComponente || undefined).subscribe({
      next: (items) => {
        this.allItems = items;
        this.items = this.applyFilters(items);
        this.loading = false;
      },
      error: () => {
        this.error = 'Erro ao carregar matriz de criticidade';
        this.loading = false;
      },
    });
  }

  protected override deleteItem(id: string) {
    return this.matrizService.delete(id);
  }

  protected override getId(item: MatrizCriticidade): string {
    return item.id;
  }

  onFilterChange(): void {
    this.loadItems();
  }

  clearFilters(): void {
    this.filterComponente = '';
    this.filterGravidade = '';
    this.loadItems();
  }

  onNew(): void {
    this.router.navigate(['/matriz-criticidade/new']);
  }

  onEdit(item: MatrizCriticidade): void {
    this.router.navigate(['/matriz-criticidade/edit', item.id]);
  }

  onDelete(item: MatrizCriticidade): void {
    this.confirmDelete(item, 'Deseja realmente excluir a matriz de criticidade?');
  }

  openAuditModal(item: MatrizCriticidade): void {
    this.selectedItemForAudit = item;
    this.showAuditModal = true;
  }

  closeAuditModal(): void {
    this.showAuditModal = false;
    this.selectedItemForAudit = null;
  }

  getComponenteLabel(id: string): string {
    return this.componentes.find((item) => item.id === id)?.nome || id;
  }

  getSintomaLabel(id: string): string {
    return this.sintomas.find((item) => item.id === id)?.descricao || id;
  }

  getBooleanLabel(value: boolean): string {
    return value ? 'Sim' : 'Não';
  }

  protected loadAllItemsForExport(): Observable<MatrizCriticidade[]> {
    return of(this.applyFilters(this.allItems));
  }

  protected getExportDataExcel(items: MatrizCriticidade[]): { headers: string[]; data: any[][] } {
    return {
      headers: ['Componente', 'Sintoma', 'Gravidade', 'Exige Foto', 'Permite Áudio'],
      data: items.map((item) => [
        this.getComponenteLabel(item.idComponente),
        this.getSintomaLabel(item.idSintoma),
        item.gravidade,
        this.getBooleanLabel(item.exigeFoto),
        this.getBooleanLabel(item.permiteAudio),
      ]),
    };
  }

  protected getExportDataPDF(items: MatrizCriticidade[]): { headers: string[]; data: any[][] } {
    return {
      headers: ['Componente', 'Sintoma', 'Gravidade', 'Exige Foto', 'Permite Áudio'],
      data: items.map((item) => [
        this.getComponenteLabel(item.idComponente),
        this.getSintomaLabel(item.idSintoma),
        item.gravidade,
        this.getBooleanLabel(item.exigeFoto),
        this.getBooleanLabel(item.permiteAudio),
      ]),
    };
  }

  protected getExportFileName(): string {
    return 'matriz-criticidade';
  }

  protected getTableDisplayName(): string {
    return 'Matriz de Criticidade';
  }

  private applyFilters(items: MatrizCriticidade[]): MatrizCriticidade[] {
    const gravidade = this.filterGravidade;
    return items.filter((item) => !gravidade || item.gravidade === gravidade);
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
}
