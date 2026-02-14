import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-confirmation-modal',
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" *ngIf="isVisible" (click)="onOverlayClick($event)">
      <div class="modal-container">
        <div class="modal-header">
          <h3>{{ title }}</h3>
        </div>
        <div class="modal-body">
          <p *ngIf="!messageHtml">{{ message }}</p>
          <div *ngIf="messageHtml" [innerHTML]="messageHtml"></div>
        </div>
        <div class="modal-footer">
          <button *ngIf="cancelText" class="btn btn-secondary" (click)="onCancel()">
            {{ cancelText }}
          </button>
          <button class="btn {{ cancelText ? 'btn-danger' : 'btn-primary' }}" (click)="onConfirm()">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
    styleUrls: ['./confirmation-modal.css']
})
export class ConfirmationModalComponent {
  @Input() isVisible = false;
  @Input() title = 'Confirmação';
  @Input() message = 'Tem certeza que deseja continuar?';
  /** Quando informado, exibe HTML em vez de message (use conteúdo confiável/sanitizado). */
  @Input() messageHtml?: SafeHtml;
  @Input() confirmText = 'Sim';
  @Input() cancelText = 'Cancelar';
  
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}