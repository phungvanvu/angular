import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8080/elec/api/v1';

  constructor(private http: HttpClient) {}

  post(url: string, data: any) {
    return this.http.post(`${this.baseUrl}${url}`, data);
  }

  get(url: string) {
    return this.http.get(`${this.baseUrl}${url}`);
  }
}
