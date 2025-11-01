import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toasts; track toast.id) {
        <div 
          class="toast toast-{{ toast.type }}"
          [class.toast-show]="toast.show"
          [class.toast-hide]="!toast.show"
        >
          <div class="toast-content">
            <div class="toast-icon">
              @switch (toast.type) {
                @case ('success') { <svg class="icon-success" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg> }
                @case ('error') { <svg class="icon-error" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg> }
                @case ('warning') { <svg class="icon-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> }
                @case ('info') { <svg class="icon-info" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> }
              }
            </div>
            <div class="toast-message">{{ toast.message }}</div>
          </div>
          <button class="toast-close" (click)="removeToast(toast.id)" title="Fechar">
            ×
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 400px;
      max-width: 600px;
    }

    .toast {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 20px 24px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
      animation: slideDown 0.5s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .toast-hide {
      animation: slideUp 0.5s ease-out forwards;
    }

    @keyframes slideUp {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(-30px);
      }
    }

    /* Tema Claro */
    .toast-success {
      border: none;
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.08);
    }

    .toast-error {
      border: none;
      background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.08);
    }

    .toast-warning {
      border: none;
      background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
      box-shadow: 0 2px 8px rgba(245, 158, 11, 0.08);
    }

    .toast-info {
      border: none;
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.08);
    }

    /* Tema Escuro */
    :host-context(body.theme-dark) .toast-success {
      border: none;
      background: linear-gradient(135deg, #1a4d3e 0%, #2a5f50 100%);
      box-shadow: 0 4px 16px rgba(16, 185, 129, 0.1);
    }

    :host-context(body.theme-dark) .toast-error {
      border: none;
      background: linear-gradient(135deg, #4a2020 0%, #6b3030 100%);
      box-shadow: 0 4px 16px rgba(239, 68, 68, 0.1);
    }

    :host-context(body.theme-dark) .toast-warning {
      border: none;
      background: linear-gradient(135deg, #5a3d1a 0%, #7a5a2a 100%);
      box-shadow: 0 4px 16px rgba(245, 158, 11, 0.1);
    }

    :host-context(body.theme-dark) .toast-info {
      border: none;
      background: linear-gradient(135deg, #1a3a5a 0%, #2a4a7a 100%);
      box-shadow: 0 4px 16px rgba(59, 130, 246, 0.1);
    }

    :host-context(body.theme-dark) .toast-message {
      color: #f3f4f6 !important;
    }

    :host-context(body.theme-dark) .toast-close {
      color: #d1d5db !important;
    }

    :host-context(body.theme-dark) .toast-close:hover {
      color: #f9fafb !important;
      background: rgba(255, 255, 255, 0.1);
    }

    .toast-content {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
    }

    .toast-icon {
      font-size: 28px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
    }

    .icon-success,
    .icon-error,
    .icon-warning,
    .icon-info {
      width: 24px;
      height: 24px;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .toast-success .icon-success {
      color: #10b981;
    }

    .toast-error .icon-error {
      color: #ef4444;
    }

    .toast-warning .icon-warning {
      color: #f59e0b;
    }

    .toast-info .icon-info {
      color: #3b82f6;
    }

    :host-context(body.theme-dark) .toast-success .icon-success {
      color: #6ee7b7;
    }

    :host-context(body.theme-dark) .toast-error .icon-error {
      color: #fca5a5;
    }

    :host-context(body.theme-dark) .toast-warning .icon-warning {
      color: #fcd34d;
    }

    :host-context(body.theme-dark) .toast-info .icon-info {
      color: #93c5fd;
    }

    .toast-message {
      flex: 1;
      font-size: 15px;
      line-height: 1.6;
      color: #1f2937;
      font-weight: 500;
      text-align: center;
    }

    .toast-close {
      background: none;
      border: none;
      font-size: 28px;
      cursor: pointer;
      color: #6b7280;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.2s;
      border-radius: 6px;
    }

    .toast-close:hover {
      color: #1f2937;
      background: rgba(0, 0, 0, 0.05);
    }

    /* Responsivo */
    @media (max-width: 768px) {
      .toast-container {
        min-width: 90vw;
        max-width: 90vw;
      }

      .toast {
        padding: 16px 20px;
      }

      .toast-message {
        font-size: 14px;
      }

      .toast-icon {
        font-size: 24px;
      }

      .toast-close {
        font-size: 24px;
        width: 28px;
        height: 28px;
      }
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Array<Notification & { id: number; show: boolean }> = [];
  private subscription?: Subscription;
  private nextId = 1;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.notification$.subscribe(
      (notification) => {
        this.addToast(notification);
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private addToast(notification: Notification): void {
    const id = this.nextId++;
    const toast = { ...notification, id, show: true };
    
    // Remove toasts anteriores do mesmo tipo para não acumular
    this.toasts = this.toasts.filter(t => t.type !== notification.type);
    
    this.toasts.push(toast);

    // Remove automaticamente após 5 segundos
    setTimeout(() => {
      this.removeToast(id);
    }, 5000);
  }

  removeToast(id: number): void {
    const toast = this.toasts.find(t => t.id === id);
    if (toast) {
      toast.show = false;
      // Remove do array após a animação (500ms)
      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t.id !== id);
      }, 500);
    }
  }
}
