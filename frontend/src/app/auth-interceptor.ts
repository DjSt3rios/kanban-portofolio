import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const messageService = inject(MessageService);
  if (req.url.includes('api/')) {
    const token = localStorage.getItem('token');
    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `${token}`,
        },
      });
      return next(cloned).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            localStorage.removeItem('token');
            router.navigateByUrl('/auth');
            messageService.add({
              severity: 'error',
              life: 5000,
              summary: 'Error',
              detail: 'Your authentication token is invalid or has expired. Please login again',
              closable: false,
              key: 'global',
            });
          }
          return throwError(() => error);
        }),
      );
    }

  }
  return next(req);
};
