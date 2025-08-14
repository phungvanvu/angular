import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8080/elec/api/v1';

  constructor(private http: HttpClient) {}

  post(url: string, data: any, options: any = {}) {
    let headers = options.headers || {};
    if (!(data instanceof FormData)) {
      headers = { 'Content-Type': 'application/json', ...headers };
    }
    return this.http.post(`${this.baseUrl}${url}`, data, {
      ...options,
      headers,
    });
  }

  get(url: string, options: any = {}) {
    return this.http.get(`${this.baseUrl}${url}`, options);
  }

  put(url: string, data: any, options: any = {}) {
    const defaultHeaders = { 'Content-Type': 'application/json' };
    const headers = { ...defaultHeaders, ...(options.headers || {}) };
    return this.http.put(`${this.baseUrl}${url}`, data, {
      ...options,
      headers,
    });
  }

  delete(url: string, options: any = {}) {
    const defaultHeaders = { 'Content-Type': 'application/json' };
    const headers = { ...defaultHeaders, ...(options.headers || {}) };
    return this.http.delete(`${this.baseUrl}${url}`, { ...options, headers });
  }
}
