// category.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { map } from 'rxjs/operators';

export interface Category {
  imageUrl: string;
  searchable: boolean;
  id: number;
  name: string;
  parentId?: number | null;
  isOpen?: boolean;
  children?: Category[];
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl =
    'https://electacme-production-app-0b1dc16f2bb0.herokuapp.com//elec/api/v1/categories';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {}

  private getAuthHeaders(): HttpHeaders {
    let token: string | null = null;
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('accessToken');
    }
    if (!token) {
      throw new Error('Không có accessToken. Vui lòng đăng nhập lại.');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getCategories(): Observable<any[]> {
    return this.http
      .get<{ code: number; message: string; result: any[] }>(this.baseUrl, {
        headers: this.getAuthHeaders(),
      })
      .pipe(map((response) => response.result));
  }

  createCategory(formData: {
    id: number | null;
    name: string;
    searchable: boolean;
    status: boolean;
    imageUrl: string;
    parentId?: number | null;
  }): Observable<any> {
    const payload = {
      name: formData.name,
      searchable: formData.searchable,
      isActive: formData.status,
      imageUrl: formData.imageUrl,
      parentId: formData.parentId ?? null,
    };
    return this.http.post(this.baseUrl, payload, {
      headers: this.getAuthHeaders(),
    });
  }

  updateCategory(
    id: number,
    formData: {
      id: number | null;
      name: string;
      searchable: boolean;
      status: boolean;
      imageUrl: string;
      parentId?: number | null;
    }
  ): Observable<any> {
    const payload = {
      id: formData.id,
      name: formData.name,
      searchable: formData.searchable,
      isActive: formData.status,
      imageUrl: formData.imageUrl,
      parentId: formData.parentId ?? null,
    };
    return this.http.put(`${this.baseUrl}/${id}`, payload, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
