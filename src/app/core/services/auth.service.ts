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
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading = this.loadingSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated = this.isAuthenticatedSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  constructor(
    private apiService: ApiService,
    private jwtService: JwtService,
    private router: Router
  ) {}

  private setAuth(res: Auth) {
    this.jwtService.saveToken(res.token);
    this.currentUserSubject.next(res.user);
    this.isAuthenticatedSubject.next(true);
  }

  private handleAuthError(error: HttpErrorResponse) {
    const { status } = error;

    if (status === 409) {
      return new Error('El email ya se encuentra registrado');
    }
    if (status >= 400 && status < 500) {
      return new Error('Email o contraseña incorrecta');
    }
    return new Error('Algo salió mal. Inténtelo más tarde.');
  }

  private handleProfileError(error: HttpErrorResponse) {
    const { status } = error;

    if (status === 409) {
      return new Error('El nombre de usuario ya existe');
    }
    return new Error('Algo salió mal. Inténtelo más tarde.');
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
        return throwError(() => this.handleAuthError(error));
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
          this.router.navigateByUrl('/login');
          return res.ok;
        }),
        catchError(() => of(false))
      );
  }

  updateProfile(body: Object): Observable<any> {
    return this.apiService
      .put(`/profile/${this.getCurrentUser().id}`, body)
      .pipe(
        map((data) => this.currentUserSubject.next(data)),
        catchError((err) => throwError(() => this.handleProfileError(err)))
      );
  }

  setLoading(status: boolean) {
    this.loadingSubject.next(status);
  }
}
