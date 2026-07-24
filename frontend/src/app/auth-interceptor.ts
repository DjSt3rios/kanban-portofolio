import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('api/')) {
    const cloned = req.clone({
      setHeaders: {
        'Authorization': localStorage.getItem('token'),
      },
    });
    return next(cloned);
  }
  return next(req);
};
