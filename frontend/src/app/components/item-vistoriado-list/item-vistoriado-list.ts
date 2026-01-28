import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Observable, of, firstValueFrom } from 'rxjs';
import { BaseListComponent } from '../base-list.component';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal';
import { HistoricoAuditoriaComponent } from '../historico-auditoria/historico-auditoria.component';
import { ItemVistoriado } from '../../models/item-vistoriado.model';
import { TipoVistoria } from '../../models/tipo-vistoria.model';
import { ItemVistoriadoService } from '../../services/item-vistoriado.service';
import { TipoVistoriaService } from '../../services/tipo-vistoria.service';
import { Permission } from '../../models/usuario.model';
import { MultiSelectComponent } from '../shared/multi-select/multi-select.component';

@Component({
  selector: 'app-item-vistoriado-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    ConfirmationModalComponent,
    HistoricoAuditoriaComponent,
    MultiSelectComponent,
  ],
  templateUrl: './item-vistoriado-list.html',
  styleUrls: ['./item-vistoriado-list.css'],
})
export class ItemVistoriadoListComponent
  extends BaseListComponent<ItemVistoriado>
  implements OnInit
{
  private itemService = inject(ItemVistoriadoService);
  private tipoVistoriaService = inject(TipoVistoriaService);
  private fb = inject(FormBuilder);

  tiposVistoria: TipoVistoria[] = [];
  allItems: ItemVistoriado[] = [];

  filterDescricao = '';
  filterTipoVistoria = '';
  filterAtivo = '';

  private filterTimeout: any;
  editForms = new Map<string, FormGroup>();
  editingRows = new Set<string>();
  submittedRows = new Set<string>();
  savingRows = new Set<string>();
  newRowForm = this.buildForm();
  newRowVisible = false;
  newRowSubmitted = false;
  newRowSaving = false;
  dragSaving = false;

  canCreate = this.authService.hasPermission(Permission.ITEMVISTORIADO_CREATE);
  canEdit = this.authService.hasPermission(Permission.ITEMVISTORIADO_UPDATE);
  canDelete = this.authService.hasPermission(Permission.ITEMVISTORIADO_DELETE);
  canAudit = this.authService.hasPermission(Permission.ITEMVISTORIADO_AUDIT);

  showAuditModal = false;
  selectedItemForAudit: ItemVistoriado | null = null;

  override ngOnInit(): void {
    this.loadTiposVistoria();
    super.ngOnInit();
  }

  protected override loadItems(): void {
    this.loading = true;
    this.error = '';

    const ativoParsed =
      this.filterAtivo === ''
        ? undefined
        : this.filterAtivo === 'true' || this.filterAtivo === '1';

    this.itemService
      .getAll(this.filterTipoVistoria || undefined, ativoParsed)
      .subscribe({
        next: (items) => {
          this.allItems = items;
          this.items = this.applyFilters(items);
          this.rebuildForms();
          this.loading = false;
        },
        error: () => {
          this.error = 'Erro ao carregar itens vistoriados';
          this.loading = false;
        },
      });
  }

  protected override deleteItem(id: string) {
    return this.itemService.delete(id);
  }

  protected override getId(item: ItemVistoriado): string {
    return item.id;
  }

  onFilterChange(): void {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.filterTimeout = setTimeout(() => {
      this.loadItems();
    }, 400);
  }

  clearFilters(): void {
    this.filterDescricao = '';
    this.filterTipoVistoria = '';
    this.filterAtivo = '';
    this.loadItems();
  }

  onNew(): void {
    this.newRowVisible = !this.newRowVisible;
    this.newRowSubmitted = false;
    if (this.newRowVisible) {
      this.newRowForm = this.buildForm({
        sequencia: this.getNextSequencia(),
      });
    }
  }

  onEdit(item: ItemVistoriado): void {
    this.startEdit(item.id);
  }

  onDelete(item: ItemVistoriado): void {
    this.confirmDelete(item, `Deseja realmente excluir o item "${item.descricao}"?`);
  }

  openAuditModal(item: ItemVistoriado): void {
    this.selectedItemForAudit = item;
    this.showAuditModal = true;
  }

  closeAuditModal(): void {
    this.showAuditModal = false;
    this.selectedItemForAudit = null;
  }

  getStatusLabel(item: ItemVistoriado): string {
    return item.ativo ? 'Ativo' : 'Inativo';
  }

  getObrigafotoLabel(item: ItemVistoriado): string {
    return item.obrigafoto ? 'Sim' : 'Não';
  }

  getTipoDescricao(id: string): string {
    return this.tiposVistoria.find((tipo) => tipo.id === id)?.descricao || id;
  }

  getTiposLabel(item: ItemVistoriado): string {
    if (!item.tiposVistorias?.length) return '-';
    return item.tiposVistorias.map((id) => this.getTipoDescricao(id)).join(', ');
  }

  protected loadAllItemsForExport(): Observable<ItemVistoriado[]> {
    return of(this.applyFilters(this.allItems));
  }

  protected getExportDataExcel(items: ItemVistoriado[]): { headers: string[]; data: any[][] } {
    return {
      headers: ['Sequência', 'Descrição', 'Tipos de Vistoria', 'Obrigatório Foto', 'Status'],
      data: items.map((item) => [
        item.sequencia,
        item.descricao,
        this.getTiposLabel(item),
        this.getObrigafotoLabel(item),
        this.getStatusLabel(item),
      ]),
    };
  }

  protected getExportDataPDF(items: ItemVistoriado[]): { headers: string[]; data: any[][] } {
    return {
      headers: ['Sequência', 'Descrição', 'Tipos de Vistoria', 'Obrigatório Foto', 'Status'],
      data: items.map((item) => [
        item.sequencia,
        item.descricao,
        this.getTiposLabel(item),
        this.getObrigafotoLabel(item),
        this.getStatusLabel(item),
      ]),
    };
  }

  protected getExportFileName(): string {
    return 'itens-vistoriados';
  }

  protected getTableDisplayName(): string {
    return 'Itens Vistoriados';
  }

  isEditing(itemId: string): boolean {
    return this.editingRows.has(itemId);
  }

  isRowInvalid(itemId: string): boolean {
    const form = this.editForms.get(itemId);
    return this.submittedRows.has(itemId) && !!form && form.invalid;
  }

  isNewRowInvalid(): boolean {
    return this.newRowSubmitted && this.newRowForm.invalid;
  }

  get canReorder(): boolean {
    return (
      !this.filterDescricao &&
      !this.filterTipoVistoria &&
      !this.filterAtivo &&
      !this.newRowVisible &&
      this.editingRows.size === 0 &&
      !this.dragSaving
    );
  }

  startEdit(itemId: string): void {
    if (!this.editForms.has(itemId)) {
      const item = this.items.find((current) => current.id === itemId);
      if (item) {
        this.editForms.set(itemId, this.buildForm(item));
      }
    }
    this.submittedRows.delete(itemId);
    this.editingRows.add(itemId);
  }

  cancelEdit(itemId: string): void {
    const item = this.items.find((current) => current.id === itemId);
    if (item) {
      this.editForms.set(itemId, this.buildForm(item));
    }
    this.submittedRows.delete(itemId);
    this.editingRows.delete(itemId);
  }

  async saveEdit(item: ItemVistoriado): Promise<void> {
    const form = this.editForms.get(item.id);
    if (!form) return;

    this.submittedRows.add(item.id);
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload(form);
    this.savingRows.add(item.id);
    try {
      await firstValueFrom(this.itemService.update(item.id, payload));
      this.loadItems();
    } catch (error) {
      this.errorModalService.show('Erro ao salvar item vistoriado');
    } finally {
      this.savingRows.delete(item.id);
    }
  }

  async saveNew(): Promise<void> {
    this.newRowSubmitted = true;
    if (this.newRowForm.invalid) {
      this.newRowForm.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload(this.newRowForm);
    this.newRowSaving = true;
    try {
      await firstValueFrom(this.itemService.create(payload));
      this.newRowVisible = false;
      this.newRowSubmitted = false;
      this.newRowForm = this.buildForm();
      this.loadItems();
    } catch (error) {
      this.errorModalService.show('Erro ao criar item vistoriado');
    } finally {
      this.newRowSaving = false;
    }
  }

  cancelNew(): void {
    this.newRowVisible = false;
    this.newRowSubmitted = false;
    this.newRowForm = this.buildForm();
  }

  getEditForm(itemId: string, item?: ItemVistoriado): FormGroup {
    const existing = this.editForms.get(itemId);
    if (existing) return existing;
    const form = this.buildForm(item);
    this.editForms.set(itemId, form);
    return form;
  }

  get tiposVistoriaOptions(): string[] {
    return this.tiposVistoria.map((tipo) => tipo.descricao);
  }

  getFieldError(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    if (!field || !field.errors) return '';
    if (field.errors['required']) return 'Campo obrigatório';
    if (field.errors['min']) return `Valor mínimo: ${field.errors['min'].min}`;
    if (field.errors['maxlength']) return `Máximo de ${field.errors['maxlength'].requiredLength} caracteres`;
    return 'Campo inválido';
  }

  async onDrop(event: CdkDragDrop<ItemVistoriado[]>): Promise<void> {
    if (!this.canReorder || event.previousIndex === event.currentIndex) return;

    const previousMap = new Map(
      this.items.map((item) => [item.id, item.sequencia]),
    );

    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
    this.applySequenciaFromOrder();

    const changed = this.items.filter(
      (item) => previousMap.get(item.id) !== item.sequencia,
    );

    if (!changed.length) return;

    this.dragSaving = true;
    try {
      await Promise.all(
        changed.map((item) =>
          firstValueFrom(
            this.itemService.update(item.id, { sequencia: item.sequencia }),
          ),
        ),
      );
      this.syncAllItemsSequencia(changed);
    } catch (error) {
      this.errorModalService.show(
        'Erro ao atualizar a sequência. Recarregue a lista.',
      );
      this.loadItems();
    } finally {
      this.dragSaving = false;
    }
  }

  private applyFilters(items: ItemVistoriado[]): ItemVistoriado[] {
    const term = this.filterDescricao.trim().toLowerCase();
    const filtered = term
      ? items.filter((item) => item.descricao.toLowerCase().includes(term))
      : items;

    return [...filtered].sort((a, b) => a.sequencia - b.sequencia);
  }

  private loadTiposVistoria(): void {
    this.tipoVistoriaService.getAll().subscribe({
      next: (tipos) => {
        this.tiposVistoria = tipos;
        this.rebuildForms();
      },
      error: () => {
        this.tiposVistoria = [];
      },
    });
  }

  private rebuildForms(): void {
    this.editForms = new Map(
      this.items.map((item) => [item.id, this.buildForm(item)]),
    );
    this.submittedRows.clear();
    this.editingRows.clear();
  }

  private buildForm(item?: Partial<ItemVistoriado>): FormGroup {
    const tiposSelecionados =
      item?.tiposVistorias?.length
        ? this.mapTipoIdsToDescricoes(item.tiposVistorias)
        : [];

    return this.fb.group({
      descricao: [item?.descricao || '', [Validators.required, Validators.maxLength(300)]],
      sequencia: [item?.sequencia ?? null, [Validators.required, Validators.min(1)]],
      tiposvistorias: [tiposSelecionados, [Validators.required]],
      obrigafoto: [item?.obrigafoto ?? false],
      ativo: [item?.ativo ?? true],
    });
  }

  private buildPayload(form: FormGroup) {
    const value = form.value;
    return {
      descricao: value.descricao,
      sequencia: Number(value.sequencia),
      tiposvistorias: this.mapTipoDescricoesToIds(value.tiposvistorias || []),
      obrigafoto: !!value.obrigafoto,
      ativo: value.ativo,
    };
  }

  private mapTipoIdsToDescricoes(ids: string[]): string[] {
    if (!ids?.length) return [];
    const mapIdDesc = new Map(this.tiposVistoria.map((tipo) => [tipo.id, tipo.descricao]));
    return ids.map((id) => mapIdDesc.get(id)).filter((desc): desc is string => !!desc);
  }

  private mapTipoDescricoesToIds(descricoes: string[]): string[] {
    if (!descricoes?.length) return [];
    const mapDescId = new Map(this.tiposVistoria.map((tipo) => [tipo.descricao, tipo.id]));
    return descricoes.map((desc) => mapDescId.get(desc)).filter((id): id is string => !!id);
  }

  private applySequenciaFromOrder(): void {
    this.items.forEach((item, index) => {
      const newSeq = index + 1;
      item.sequencia = newSeq;
      const form = this.editForms.get(item.id);
      if (form) {
        form.get('sequencia')?.setValue(newSeq, { emitEvent: false });
      }
    });
  }

  private syncAllItemsSequencia(changed: ItemVistoriado[]): void {
    if (!this.allItems.length) return;
    const map = new Map(changed.map((item) => [item.id, item.sequencia]));
    this.allItems = this.allItems.map((item) => ({
      ...item,
      sequencia: map.get(item.id) ?? item.sequencia,
    }));
  }

  private getNextSequencia(): number {
    if (!this.allItems.length) return 1;
    const maxSeq = Math.max(...this.allItems.map((item) => item.sequencia || 0));
    return maxSeq + 1;
  }
}
