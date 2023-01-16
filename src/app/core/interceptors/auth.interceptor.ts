import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpContextToken,
} from '@angular/common/http';
import { catchError, Observable, of, throwError, tap, switchMap } from 'rxjs';
import { JwtService } from '../services/jwt.service';
import { AuthService } from '../services/auth.service';
import { take } from 'rxjs';
import { Router } from '@angular/router';

export const BYPASS_LOG = new HttpContextToken(() => false);

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    private router: Router
  ) {}

  accessToken = this.jwtService.getToken();
  sessionRefreshed = false;

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.context.get(BYPASS_LOG) === true) {
      return next.handle(request);
    }

    const req = this.validateAccessToken(request);

    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          return this.validateRefreshToken(request, next);
        }
        return throwError(() => err);
      })
    );
  }

  private validateAccessToken(request: HttpRequest<any>): HttpRequest<any> {
    const accessToken = this.jwtService.getToken();

    if (accessToken) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
    return request;
  }

  private validateRefreshToken(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authService.refreshSession().pipe(
      switchMap((res) => {
        this.accessToken = this.jwtService.getToken();

        const authRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        });

        return next.handle(authRequest);
      }),

      catchError((err) => {
        this.authService
          .cleanAuth()
          .pipe(
            take(1),
            tap(() => {
              this.router.navigateByUrl('/login');
            })
          )
          .subscribe();
        return of(err);
      })
    );
  }
}
