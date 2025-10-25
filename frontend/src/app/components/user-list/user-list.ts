import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserService } from '../../services';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { Usuario, PaginatedResponse, FindUsuariosDto, Permission } from '../../models/usuario.model';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal';
import { HistoricoAuditoriaComponent } from '../historico-auditoria/historico-auditoria.component';
import { BaseListComponent } from '../base-list.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationModalComponent, HistoricoAuditoriaComponent],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css']
})
export class UserListComponent extends BaseListComponent<Usuario> {
  private userService = inject(UserService);
  private router = inject(Router);

  // Paginação
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;

  // Filtros
  nameFilter = '';
  emailFilter = '';
  /** Título do modal de confirmação de exclusão */
  deleteModalTitle = 'Confirmação de Exclusão';

  // Modal de auditoria
  showAuditModal = false;
  selectedUserForAudit: Usuario | null = null;

  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected override loadItems(): void {
    this.loading = true;
    this.error = '';

    const filters: FindUsuariosDto = { page: this.currentPage, limit: this.pageSize };

    if (this.nameFilter.trim()) {
      filters.nome = this.nameFilter.trim();
    }

    if (this.emailFilter.trim()) {
      filters.email = this.emailFilter.trim();
    }

    this.userService.getUsers(filters).subscribe({
      next: (response: PaginatedResponse<Usuario>) => {
        this.items = response.data;
        this.totalItems = response.meta.total;
        this.totalPages = response.meta.totalPages;
        this.loading = false;
      },
      error: (_: any) => {
        this.loading = false;
        this.errorModalService.show('Erro ao carregar usuários', 'Erro');
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadItems();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadItems();
  }

  clearFilters(): void {
    this.nameFilter = '';
    this.emailFilter = '';
    this.currentPage = 1;
    this.loadItems();
  }

  editUser(user: Usuario): void {
    this.router.navigate(['/users/edit', user.id]);
  }

  deleteUser(user: Usuario): void {
    this.confirmDelete(user, `Tem certeza que deseja excluir o usuário "${user.nome}"?`);
  }

  protected override deleteItem(id: string) {
    return this.userService.deleteUser(id);
  }
  protected override getId(item: Usuario): string {
    return item.id;
  }
  /** Navegar para criação de usuário */
  createUser(): void {
    this.router.navigate(['/users/new']);
  }

  /** Imprimir informações do usuário */
  printUser(user: Usuario): void {
    // Buscar dados completos do usuário antes de imprimir
    this.userService.getUserById(user.id).subscribe({
      next: (userData: Usuario) => {
        this.generatePrintReport(userData);
      },
      error: (error: any) => {
        console.error('Erro ao buscar dados do usuário:', error);
        alert('Erro ao gerar relatório. Tente novamente.');
      }
    });
  }

  private generatePrintReport(user: Usuario): void {
    // Gerar HTML do relatório
    const permissionsList = user.perfil && user.perfil.permissoes && user.perfil.permissoes.length > 0
      ? user.perfil.permissoes.map(p => `<li>${this.formatPermission(p)}</li>`).join('')
      : '<li style="color: #666; font-style: italic;">Nenhuma permissão atribuída</li>';

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Relatório de Usuário - ${user.nome}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
            background: white;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
          }
          .header h1 {
            margin: 0 0 10px 0;
            color: #333;
            font-size: 24px;
          }
          .header p {
            color: #666;
            font-size: 14px;
          }
          .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
          }
          .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 15px;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 8px;
          }
          .info-row {
            display: flex;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .info-label {
            font-weight: bold;
            width: 200px;
            color: #555;
            flex-shrink: 0;
          }
          .info-value {
            flex: 1;
            color: #333;
          }
          .status-badge {
            display: inline-block;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
          }
          .status-active {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
          }
          .status-inactive {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
          }
          .permissions-list {
            list-style: none;
            padding: 0;
            margin: 10px 0;
          }
          .permissions-list li {
            padding: 6px 0 6px 25px;
            position: relative;
            color: #333;
            line-height: 1.6;
          }
          .permissions-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #28a745;
            font-weight: bold;
            font-size: 16px;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 20px;
            page-break-inside: avoid;
          }
          @media print {
            body { padding: 10px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Relatório de Usuário</h1>
          <p>Sistema OMNI - Gestão de Transporte</p>
        </div>

        <div class="section">
          <div class="section-title">Informações Pessoais</div>
          <div class="info-row">
            <span class="info-label">Nome:</span>
            <span class="info-value">${user.nome}</span>
          </div>
          <div class="info-row">
            <span class="info-label">E-mail:</span>
            <span class="info-value">${user.email}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Status:</span>
            <span class="info-value">
              <span class="status-badge ${user.ativo ? 'status-active' : 'status-inactive'}">
                ${user.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Perfil e Permissões</div>
          <div class="info-row">
            <span class="info-label">Perfil:</span>
            <span class="info-value">${user.perfil ? user.perfil.nomePerfil : 'Não atribuído'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Total de Permissões:</span>
            <span class="info-value">${user.perfil && user.perfil.permissoes ? user.perfil.permissoes.length : 0}</span>
          </div>
          <div class="info-row" style="flex-direction: column;">
            <span class="info-label" style="margin-bottom: 10px;">Permissões:</span>
            <ul class="permissions-list">
              ${permissionsList}
            </ul>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Informações do Sistema</div>
          <div class="info-row">
            <span class="info-label">Data de Criação:</span>
            <span class="info-value">${new Date(user.criadoEm).toLocaleString('pt-BR')}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Última Atualização:</span>
            <span class="info-value">${new Date(user.atualizadoEm).toLocaleString('pt-BR')}</span>
          </div>
        </div>

        <div class="footer">
          <p><strong>Relatório gerado em:</strong> ${new Date().toLocaleString('pt-BR')}</p>
          <p>Sistema OMNI - Gestão de Transporte</p>
        </div>
      </body>
      </html>
    `;

    // Criar blob e abrir em nova aba
    const blob = new Blob([printContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');
    
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          URL.revokeObjectURL(url);
        }, 250);
      };
    }
  }

  private formatPermission(permission: string): string {
    // Converter permissão em texto legível
    const permissionMap: { [key: string]: string } = {
      'user:create': 'Criar usuários',
      'user:read': 'Visualizar usuários',
      'user:update': 'Editar usuários',
      'user:delete': 'Excluir usuários',
      'user:audit': 'Visualizar auditoria de usuários',
      'perfil:create': 'Criar perfis',
      'perfil:read': 'Visualizar perfis',
      'perfil:update': 'Editar perfis',
      'perfil:delete': 'Excluir perfis',
      'veiculo:create': 'Criar veículos',
      'veiculo:read': 'Visualizar veículos',
      'veiculo:update': 'Editar veículos',
      'veiculo:delete': 'Excluir veículos',
      'veiculo:audit': 'Auditar veículos',
      'motorista:create': 'Criar motoristas',
      'motorista:read': 'Visualizar motoristas',
      'motorista:update': 'Editar motoristas',
      'motorista:delete': 'Excluir motoristas',
      'motorista:audit': 'Auditar motoristas',
      'audit:view': 'Visualizar auditoria',
      'audit:manage': 'Gerenciar auditoria',
      'reports:view': 'Visualizar relatórios',
      'reports:export': 'Exportar relatórios',
      'system:config': 'Configurar sistema',
      'system:logs': 'Visualizar logs do sistema',
      'configuracao:access': 'Acessar configurações'
    };
    
    return permissionMap[permission] || permission;
  }

  // Métodos para verificar permissões
  canCreateUser(): boolean {
    return this.authService.hasPermission(Permission.USER_CREATE);
  }

  canReadUser(): boolean {
    return this.authService.hasPermission(Permission.USER_READ);
  }

  canEditUser(): boolean {
    return this.authService.hasPermission(Permission.USER_UPDATE);
  }

  canDeleteUser(): boolean {
    return this.authService.hasPermission(Permission.USER_DELETE);
  }

  canAuditUser(): boolean {
    return this.authService.hasPermission(Permission.USER_AUDIT);
  }

  /** Abrir modal de histórico de auditoria */
  openAuditHistory(user: Usuario): void {
    this.selectedUserForAudit = user;
    this.showAuditModal = true;
  }

  /** Fechar modal de auditoria */
  closeAuditModal(): void {
    this.showAuditModal = false;
    this.selectedUserForAudit = null;
  }

  /** Implementação dos métodos de exportação */
  protected loadAllItemsForExport(): Observable<Usuario[]> {
    return new Observable<Usuario[]>(observer => {
      const allItems: Usuario[] = [];
      let currentPage = 1;
      const pageLimit = 100; // Limite máximo aceito pelo backend

      const loadPage = () => {
        const filters: FindUsuariosDto = { 
          page: currentPage, 
          limit: pageLimit
        };

        if (this.nameFilter.trim()) {
          filters.nome = this.nameFilter.trim();
        }

        if (this.emailFilter.trim()) {
          filters.email = this.emailFilter.trim();
        }

        this.userService.getUsers(filters).subscribe({
          next: (response: PaginatedResponse<Usuario>) => {
            allItems.push(...response.data);
            
            // Se ainda há mais páginas, continua buscando
            if (currentPage < response.meta.totalPages) {
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

  protected getExportDataExcel(items: Usuario[]): { headers: string[], data: any[][] } {
    const headers = ['Nome', 'E-mail', 'Perfil', 'Status', 'Criado em'];
    const data = items.map(item => [
      item.nome,
      item.email,
      item.perfil ? item.perfil.nomePerfil : 'Sem perfil',
      item.ativo ? 'Ativo' : 'Inativo',
      new Date(item.criadoEm).toLocaleDateString('pt-BR')
    ]);
    return { headers, data };
  }

  

  protected getExportDataPDF(items: Usuario[]): { headers: string[], data: any[][] } {
    const headers = ['Nome', 'E-mail', 'Perfil', 'Status', 'Criado em'];
    const data = items.map(item => [
      item.nome,
      item.email,
      item.perfil ? item.perfil.nomePerfil : 'Sem perfil',
      item.ativo ? 'Ativo' : 'Inativo',
      new Date(item.criadoEm).toLocaleDateString('pt-BR')
    ]);
    return { headers, data };
  }

  protected getExportFileName(): string {
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR').replace(/\//g, '-');
    return `Usuarios_${dateStr}`;
  }

  protected getTableDisplayName(): string {
    return 'Usuários';
  }
}
