import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Departamento } from '../../models/departamento.model';
import { DepartamentoService } from '../../services/departamento.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal';
import { BaseListComponent } from '../base-list.component';
import { HistoricoAuditoriaComponent } from '../historico-auditoria/historico-auditoria.component';
import { AuthService } from '../../services/auth.service';
import { Permission } from '../../models/usuario.model';

@Component({
  selector: 'app-departamento-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ConfirmationModalComponent, HistoricoAuditoriaComponent],
  templateUrl: './departamento-list.html',
  styleUrls: ['./departamento-list.css']
})
export class DepartamentoListComponent extends BaseListComponent<Departamento> {
  private departamentoService = inject(DepartamentoService);
  private router = inject(Router);
  protected override authService = inject(AuthService);
  filterNome = '';
  canAudit = false;
  showAuditModal = false;
  selectedForAudit: Departamento | null = null;

  override ngOnInit(): void {
    this.canAudit = this.authService.hasPermission(Permission.DEPARTAMENTO_AUDIT);
    super.ngOnInit();
  }

  protected override loadItems(): void {
    this.loading = true;
    this.departamentoService.getAll(this.filterNome.trim() || undefined).subscribe({
      next: (items) => { this.items = items; this.loading = false; },
      error: () => {
        this.loading = false;
        this.errorModalService.show('Erro ao carregar departamentos', 'Erro');
      }
    });
  }

  protected override deleteItem(id: string): Observable<any> {
    return this.departamentoService.delete(id);
  }

  protected override getId(item: Departamento): string {
    return item.id;
  }

  protected override loadAllItemsForExport(): Observable<Departamento[]> {
    return this.departamentoService.getAll(this.filterNome.trim() || undefined);
  }

  protected override getExportDataExcel(items: Departamento[]) {
    const headers = ['Nome do Departamento', 'Criado em', 'Atualizado em'];
    const data = items.map(d => [d.nomeDepartamento, d.criadoEm, d.atualizadoEm]);
    return { headers, data };
  }

  protected override getExportDataPDF(items: Departamento[]) {
    const headers = ['Nome do Departamento', 'Criado em', 'Atualizado em'];
    const data = items.map(d => [d.nomeDepartamento, d.criadoEm, d.atualizadoEm]);
    return { headers, data };
  }

  protected override getExportFileName(): string {
    return 'departamentos';
  }

  protected override getTableDisplayName(): string {
    return 'Departamentos';
  }

  create(): void {
    this.router.navigate(['/departamento/new']);
  }

  onFilterChange(): void {
    this.loadItems();
  }

  edit(item: Departamento): void {
    this.router.navigate(['/departamento/edit', item.id]);
  }

  delete(item: Departamento): void {
    this.confirmDelete(item, `Deseja excluir o departamento "${item.nomeDepartamento}"?`);
  }

  openAudit(item: Departamento): void {
    if (!this.canAudit) return;
    this.selectedForAudit = item;
    this.showAuditModal = true;
  }

  closeAudit(): void {
    this.showAuditModal = false;
    this.selectedForAudit = null;
  }
}
