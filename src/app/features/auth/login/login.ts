import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/auth/login-request.model';
import { Button } from '../../../shared/components/button/button';
import { FormField } from '../../../shared/components/form-field/form-field';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    Button,
    FormField
  ],
  templateUrl: './login.html'
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  username = signal('');
  password = signal('');

  loading = signal(false);
  error = signal<string | null>(null);

  login(): void {
    const request: LoginRequest = {
      username: this.username(),
      password: this.password()
    };

    this.loading.set(true);
    this.error.set(null);

    this.authService.login(request).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.error.set('Invalid username or password.');
        this.loading.set(false);
      }
    });
  }
}