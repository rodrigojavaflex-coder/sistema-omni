import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const permissionGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const required = (route.data?.['permissions'] as string[] | undefined) ?? [];

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (authService.hasAnyPermission(required)) {
    return true;
  }

  router.navigate(['/home']);
  return false;
};
