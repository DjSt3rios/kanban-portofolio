import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const loggedIn = Boolean(localStorage.getItem('token'));
  if (!loggedIn) {
    const router = inject(Router);
    return router.createUrlTree(['/auth']);
  }
  return true;
};
