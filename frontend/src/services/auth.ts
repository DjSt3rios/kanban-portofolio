import { Service, signal } from '@angular/core';

@Service()
export class Auth {
  isLoggedIn = signal(false);

  constructor() {
    if (localStorage.getItem('token')) {
      this.isLoggedIn.set(true);
    }
  }
}
