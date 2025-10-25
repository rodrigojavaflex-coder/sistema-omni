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
                @case ('success') { ✅ }
                @case ('error') { ❌ }
                @case ('warning') { ⚠️ }
                @case ('info') { ℹ️ }
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
      border: 2px solid #10b981;
      background: #f0fdf4;
    }

    .toast-error {
      border: 2px solid #ef4444;
      background: #fef2f2;
    }

    .toast-warning {
      border: 2px solid #f59e0b;
      background: #fffbeb;
    }

    .toast-info {
      border: 2px solid #3b82f6;
      background: #eff6ff;
    }

    /* Tema Escuro */
    :host-context(body.theme-dark) .toast-success {
      border: 2px solid #10b981;
      background: #064e3b;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
    }

    :host-context(body.theme-dark) .toast-error {
      border: 2px solid #ef4444;
      background: #7f1d1d;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
    }

    :host-context(body.theme-dark) .toast-warning {
      border: 2px solid #f59e0b;
      background: #78350f;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
    }

    :host-context(body.theme-dark) .toast-info {
      border: 2px solid #3b82f6;
      background: #1e3a8a;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
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
