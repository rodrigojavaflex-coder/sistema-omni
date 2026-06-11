import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Permission } from '../models/usuario.model';

/** Permite alterar senha do próprio usuário ou de outro com permissão de edição. */
export const changePasswordGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const targetUserId = route.paramMap.get('id');
  const currentUser = authService.getCurrentUser();

  if (!authService.isAuthenticated() || !currentUser) {
    router.navigate(['/login']);
    return false;
  }

  if (
    targetUserId === currentUser.id ||
    authService.hasPermission(Permission.USER_UPDATE)
  ) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
