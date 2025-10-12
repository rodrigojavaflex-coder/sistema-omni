import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService, NavigationService } from '../../services/index';
import { Usuario, Permission } from '../../models/usuario.model';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
  requiredPermissions: Permission[];
}

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.css']
})
export class NavigationComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private navigationService = inject(NavigationService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  currentUser: Usuario | null = null;
  visibleMenuItems: MenuItem[] = [];

  // Estados do menu através do serviço
  get isMobileOpen() { return this.navigationService.isMobileOpen; }

  // Definir todos os itens de menu disponíveis
  private allMenuItems: MenuItem[] = [
    {
      label: 'Configuração',
      route: '/configuracao',
      icon: 'feather-settings',
      requiredPermissions: [Permission.CONFIGURACAO_ACCESS]
    },
      // Dashboard removido do menu
    {
      label: 'Usuários',
      route: '/users',
      icon: 'feather-users',
      requiredPermissions: [Permission.USER_CREATE, Permission.USER_READ, Permission.USER_UPDATE, Permission.USER_DELETE]
    },
      {
        label: 'Auditoria',
        route: '/auditoria',
        icon: 'feather-search',
        requiredPermissions: [Permission.AUDIT_VIEW, Permission.AUDIT_MANAGE]
      },
    {
      label: 'Relatórios',
      route: '/reports',
      icon: 'feather-bar-chart-2',
      requiredPermissions: [Permission.REPORTS_VIEW, Permission.REPORTS_EXPORT]
    },
    {
      label: 'Perfis',
      route: '/perfil',
      icon: 'feather-users',
      requiredPermissions: [
        Permission.PROFILE_CREATE,
        Permission.PROFILE_READ,
        Permission.PROFILE_UPDATE,
        Permission.PROFILE_DELETE
      ]
    }
  ];

  ngOnInit() {
    // Observar mudanças no usuário atual
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        this.updateVisibleMenuItems();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Verifica se o menu deve estar visível (sempre true agora)
   */
  get shouldShowExpanded(): boolean {
    return true; // Menu sempre expandido quando visível
  }

  /**
   * Atualiza os itens de menu visíveis baseado nas permissões do usuário
   */
  private updateVisibleMenuItems() {
    if (!this.currentUser) {
      this.visibleMenuItems = [];
      return;
    }

    this.visibleMenuItems = this.allMenuItems.filter(menuItem => {
      // Se não requer permissões, mostrar sempre
      if (menuItem.requiredPermissions.length === 0) {
        return true;
      }

  // Verificar se usuário tem pelo menos uma das permissões necessárias (via perfil)
  return this.authService.hasAnyPermission(menuItem.requiredPermissions);
    });
  }

  /**
   * Realiza logout do usuário
   */
  async logout() {
    // Fechar o menu antes de fazer logout
    this.navigationService.closeOnNavigation();
    
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro, navegar para login
      this.router.navigate(['/login']);
    }
  }

  /**
   * Verifica se uma rota está ativa
   */
  isRouteActive(route: string): boolean {
    return this.router.url === route;
  }

  /**
   * Manipula o clique em um item do menu
   */
  onMenuItemClick(): void {
    this.navigationService.closeOnNavigation();
  }
}