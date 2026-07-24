import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Tab, TabList, Tabs } from 'primeng/tabs';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-auth',
  imports: [
    RouterOutlet,
    Tabs,
    TabList,
    Tab,
    RouterLink,
    NgStyle,
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
  constructor(public route: Router) {
    
  }

  tabs = [
    { route: '/auth', label: 'Login' },
    { route: '/auth/register', label: 'Register' },
  ];
}
