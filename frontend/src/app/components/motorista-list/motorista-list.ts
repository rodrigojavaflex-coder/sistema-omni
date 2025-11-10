import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { BaseListComponent } from '../base-list.component';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal';
import { HistoricoAuditoriaComponent } from '../historico-auditoria/historico-auditoria.component';
import { Motorista } from '../../models/motorista.model';
import { StatusMotorista } from '../../models/status-motorista.enum';
import { MotoristaService } from '../../services/motorista.service';
import { AuthService } from '../../services/auth.service';
import { Permission } from '../../models/usuario.model';

@Component({
  selector: 'app-motorista-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ConfirmationModalComponent,
    HistoricoAuditoriaComponent
  ],
  templateUrl: './motorista-list.html',
  styleUrls: ['./motorista-list.css']
})
export class MotoristaListComponent extends BaseListComponent<Motorista> {
  private motoristaService = inject(MotoristaService);
  private router = inject(Router);

  // Filtros individuais
  filterNome = '';
  filterMatricula = '';
  filterCpf = '';
  filterStatus = '';
  
  statusOptions = Object.values(StatusMotorista);
  
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;

  // Controle de debounce para pesquisa
  private filterTimeout: any;

  // Auditoria
  showAuditModal = false;
  selectedItemForAudit: Motorista | null = null;

  // Permissões
  canCreate = this.authService.hasPermission(Permission.MOTORISTA_CREATE);
  canEdit = this.authService.hasPermission(Permission.MOTORISTA_UPDATE);
  canDelete = this.authService.hasPermission(Permission.MOTORISTA_DELETE);
  canAudit = this.authService.hasPermission(Permission.MOTORISTA_AUDIT);

  protected override loadItems(): void {
    this.loading = true;
    this.error = '';

    this.motoristaService.getAll(
      this.currentPage, 
      this.pageSize, 
      undefined, // search geral (não usado quando há filtros específicos)
      this.filterNome || undefined,
      this.filterMatricula || undefined,
      this.filterCpf || undefined,
      this.filterStatus || undefined
    ).subscribe({
      next: (response) => {
        this.items = response.data;
        this.totalItems = response.total;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar motoristas';
        this.loading = false;
        console.error('Erro ao carregar motoristas:', err);
      }
    });
  }

  protected override deleteItem(id: string) {
    return this.motoristaService.delete(id);
  }

  protected override getId(item: Motorista): string {
    return item.id;
  }

  onFilterChange(): void {
    // Debounce para evitar muitas requisições
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }
    
    this.filterTimeout = setTimeout(() => {
      this.currentPage = 1;
      this.loadItems();
    }, 500); // Aguarda 500ms após parar de digitar
  }

  clearFilters(): void {
    this.filterNome = '';
    this.filterMatricula = '';
    this.filterCpf = '';
    this.filterStatus = '';
    this.currentPage = 1;
    this.loadItems();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadItems();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadItems();
  }

  onNew(): void {
    this.router.navigate(['/motorista/new']);
  }

  onEdit(item: Motorista): void {
    this.router.navigate(['/motorista/edit', item.id]);
  }

  onDelete(item: Motorista): void {
    this.confirmDelete(item, `Deseja realmente excluir o motorista ${item.nome}?`);
  }

  openAuditModal(item: Motorista): void {
    this.selectedItemForAudit = item;
    this.showAuditModal = true;
  }

  closeAuditModal(): void {
    this.showAuditModal = false;
    this.selectedItemForAudit = null;
  }

  formatDate(date: string): string {
    if (!date) return '-';
    // Pega apenas a parte da data (YYYY-MM-DD) e formata sem problema de timezone
    const dateParts = date.split('T')[0].split('-');
    const [year, month, day] = dateParts;
    return `${day}/${month}/${year}`;
  }

  formatCPF(cpf: string): string {
    if (!cpf) return '-';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  /** Implementação dos métodos de exportação */
  protected loadAllItemsForExport(): Observable<Motorista[]> {
    return new Observable<Motorista[]>(observer => {
      const allItems: Motorista[] = [];
      let currentPage = 1;
      const pageLimit = 100; // Limite máximo aceito pelo backend

      const loadPage = () => {
        this.motoristaService.getAll(
          currentPage,
          pageLimit,
          undefined, // search
          this.filterNome || undefined,
          this.filterMatricula || undefined,
          this.filterCpf || undefined,
          this.filterStatus || undefined
        ).subscribe({
          next: (response) => {
            allItems.push(...response.data);
            
            // Calcular total de páginas
            const totalPages = Math.ceil(response.total / pageLimit);
            
            // Se ainda há mais páginas, continua buscando
            if (currentPage < totalPages) {
              currentPage++;
              loadPage();
            } else {
              // Terminou de buscar todas as páginas
              observer.next(allItems);
              observer.complete();
            }
          },
          error: (error) => {
            observer.error(error);
          }
        });
      };

      loadPage();
    });
  }

  /** Exportação para Excel com todos os campos */
  protected override getExportDataExcel(items: Motorista[]): { headers: string[], data: any[][] } {
    const formatExcelDate = (date: string | undefined): string => {
      if (!date) return '-';
      const dateParts = date.split('T')[0].split('-');
      const [year, month, day] = dateParts;
      return `${day}/${month}/${year}`;
    };

    const headers = [
      'Nome',
      'Matrícula',
      'CPF',
      'Identidade',
      'Sexo',
      'Data de Nascimento',
      'Data de Habilitação',
      'Validade da Habilitação',
      'Data de Admissão',
      'Data Curso Transporte',
      'Data Exame Toxicológico',
      'Email',
      'Telefone',
      'Celular',
      'Endereço',
      'Bairro',
      'Cidade',
      'CEP',
      'Terceirizado',
      'Status'
    ];
    
    const data = items.map(item => [
      item.nome || '-',
      item.matricula || '-',
      this.formatCPF(item.cpf),
      item.identidade || '-',
      item.sexo || '-',
      formatExcelDate(item.dataNascimento),
      formatExcelDate(item.dataHabilitacao),
      formatExcelDate(item.validadeDaHabilitacao),
      formatExcelDate(item.dataAdmissao),
      formatExcelDate(item.dataCursoTransporte),
      formatExcelDate(item.dataExameToxicologico),
      item.email || '-',
      item.telefone || '-',
      item.celular || '-',
      item.endereco || '-',
      item.bairro || '-',
      item.cidade || '-',
      item.cep || '-',
      item.terceirizado || '-',
      item.status || '-'
    ]);
    return { headers, data };
  }

  /** Exportação para PDF com campos reduzidos para melhor layout */
  protected override getExportDataPDF(items: Motorista[]): { headers: string[], data: any[][] } {
    const headers = [
      'Nome',
      'Matrícula',
      'CPF',
      'Telefone',
      'Celular',
      'Status'
    ];
    
    const data = items.map(item => [
      item.nome || '-',
      item.matricula || '-',
      this.formatCPF(item.cpf),
      item.telefone || '-',
      item.celular || '-',
      item.status || '-'
    ]);
    return { headers, data };
  }

  protected getExportFileName(): string {
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR').replace(/\//g, '-');
    return `Motoristas_${dateStr}`;
  }

  protected getTableDisplayName(): string {
    return 'Motoristas';
  }
}
