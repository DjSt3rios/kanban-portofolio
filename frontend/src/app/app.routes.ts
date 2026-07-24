import { Routes } from '@angular/router';
import { Register } from './auth/register/register';
import { Login } from './auth/login/login';
import { Auth } from './auth/auth';
import { Board } from './board/board';
import { authGuard } from './auth-guard';
import { loggedInGuard } from './logged-in-guard';

export const routes: Routes = [{
  path: '',
  pathMatch: 'full',
  component: Board,
  canActivate: [authGuard],

},
  {
    path: 'auth',
    component: Auth,
    pathMatch: 'prefix',
    canActivate: [loggedInGuard],
    children: [{
      path: 'register',
      component: Register,
    }, {
      path: '',
      component: Login,
    },
    ],
  }];
