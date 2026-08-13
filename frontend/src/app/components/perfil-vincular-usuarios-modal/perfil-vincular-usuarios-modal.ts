import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Usuario } from '../../models/usuario.model';

export interface PerfilVincularUsuariosConfirmPayload {
  adicionar: string[];
  remover: string[];
}

@Component({
  selector: 'app-perfil-vincular-usuarios-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-vincular-usuarios-modal.html',
  styleUrls: ['./perfil-vincular-usuarios-modal.css'],
})
export class PerfilVincularUsuariosModalComponent implements OnChanges {
  private userService = inject(UserService);

  @Input() visible = false;
  @Input() perfilNome = '';
  @Input() alreadyLinkedIds: string[] = [];
  /** Permite remover vínculos de usuários já associados ao perfil. */
  @Input() canUnassignUsers = false;
  /** Permite marcar novos usuários para vínculo. */
  @Input() canAssignUsers = true;

  @Output() closed = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<PerfilVincularUsuariosConfirmPayload>();

  searchTerm = '';
  allUsuarios: Usuario[] = [];
  selectedIds = new Set<string>();
  unlinkIds = new Set<string>();
  loading = false;
  saving = false;
  error: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue === true) {
      this.resetState();
      this.loadAllUsuarios();
    }
  }

  private resetState(): void {
    this.searchTerm = '';
    this.allUsuarios = [];
    this.selectedIds = new Set<string>();
    this.unlinkIds = new Set<string>();
    this.error = null;
    this.saving = false;
  }

  private loadAllUsuarios(page = 1, acc: Usuario[] = []): void {
    this.loading = true;
    this.error = null;
    this.userService.getUsers({ page, limit: 100 }).subscribe({
      next: (res) => {
        const combined = [...acc, ...(res.data ?? [])];
        if (res.meta.hasNextPage) {
          this.loadAllUsuarios(page + 1, combined);
          return;
        }
        this.allUsuarios = combined.sort((a, b) =>
          a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }),
        );
        this.loading = false;
      },
      error: () => {
        this.allUsuarios = [];
        this.loading = false;
        this.error = 'Erro ao carregar usuários';
      },
    });
  }

  get filteredUsuarios(): Usuario[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.allUsuarios;
    }
    return this.allUsuarios.filter(
      (u) =>
        u.nome.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term),
    );
  }

  isLinked(usuarioId: string): boolean {
    return this.alreadyLinkedIds.includes(usuarioId);
  }

  isMarkedForUnlink(usuarioId: string): boolean {
    return this.unlinkIds.has(usuarioId);
  }

  isSelected(usuarioId: string): boolean {
    return this.selectedIds.has(usuarioId);
  }

  isRowChecked(usuarioId: string): boolean {
    if (this.isLinked(usuarioId)) {
      return !this.isMarkedForUnlink(usuarioId);
    }
    return this.isSelected(usuarioId);
  }

  isRowDisabled(usuarioId: string): boolean {
    if (this.saving) {
      return true;
    }
    if (this.isLinked(usuarioId)) {
      return !this.canUnassignUsers;
    }
    return !this.canAssignUsers;
  }

  toggleUsuario(usuario: Usuario, checked: boolean): void {
    if (this.isLinked(usuario.id)) {
      if (!this.canUnassignUsers) {
        return;
      }
      const next = new Set(this.unlinkIds);
      if (checked) {
        next.delete(usuario.id);
      } else {
        next.add(usuario.id);
      }
      this.unlinkIds = next;
      this.error = null;
      return;
    }
    if (!this.canAssignUsers) {
      return;
    }
    const next = new Set(this.selectedIds);
    if (checked) {
      next.add(usuario.id);
    } else {
      next.delete(usuario.id);
    }
    this.selectedIds = next;
    this.error = null;
  }

  get selectedAddCount(): number {
    return this.selectedIds.size;
  }

  get selectedRemoveCount(): number {
    return this.unlinkIds.size;
  }

  get hasPendingChanges(): boolean {
    return this.selectedAddCount > 0 || this.selectedRemoveCount > 0;
  }

  get confirmButtonLabel(): string {
    if (this.saving) {
      return 'Salvando...';
    }
    const add = this.selectedAddCount > 0;
    const remove = this.selectedRemoveCount > 0;
    if (add && remove) {
      return 'Aplicar alterações';
    }
    if (remove) {
      return 'Remover vínculos';
    }
    return 'Vincular';
  }

  onCancel(): void {
    this.closed.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }

  onConfirm(): void {
    if (!this.hasPendingChanges) {
      this.error = 'Selecione ao menos uma alteração';
      return;
    }
    if (this.selectedAddCount > 0 && !this.canAssignUsers) {
      this.error = 'Sem permissão para vincular usuários';
      return;
    }
    if (this.selectedRemoveCount > 0 && !this.canUnassignUsers) {
      this.error = 'Sem permissão para remover vínculos';
      return;
    }
    this.confirm.emit({
      adicionar: [...this.selectedIds],
      remover: [...this.unlinkIds],
    });
  }

  setSaving(value: boolean): void {
    this.saving = value;
  }

  setError(message: string | null): void {
    this.error = message;
  }
}
