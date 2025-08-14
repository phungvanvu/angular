import { Component } from '@angular/core';
import { NgIf, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { ApiService } from '../core/api/api.service';

@Component({
  selector: 'login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, NgIf, FormsModule, MatIconModule, RouterOutlet],
})
export class LoginComponent {
  email = '';
  password = '';
  emailError = '';
  passwordError = '';
  error = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private api: ApiService
  ) {}

  signIn(form: any) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    this.resetErrors();

    this.api
      .post('/auth/login', {
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: (res: any) => {
          const { accessToken, refreshToken } = res.result;
          localStorage.setItem('accessToken', accessToken);
          this.authService.saveRefreshToken(refreshToken);

          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          const role = payload.scope;

          if (role.includes('ROLE_ADMIN')) {
            this.router.navigate(['/app-layout/dashboard']);
          } else if (role.includes('ROLE_USER')) {
            this.router.navigate(['/shop']);
          } else {
            this.error = 'Không xác định vai trò!';
          }
        },
        error: (err: any) => {
          try {
            const resData = err?.error;
            this.emailError = resData?.result?.email ?? '';
            this.passwordError = resData?.result?.password ?? '';
            if (!this.emailError && !this.passwordError && resData?.message) {
              this.error = resData.message;
            }
          } catch (e) {
            this.error = 'Đã xảy ra lỗi không xác định.';
          }
        },
      });
  }

  resetErrors() {
    this.emailError = '';
    this.passwordError = '';
    this.error = '';
  }
}
