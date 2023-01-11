import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable, tap, take, map, delay } from 'rxjs';
import { AuthService } from '../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const init = Object.keys(this.authService.getCurrentUser()).length === 0;

    if (init) {
      this.authService.setLoading(true);

      return this.authService.refreshSession().pipe(
        map((res) => {
          this.authService.setLoading(false);
          if (!res) {
            this.router.navigateByUrl('/login');
          }
          return res;
        })
      );
    } else {
      return this.authService.isAuthenticated.pipe(
        take(1),
        tap((isAuth) => {
          if (!isAuth) {
            this.router.navigateByUrl('/login');
          }
        })
      );
    }
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true;
  }
}
