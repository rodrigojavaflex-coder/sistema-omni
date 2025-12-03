import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ErrorModalService, AuthService, NavigationService } from '../../services';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation';
import { HeaderComponent } from '../header/header'; // Importar HeaderComponent

import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { ToastComponent } from '../toast/toast.component';
import { Subject, takeUntil } from 'rxjs';
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
  public errorModalService = inject(ErrorModalService);
  private destroy$ = new Subject<void>();
  
  isAuthenticated = false;
  isDesktop = true;
  menuState: MenuState = 'open';

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
  }

  closeMenu() {
    this.navigationService.closeMenu();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get isMobileOverlayVisible(): boolean {
    return !this.isDesktop && this.menuState === 'open';
  }
}