import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { buildBiLinkPermissionKey } from '../config/route-permissions';

export const permissionGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const dynamicParam = route.data?.['dynamicPermissionParam'] as string | undefined;
  const required = dynamicParam
    ? [buildBiLinkPermissionKey(route.paramMap.get(dynamicParam) ?? '')]
    : ((route.data?.['permissions'] as string[] | undefined) ?? []);

  if (required.length === 0 || required.some((permission) => !permission || permission.endsWith(':'))) {
    if (dynamicParam) {
      router.navigate(['/']);
      return false;
    }
    return true;
  }

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (authService.hasAnyPermission(required)) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
