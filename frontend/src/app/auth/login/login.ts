import { ChangeDetectorRef, Component } from '@angular/core';
import { Card } from 'primeng/card';
import { InputPassword } from 'primeng/inputpassword';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { Api } from '../../../services/api-client/api';
import { authControllerLogin } from '../../../services/api-client/functions';
import { Router } from '@angular/router';
import { TokenDto } from '../../../services/api-client/models/token-dto';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ProgressSpinner } from 'primeng/progressspinner';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    Card,
    InputPassword,
    InputText,
    FormsModule,
    ButtonDirective,
    ProgressSpinner,
    NgStyle,
  ],
  providers: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  constructor(private api: Api, private router: Router, private cdr: ChangeDetectorRef, private messageService: MessageService) {
  }

  isLoggingIn = false;

  username = '';
  password = '';

  async login() {
    this.isLoggingIn = true;
    const result: TokenDto | HttpErrorResponse = await this.api.invoke(authControllerLogin, { body: { username: this.username, password: this.password } }).catch(error => {
      return error;
    });
    this.isLoggingIn = false;
    this.cdr.markForCheck();
    if (result instanceof HttpErrorResponse) {
      this.messageService.add({ severity: 'error', summary: 'Something went wrong', detail: result?.error?.message ?? 'Login failed, ensure your credentials are correct', life: 5000, key: 'global' });
      return;
    }
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Logged in successfully', life: 5000, key: 'global' });
    localStorage.setItem('token', result.token);
    this.router.navigate(['/']);
  }
}
