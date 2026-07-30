import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('api/')) {
    const token = localStorage.getItem('token');
    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `${token}`,
        },
      });
      return next(cloned);
    }

  }
  return next(req);
};
