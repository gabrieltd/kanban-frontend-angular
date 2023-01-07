import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  get(
    path: string,
    options?: {
      params?: HttpParams;
      headers?: HttpHeaders;
      context?: HttpContext;
    }
  ): Observable<any> {
    return this.http.get(`${environment.apiUrl}${path}`, {
      withCredentials: true,
      ...options,
    });
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.http.post(`${environment.apiUrl}${path}`, body, {
      withCredentials: true,
    });
  }

  put(path: string, body: Object | Object[]): Observable<any> {
    return this.http.put(`${environment.apiUrl}${path}`, body, {
      withCredentials: true,
    });
  }

  delete(path: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}${path}`, {
      withCredentials: true,
    });
  }
}
