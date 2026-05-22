import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService, BiAcessoLinkService, NavigationService } from '../../services/index';
import { Usuario, Permission } from '../../models/usuario.model';
import { MenuItem, MENU_CONFIGURATION } from '../../models/menu.model';
import { MenuState } from '../../services/navigation.service';
import { BiAcessoMenuItem } from '../../models/bi-acesso-link.model';
import { getNavigationMenuIconHtml } from '../../config/navigation-icons';

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
  private biAcessoLinkService = inject(BiAcessoLinkService);
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
  private dynamicBiMenuItems: MenuItem[] = [];

  ngOnInit() {
    // Observar mudanças no usuário atual
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        if (!user) {
          this.dynamicBiMenuItems = [];
          this.rebuildMenu();
          return;
        }
        this.loadDynamicBiMenuItems();
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

  private loadDynamicBiMenuItems(): void {
    this.biAcessoLinkService
      .getMyMenu()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (items) => {
          this.dynamicBiMenuItems = this.mapBiMenuItems(items);
          this.rebuildMenu();
        },
        error: () => {
          this.dynamicBiMenuItems = [];
          this.rebuildMenu();
        },
      });
  }

  private mapBiMenuItems(items: BiAcessoMenuItem[]): MenuItem[] {
    return items
      .sort((a, b) => (a.order || 999) - (b.order || 999))
      .map((item) => ({
        label: item.label,
        route: `/bi-acesso/view/${item.id}`,
        icon: 'feather-bar-chart-2',
        requiredPermissions: [item.permissionKey],
        parentMenu: item.group || 'Gestão',
        order: item.order || 999,
      }));
  }

  private rebuildMenu(): void {
    this.allMenuItems = this.buildMenuWithDynamicBiItems();
    this.updateVisibleMenuItems();
    this.updateSearchableItems();
  }

  private buildMenuWithDynamicBiItems(): MenuItem[] {
    const cloned = this.cloneMenuItems(MENU_CONFIGURATION.items);
    const gestaoMenu = cloned.find((item) => item.label === 'Gestão' && item.isSubmenu);
    if (!gestaoMenu?.submenuItems) {
      return cloned;
    }

    const biMenu = gestaoMenu.submenuItems.find(
      (item) => item.label === 'BI' && item.isSubmenu,
    );
    if (!biMenu) {
      return cloned;
    }

    biMenu.submenuItems = this.dynamicBiMenuItems;
    return cloned;
  }

  private cloneMenuItems(items: MenuItem[]): MenuItem[] {
    return items.map((item) => ({
      ...item,
      requiredPermissions: [...item.requiredPermissions],
      submenuItems: item.submenuItems ? this.cloneMenuItems(item.submenuItems) : undefined,
    }));
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

      if (item.route || item.externalUrl) {
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

  isHomeActive(): boolean {
    const url = this.router.url.split('?')[0];
    return url === '/' || url === '';
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
    return this.sanitizer.bypassSecurityTrustHtml(getNavigationMenuIconHtml(iconName));
  }
}
