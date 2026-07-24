import { ChangeDetectorRef, Component } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Card } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { InputPassword } from 'primeng/inputpassword';
import { InputText } from 'primeng/inputtext';
import { Api } from '../../../services/api-client/api';
import { Router } from '@angular/router';
import { authControllerRegister } from '../../../services/api-client/functions';
import { MessageService } from 'primeng/api';
import { TokenDto } from '../../../services/api-client/models/token-dto';
import { HttpErrorResponse } from '@angular/common/http';
import { ProgressSpinner } from 'primeng/progressspinner';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [
    ButtonDirective,
    Card,
    FormsModule,
    InputPassword,
    InputText,
    ProgressSpinner,
    NgStyle,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  constructor(private api: Api, private router: Router, private messageService: MessageService, private cdr: ChangeDetectorRef) {
  }

  requirements = [
    { id: 'minLength', label: 'At least 3 characters', test: (v: string) => v.length >= 3 },
  ];
  username = '';
  password = '';
  isRegistering = false;

  async register() {
    const errors = this.requirements.find((req) => req.test(this.password) === false);
    if (errors) {
      return;
    }
    this.isRegistering = true;
    const result: TokenDto | HttpErrorResponse = await this.api.invoke(authControllerRegister, { body: { username: this.username, password: this.password } }).catch(error => {
      return error;
    });
    this.isRegistering = false;
    this.cdr.markForCheck();
    if (result instanceof HttpErrorResponse) {
      this.messageService.add({ severity: 'error', summary: 'Something went wrong', detail: result?.error?.message ?? 'Register failed, please try again', life: 5000, key: 'global' });
      return;
    }
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Registration successful!', life: 5000, key: 'global' });
    localStorage.setItem('token', result.token);
    this.router.navigate(['/']);
  }
}
