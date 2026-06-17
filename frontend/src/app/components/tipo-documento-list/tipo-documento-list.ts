import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { TipoDocumento } from '../../models/tipo-documento.model';
import { TipoDocumentoService } from '../../services/tipo-documento.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal';
import { BaseListComponent } from '../base-list.component';

@Component({
  selector: 'app-tipo-documento-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ConfirmationModalComponent],
  templateUrl: './tipo-documento-list.html',
  styleUrls: ['./tipo-documento-list.css'],
})
export class TipoDocumentoListComponent extends BaseListComponent<TipoDocumento> {
  private readonly tipoDocumentoService = inject(TipoDocumentoService);
  private readonly router = inject(Router);
  filterNome = '';

  protected override loadItems(): void {
    this.loading = true;
    this.tipoDocumentoService.getAll(this.filterNome.trim() || undefined).subscribe({
      next: (items) => {
        this.items = items;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorModalService.show('Erro ao carregar tipos de documento', 'Erro');
      },
    });
  }

  protected override deleteItem(id: string): Observable<void> {
    return this.tipoDocumentoService.delete(id);
  }

  protected override getId(item: TipoDocumento): string {
    return item.id;
  }

  protected override loadAllItemsForExport(): Observable<TipoDocumento[]> {
    return this.tipoDocumentoService.getAll(this.filterNome.trim() || undefined);
  }

  protected override getExportDataExcel(items: TipoDocumento[]) {
    const headers = ['Nome', 'Descrição', 'Ativo', 'Criado em'];
    const data = items.map((item) => [
      item.nome,
      item.descricao ?? '',
      item.ativo ? 'Sim' : 'Não',
      item.criadoEm,
    ]);
    return { headers, data };
  }

  protected override getExportDataPDF(items: TipoDocumento[]) {
    return this.getExportDataExcel(items);
  }

  protected override getExportFileName(): string {
    return 'tipos-documento';
  }

  protected override getTableDisplayName(): string {
    return 'Tipos de Documento';
  }

  create(): void {
    this.router.navigate(['/tipo-documento/new']);
  }

  onFilterChange(): void {
    this.loadItems();
  }

  edit(item: TipoDocumento): void {
    this.router.navigate(['/tipo-documento/edit', item.id]);
  }

  delete(item: TipoDocumento): void {
    this.confirmDelete(item, `Deseja excluir o tipo "${item.nome}"?`);
  }
}
