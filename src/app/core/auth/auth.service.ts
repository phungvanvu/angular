import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private api: ApiService, private router: Router) {}

  setRefreshToken(token: string) {
    document.cookie = `refreshToken=${token}; path=/; secure; samesite=strict`;
  }

  getRefreshToken(): string | null {
    const token = document.cookie
      .split('; ')
      .find((c) => c.startsWith('refreshToken='));
    return token?.split('=')[1] || null;
  }

  logout() {
    localStorage.removeItem('accessToken');
    document.cookie =
      'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    this.router.navigate(['/login']);
  }

  async refreshAccessToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const res: any = await this.api
        .post('/auth/refresh', { token: refreshToken })
        .toPromise();
      localStorage.setItem('accessToken', res.result.accessToken);
      this.setRefreshToken(res.result.refreshToken);
      return true;
    } catch {
      this.logout();
      return false;
    }
  }

  async isAccessTokenValid(): Promise<boolean> {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;

    try {
      const res: any = await this.api
        .post('/auth/introspect', { token })
        .toPromise();
      return res.success && res.data.valid;
    } catch {
      return await this.refreshAccessToken();
    }
  }
}
