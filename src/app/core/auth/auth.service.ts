import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    private api: ApiService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // Kiểm tra token còn hiệu lực không
  isAccessTokenValid(): Promise<boolean> {
    if (!this.isBrowser) return Promise.resolve(false);

    const token = localStorage.getItem('accessToken');
    if (!token) return Promise.resolve(false);

    return this.api
      .post(
        '/auth/introspect',
        { accessToken: token },
        { headers: { 'skip-auth': 'true' } }
      )
      .toPromise()
      .then((res: any) => {
        return res.code === 200 && res.result?.valid === true;
      })
      .catch(() => {
        return this.refreshToken();
      });
  }

  // Lưu accessToken
  saveAccessToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem('accessToken', token);
    }
  }

  // Lưu refreshToken
  saveRefreshToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem('refreshToken', token);
    }
  }

  // Đăng xuất
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      this.router.navigate(['/login']);
    }
  }

  // Làm mới token
  refreshToken(): Promise<boolean> {
    if (!this.isBrowser) return Promise.resolve(false);

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return Promise.resolve(false);

    return this.api
      .post(
        '/auth/refresh',
        { refreshToken },
        { headers: { 'skip-auth': 'true' } }
      )
      .toPromise()
      .then((res: any) => {
        if (
          res.code === 200 &&
          res.result?.accessToken &&
          res.result?.refreshToken
        ) {
          this.saveAccessToken(res.result.accessToken);
          this.saveRefreshToken(res.result.refreshToken);
          return true;
        }
        return false;
      })
      .catch(() => false);
  }

  // Lấy token hiện tại
  getAccessToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('accessToken');
  }
}
