import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Usuario } from '../../../models/usuario.model';

type ThemeOption = 'light' | 'dark';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css']
})
export class UserMenuComponent {
  @Input({ required: true }) user!: Usuario;
  @Input() sessionActiveFor = '--';
  @Input() tokenExpiresIn = '--';
  @Input() currentTheme: ThemeOption | null = 'light';

  @Output() themeChange = new EventEmitter<ThemeOption>();
  @Output() changePassword = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  showUserDropdown = false;

  toggleUserDropdown(): void {
    this.showUserDropdown = !this.showUserDropdown;
  }

  closeUserDropdown(): void {
    this.showUserDropdown = false;
  }

  onThemeSelected(theme: ThemeOption): void {
    this.themeChange.emit(theme);
    this.closeUserDropdown();
  }

  requestPasswordChange(): void {
    this.changePassword.emit();
    this.closeUserDropdown();
  }

  requestLogout(): void {
    this.logout.emit();
    this.closeUserDropdown();
  }

  formatDepartamentos(deps: { nomeDepartamento: string }[] | undefined): string {
    if (!deps || deps.length === 0) return 'N/D';
    return deps.map(dep => dep.nomeDepartamento).join(', ');
  }
}

