import { Component, inject, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { ErrorModalService, AuthService, NavigationService } from '../../services';
import { CommonModule, DOCUMENT } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation';
import { HeaderComponent } from '../header/header'; // Importar HeaderComponent

import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { ToastComponent } from '../toast/toast.component';
import { Subject, filter, takeUntil } from 'rxjs';
import { MenuState } from '../../services/navigation.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavigationComponent, HeaderComponent, ErrorModalComponent, ToastComponent], // Adicionar ToastComponent
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class LayoutComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private navigationService = inject(NavigationService);
  private router = inject(Router);
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);
  public errorModalService = inject(ErrorModalService);
  private destroy$ = new Subject<void>();
  
  isAuthenticated = false;
  isDesktop = true;
  menuState: MenuState = 'hidden';
  isBiViewerRoute = false;

  ngOnInit() {
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(authenticated => (this.isAuthenticated = authenticated));
    
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

    this.isBiViewerRoute = this.checkIfBiViewerRoute(this.router.url);
    this.syncBiViewerScaleClass();

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe((event) => {
        this.isBiViewerRoute = this.checkIfBiViewerRoute(event.urlAfterRedirects);
        this.syncBiViewerScaleClass();
        if (this.isBiViewerRoute) {
          this.navigationService.closeMenu();
        }
      });
  }

  closeMenu() {
    this.navigationService.closeMenu();
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.documentElement, 'bi-viewer-scale-reset');
    this.destroy$.next();
    this.destroy$.complete();
  }

  get isMobileOverlayVisible(): boolean {
    return !this.isDesktop && this.menuState === 'open';
  }

  private checkIfBiViewerRoute(url: string): boolean {
    return url.startsWith('/bi-acesso/view/');
  }

  private syncBiViewerScaleClass(): void {
    const htmlElement = this.document.documentElement;
    if (this.isBiViewerRoute) {
      this.renderer.addClass(htmlElement, 'bi-viewer-scale-reset');
      return;
    }
    this.renderer.removeClass(htmlElement, 'bi-viewer-scale-reset');
  }
}