import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { environment } from '../../../environments/environment';

import {
  catchError,
  map,
  of,
  tap,
  Observable,
  throwError,
  distinctUntilChanged,
  BehaviorSubject,
  ReplaySubject,
  delay,
} from 'rxjs';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { User } from '../interfaces/user.inferface';
import { Auth } from '../interfaces/auth.interface';
import { BYPASS_LOG } from '../interceptors/auth.interceptor';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(private apiService: ApiService, private jwtService: JwtService) {}

  private setAuth(res: Auth) {
    this.jwtService.saveToken(res.token);
    this.currentUserSubject.next(res.user);
    this.isAuthenticatedSubject.next(true);
  }

  private handleError(error: HttpErrorResponse) {
    const { status } = error;

    if (status >= 400 && status < 500) {
      return new Error('Email o contraseña incorrecta');
    }
    return new Error('Algo salió mal');
  }

  attemptAuth(
    type: string,
    email: string,
    password: string
  ): Observable<boolean> {
    const path = type === 'login' ? 'login' : 'register';

    return this.apiService.post(`/auth/${path}`, { email, password }).pipe(
      tap((res) => {
        this.setAuth(res);
      }),
      catchError((error) => {
        return throwError(() => this.handleError(error));
      })
    );
  }

  refreshSession(): Observable<boolean> {
    return this.apiService
      .get('/auth/refresh', {
        context: new HttpContext().set(BYPASS_LOG, true),
      })
      .pipe(
        map((res) => {
          this.setAuth(res);
          return res.ok;
        }),
        catchError(() => {
          return of(false);
        })
      );
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

  cleanAuth(): Observable<boolean> {
    return this.apiService
      .get('/auth/logout', { context: new HttpContext().set(BYPASS_LOG, true) })
      .pipe(
        map((res) => {
          this.isAuthenticatedSubject.next(false);
          this.currentUserSubject.next({} as User);
          this.jwtService.destroyToken();

          return res.ok;
        }),
        catchError(() => of(false))
      );
  }
}
