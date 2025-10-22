import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar se está autenticado localmente
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // Verificar se o token ainda é válido no servidor (apenas se necessário)
  try {
    const isTokenValid = await authService.validateToken();
    
    if (!isTokenValid) {
      router.navigate(['/login']);
      return false;
    }

    return true;
  } catch (error) {
    // Em caso de erro de rede, permitir acesso se o token local existe
    console.warn('Erro ao validar token, permitindo acesso com token local:', error);
    return authService.isAuthenticated();
  }
};