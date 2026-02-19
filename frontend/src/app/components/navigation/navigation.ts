import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService, NavigationService } from '../../services/index';
import { Usuario, Permission } from '../../models/usuario.model';
import { MenuItem, MENU_CONFIGURATION } from '../../models/menu.model';
import { MenuState } from '../../services/navigation.service';

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
  menuState: MenuState = 'open';
  private isDesktop = true;

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

    this.navigationService.menuState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.menuState = state;
      });

    this.navigationService.viewport$
      .pipe(takeUntil(this.destroy$))
      .subscribe(viewport => {
        this.isDesktop = viewport === 'desktop';
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
    if (!this.isDesktop) {
      return true;
    }
    return this.menuState === 'open';
  }

  /**
   * Atualiza os itens de menu visíveis baseado nas permissões do usuário
   */
  private updateVisibleMenuItems() {
    if (!this.currentUser) {
      this.visibleMenuItems = [];
      return;
    }

    this.visibleMenuItems = this.filterMenuItems(this.allMenuItems)
      .sort((a, b) => (a.order || 999) - (b.order || 999));
  }

  /**
   * Verifica se o usuário tem permissão para ver um item de menu
   */
  private hasMenuPermission(menuItem: MenuItem): boolean {
    if (menuItem.isSubmenu && menuItem.submenuItems?.length) {
      return menuItem.submenuItems.some((subItem) => this.hasMenuPermission(subItem));
    }
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

  getSubmenuKey(parentLabel: string, childLabel?: string): string {
    return childLabel ? `${parentLabel}::${childLabel}` : parentLabel;
  }

  /**
   * Atualiza os itens pesquisáveis baseado nas permissões do usuário
   */
  private updateSearchableItems(): void {
    this.allSearchableItems = [];
    
    if (!this.currentUser) return;

    this.collectSearchableItems(this.allMenuItems);
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

  private filterMenuItems(items: MenuItem[]): MenuItem[] {
    return items
      .filter((menuItem) => this.hasMenuPermission(menuItem))
      .map((menuItem) => {
        if (menuItem.isSubmenu && menuItem.submenuItems) {
          const filteredSub = this.filterMenuItems(menuItem.submenuItems);
          return {
            ...menuItem,
            submenuItems: filteredSub,
          };
        }
        return menuItem;
      })
      .filter((menuItem) => {
        if (menuItem.isSubmenu) {
          return !!menuItem.submenuItems?.length;
        }
        return true;
      });
  }

  private collectSearchableItems(items: MenuItem[], parentPath: string[] = []): void {
    items.forEach((item) => {
      if (!this.hasMenuPermission(item)) return;

      if (item.isSubmenu && item.submenuItems?.length) {
        this.collectSearchableItems(item.submenuItems, [...parentPath, item.label]);
        return;
      }

      if (item.route) {
        const parentMenu = parentPath.length ? parentPath.join(' / ') : undefined;
        this.allSearchableItems.push({
          ...item,
          parentMenu,
        });
      }
    });
  }

  private filterMenuByQuery(
    items: MenuItem[],
    normalizedQuery: string,
    parentLabel?: string,
  ): MenuItem[] {
    const results: MenuItem[] = [];

    items.forEach((menuItem) => {
      const normalizedLabel = this.normalizeString(menuItem.label);

      if (menuItem.isSubmenu && menuItem.submenuItems?.length) {
        const key = parentLabel
          ? this.getSubmenuKey(parentLabel, menuItem.label)
          : this.getSubmenuKey(menuItem.label);

        if (normalizedLabel.includes(normalizedQuery)) {
          results.push(menuItem);
          this.expandedSubmenus.add(key);
          return;
        }

        const filteredChildren = this.filterMenuByQuery(
          menuItem.submenuItems,
          normalizedQuery,
          key,
        );

        if (filteredChildren.length) {
          results.push({
            ...menuItem,
            submenuItems: filteredChildren,
          });
          this.expandedSubmenus.add(key);
        }
        return;
      }

      if (normalizedLabel.includes(normalizedQuery)) {
        results.push(menuItem);
      }
    });

    return results;
  }

  /**
   * Aplica filtro visual no menu baseado na query de pesquisa
   */
  private applyMenuFilter(normalizedQuery: string): void {
    this.isFilterActive = true;
    this.filteredMenuItems = this.filterMenuByQuery(this.visibleMenuItems, normalizedQuery);
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
      'feather-alert-circle': '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
      'feather-briefcase': '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path><path d="M2 13h20"></path></svg>',
      'feather-target': '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>',
      'feather-activity': '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>',
      'feather-check': '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>',
      'feather-check-square': '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>',
      'feather-grid': '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
      'feather-pie-chart': '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>',
      'feather-tag': '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>',
      'feather-map-pin': '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
      'feather-archive': '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>'
    };
    
    const iconSvg = icons[iconName] || icons['feather-settings'];
    return this.sanitizer.bypassSecurityTrustHtml(iconSvg);
  }
}
