import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService, NavigationService } from '../../services/index';
import { Usuario, Permission } from '../../models/usuario.model';
import { MenuItem, MENU_CONFIGURATION } from '../../models/menu.model';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.css']
})
export class NavigationComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private navigationService = inject(NavigationService);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private destroy$ = new Subject<void>();

  currentUser: Usuario | null = null;
  visibleMenuItems: MenuItem[] = [];
  expandedSubmenus: Set<string> = new Set();

  // Propriedades para pesquisa
  searchQuery = '';
  private searchSubject = new Subject<string>();
  private allSearchableItems: MenuItem[] = [];
  
  // Propriedades para filtro visual do menu
  filteredMenuItems: MenuItem[] = [];
  isFilterActive = false;

  // Estados do menu através do serviço
  get isMobileOpen() { return this.navigationService.isMobileOpen; }

  // Definir todos os itens de menu disponíveis
  private allMenuItems: MenuItem[] = MENU_CONFIGURATION.items;

  ngOnInit() {
    // Observar mudanças no usuário atual
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        this.updateVisibleMenuItems();
        this.updateSearchableItems();
      });

    // Configurar debounce para pesquisa
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.executeSearch(query);
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

    this.visibleMenuItems = this.allMenuItems
      .filter(menuItem => this.hasMenuPermission(menuItem))
      .map(menuItem => ({
        ...menuItem,
        submenuItems: menuItem.submenuItems?.filter(subItem => this.hasMenuPermission(subItem)) || []
      }))
      .filter(menuItem => {
        // Remover submenus vazios
        if (menuItem.isSubmenu && (!menuItem.submenuItems || menuItem.submenuItems.length === 0)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => (a.order || 999) - (b.order || 999));
  }

  /**
   * Verifica se o usuário tem permissão para ver um item de menu
   */
  private hasMenuPermission(menuItem: MenuItem): boolean {
    // Se não requer permissões, mostrar sempre
    if (menuItem.requiredPermissions.length === 0) {
      return true;
    }

    // Verificar se usuário tem pelo menos uma das permissões necessárias (via perfil)
    return this.authService.hasAnyPermission(menuItem.requiredPermissions);
  }

  /**
   * Alterna a expansão de um submenu
   */
  toggleSubmenu(menuLabel: string): void {
    if (this.expandedSubmenus.has(menuLabel)) {
      this.expandedSubmenus.delete(menuLabel);
    } else {
      this.expandedSubmenus.add(menuLabel);
    }
  }

  /**
   * Verifica se um submenu está expandido
   */
  isSubmenuExpanded(menuLabel: string): boolean {
    return this.expandedSubmenus.has(menuLabel);
  }

  /**
   * Atualiza os itens pesquisáveis baseado nas permissões do usuário
   */
  private updateSearchableItems(): void {
    this.allSearchableItems = [];
    
    if (!this.currentUser) return;

    // Coletar todos os itens que o usuário tem acesso (incluindo subitems)
    this.allMenuItems.forEach(item => {
      if (this.hasMenuPermission(item)) {
        if (item.isSubmenu && item.submenuItems) {
          // Adicionar subitems que o usuário tem permissão
          item.submenuItems.forEach(subItem => {
            if (this.hasMenuPermission(subItem)) {
              this.allSearchableItems.push({
                ...subItem,
                parentMenu: item.label
              });
            }
          });
        } else if (item.route) {
          // Adicionar item direto (que tem rota)
          this.allSearchableItems.push(item);
        }
      }
    });
  }

  /**
   * Métodos de pesquisa
   */
  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.searchSubject.next(this.searchQuery);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.isFilterActive = false;
    this.filteredMenuItems = [];
  }

  private executeSearch(query: string): void {
    if (query.trim().length < 2) {
      this.isFilterActive = false;
      this.filteredMenuItems = [];
      return;
    }

    // Normalizar query removendo acentos
    const normalizedQuery = this.normalizeString(query);
    
    // Aplicar filtro visual no menu
    this.applyMenuFilter(normalizedQuery);
  }

  /**
   * Normaliza string removendo acentos e convertendo para minúsculas
   */
  private normalizeString(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  /**
   * Aplica filtro visual no menu baseado na query de pesquisa
   */
  private applyMenuFilter(normalizedQuery: string): void {
    this.isFilterActive = true;
    this.filteredMenuItems = [];

    this.visibleMenuItems.forEach(menuItem => {
      const normalizedMenuLabel = this.normalizeString(menuItem.label);
      
      if (menuItem.isSubmenu && menuItem.submenuItems) {
        // Filtrar subitens que correspondem à pesquisa
        const matchingSubitems = menuItem.submenuItems.filter(subItem => {
          const normalizedSubLabel = this.normalizeString(subItem.label);
          return normalizedSubLabel.includes(normalizedQuery);
        });

        // Se há subitens correspondentes, incluir o menu pai com apenas os subitens filtrados
        if (matchingSubitems.length > 0) {
          this.filteredMenuItems.push({
            ...menuItem,
            submenuItems: matchingSubitems
          });
          // Auto-expandir submenu que tem resultados
          this.expandedSubmenus.add(menuItem.label);
        } else if (normalizedMenuLabel.includes(normalizedQuery)) {
          // Se o nome do submenu corresponde, mostrar todos os subitens
          this.filteredMenuItems.push(menuItem);
          this.expandedSubmenus.add(menuItem.label);
        }
      } else {
        // Menu direto (sem submenu)
        if (normalizedMenuLabel.includes(normalizedQuery)) {
          this.filteredMenuItems.push(menuItem);
        }
      }
    });
  }

  /**
   * Retorna os itens de menu a serem exibidos (filtrados ou todos)
   */
  getDisplayMenuItems(): MenuItem[] {
    return this.isFilterActive ? this.filteredMenuItems : this.visibleMenuItems;
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
    // Limpar filtro ao clicar em qualquer item do menu
    this.clearSearch();
    this.navigationService.closeOnNavigation();
  }

  /**
   * Retorna o SVG do ícone baseado no nome
   */
  getMenuIcon(iconName: string): SafeHtml {
    const icons: { [key: string]: string } = {
      'feather-home': '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
      'feather-users': '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
      'feather-search': '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
      'feather-bar-chart-2': '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>',
      'feather-settings': '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9.51 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9.51a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
      'feather-truck': '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16,8 20,8 23,11 23,16 16,16"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>',
      'feather-database': '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>',
      'feather-shield': '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
      'feather-file-text': '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10,9 9,9 8,9"></polyline></svg>',
      'feather-user': '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
      'feather-layers': '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',
      'feather-alert-circle': '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>'
    };
    
    const iconSvg = icons[iconName] || icons['feather-settings'];
    return this.sanitizer.bypassSecurityTrustHtml(iconSvg);
  }
}