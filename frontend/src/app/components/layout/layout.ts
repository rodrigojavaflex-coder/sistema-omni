import { Component, inject, OnInit } from '@angular/core';
import { ErrorModalService, AuthService, NavigationService } from '../../services';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation';
import { HeaderComponent } from '../header/header'; // Importar HeaderComponent

import { ErrorModalComponent } from '../error-modal/error-modal.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavigationComponent, HeaderComponent, ErrorModalComponent], // Adicionar HeaderComponent e ErrorModalComponent
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class LayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private navigationService = inject(NavigationService);
  public errorModalService = inject(ErrorModalService);
  
  isAuthenticated = false;
  isMenuOpen = false; // Menu inicia fechado por padrão
  isDesktop = window.innerWidth > 768;

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe(
      authenticated => this.isAuthenticated = authenticated
    );
    
    // Para desktop, usar o estado isMobileOpen para controlar visibilidade
    // Para mobile, também usar isMobileOpen
    this.navigationService.isMobileOpen$.subscribe(
      isOpen => {
        this.isMenuOpen = isOpen;
      }
    );

    // Detectar mudanças de tamanho da tela
    window.addEventListener('resize', () => {
      this.isDesktop = window.innerWidth > 768;
    });
  }

  closeMenu() {
    this.navigationService.closeMobile();
  }
}