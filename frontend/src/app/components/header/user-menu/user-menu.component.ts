import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { Usuario } from '../../../models/usuario.model';
import { AppVersionService } from '../../../services/app-version.service';

type ThemeOption = 'light' | 'dark';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css']
})
export class UserMenuComponent implements OnInit {
  private appVersionService = inject(AppVersionService);

  @Input({ required: true }) user!: Usuario;
  @Input() sessionActiveFor = '--';
  @Input() tokenExpiresIn = '--';
  @Input() currentTheme: ThemeOption | null = 'light';

  @Output() themeChange = new EventEmitter<ThemeOption>();
  @Output() changePassword = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  showUserDropdown = false;
  appVersionLabel = '';
  appVersionDateLabel = '';
  appBuildLabel = '';

  ngOnInit(): void {
    void this.carregarVersaoAplicacao();
  }

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

  atualizarSistema(): void {
    this.closeUserDropdown();
    void this.appVersionService.forceReload();
  }

  formatDepartamentos(deps: { nomeDepartamento: string }[] | undefined): string {
    if (!deps || deps.length === 0) return 'N/D';
    return deps.map(dep => dep.nomeDepartamento).join(', ');
  }

  formatEmpresa(user: Usuario): string {
    const descricao = user.empresa?.descricao?.trim();
    if (descricao) {
      return descricao;
    }
    return user.idEmpresa ? 'Empresa vinculada' : 'N/D';
  }

  formatPerfis(perfis: { nomePerfil: string }[] | undefined): string {
    if (!perfis || perfis.length === 0) return 'N/D';
    return perfis.map((perfil) => perfil.nomePerfil).join(', ');
  }

  private async carregarVersaoAplicacao(): Promise<void> {
    const info = await this.appVersionService.getCurrentVersion();
    this.appVersionLabel = this.appVersionService.formatVersionLabel(info);
    this.appVersionDateLabel = this.appVersionService.formatVersionDateLabel(info);
    this.appBuildLabel = this.appVersionService.formatBuildLabel(info);
  }
}
