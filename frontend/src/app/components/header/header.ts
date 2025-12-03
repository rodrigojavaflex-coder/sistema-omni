import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService, NavigationService, ThemeService } from '../../services/index';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal';
import { ChangePasswordModalComponent } from '../change-password-modal/change-password-modal';
import { ToastNotificationComponent } from '../toast-notification/toast-notification';
import { UserMenuComponent } from './user-menu/user-menu.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmationModalComponent, ChangePasswordModalComponent, ToastNotificationComponent, UserMenuComponent],
  templateUrl: './header.html',
  styleUrls: ['./header.css', './dropdown-item.css']
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private navigationService = inject(NavigationService);
  private themeService = inject(ThemeService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();
  
  currentUser$ = this.authService.currentUser$;
  currentTheme$ = this.themeService.currentTheme$;
  
  // Propriedades para o modal de confirmação
  showLogoutModal = false;
  
  sessionActiveFor = '--';
  tokenExpiresIn = '--';
  private sessionInfoIntervalId?: any;

  // Propriedade para controlar o modal de alteração de senha
  showChangePasswordModal = false;

  // Propriedades para notificações
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' | 'info' = 'info';

  ngOnInit() {
    // Observar mudanças de tema para mostrar notificação
    this.themeService.themeChanged.subscribe(({ message }) => {
      this.showToastMessage(message, 'info');
    });

    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateSessionInfo();
      });

    this.updateSessionInfo();
    this.sessionInfoIntervalId = setInterval(() => {
      this.updateSessionInfo();
    }, 30000); // atualizar a cada 30s
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.sessionInfoIntervalId) {
      clearInterval(this.sessionInfoIntervalId);
    }
  }

  toggleMenu() {
    this.navigationService.toggleMenu();
  }

  logout() {
    // Abrir modal de confirmação em vez de fazer logout direto
    this.showLogoutModal = true;
  }

  confirmLogout() {
    this.showLogoutModal = false;
    this.authService.logout();
  }

  cancelLogout() {
    this.showLogoutModal = false;
  }
  
  setTheme(theme: 'light' | 'dark') {
    this.themeService.setTheme(theme);
  }

  openChangePasswordModal() {
    this.showChangePasswordModal = true;
  }

  onChangePasswordClosed() {
    this.showChangePasswordModal = false;
  }

  onPasswordChanged() {
    this.showChangePasswordModal = false;
  }

  onSuccessMessage(message: string) {
    this.toastMessage = message;
    this.toastType = 'success';
    this.showToast = true;
  }

  onErrorMessage(message: string) {
    this.toastMessage = message;
    this.toastType = 'error';
    this.showToast = true;
  }

  showToastMessage(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
  }

  onToastClosed() {
    this.showToast = false;
  }
  
  private updateSessionInfo() {
    const sessionMs = this.authService.getSessionDurationMs();
    const expiresMs = this.authService.getAccessTokenExpiresInMs();

    this.sessionActiveFor = sessionMs !== null ? this.formatDuration(sessionMs, true) : '--';
    this.tokenExpiresIn = expiresMs !== null ? this.formatDuration(Math.max(0, expiresMs)) : '--';
  }

  private formatDuration(durationMs: number, isElapsed: boolean = false): string {
    const totalMinutes = Math.floor(durationMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours <= 0) {
      if (minutes <= 0) {
        return isElapsed ? '<1min' : 'menos de 1min';
      }
      return `${minutes}min`;
    }

    if (minutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${minutes}min`;
  }
}
