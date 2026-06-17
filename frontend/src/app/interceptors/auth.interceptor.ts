import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, switchMap, from } from 'rxjs';
import { AuthService } from '../services/auth.service';

const PUBLIC_API_URL_FRAGMENTS = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/health',
  '/api/health',
  '/documentos/publico/',
] as const;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const isPublicUrl = PUBLIC_API_URL_FRAGMENTS.some((url) => req.url.includes(url));

  if (isPublicUrl) {
    return next(req);
  }

  const token = authService.getAccessToken();

  if (token && !req.headers.has('Authorization')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'X-Client-Version': '1.0.0',
        'X-Request-ID': `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          if (!req.url.includes('/auth/refresh') && token) {
            console.warn('Token expirado, tentando refresh...');
            return from(authService.refreshToken()).pipe(
              switchMap(newToken => {
                if (newToken) {
                  const newReq = req.clone({
                    setHeaders: {
                      Authorization: `Bearer ${newToken}`,
                    },
                  });
                  return next(newReq);
                }

                console.warn('Refresh token falhou');
                return throwError(() => error);
              }),
              catchError(() => {
                console.warn('Erro no refresh');
                return throwError(() => error);
              }),
            );
          } else {
            console.warn('Token invalido ou ausente');
          }
          break;

        case 403:
          console.warn('Acesso negado: usuario nao possui permissao para este recurso');
          break;

        case 0:
          console.error('Erro de conectividade: nao foi possivel conectar ao servidor');
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          console.error(`Erro no servidor (${error.status}): ${error.message}`);
          break;

        default:
          console.warn(`Erro HTTP ${error.status}: ${error.message}`);
      }

      return throwError(() => error);
    }),
  );
};
