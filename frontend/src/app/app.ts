import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutComponent } from './components/layout/layout';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent],
  template: '<app-layout></app-layout>',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  async ngOnInit() {
    // No refresh (F5), o AuthService já verifica o token em background
    // Aqui só verificamos se não está na página de login e não há token local
    const currentPath = this.router.url;
    const isLoginPage = currentPath.includes('/login');
    
    if (!isLoginPage && !this.authService.isAuthenticated()) {
      // Se não está logado e não está na página de login, redirecionar
      this.router.navigate(['/login']);
    }
  }
}
