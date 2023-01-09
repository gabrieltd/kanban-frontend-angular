import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, shareReplay } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { JwtService } from '../../core/services/jwt.service';
import { User } from '../../core/interfaces/user.inferface';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  public isAuthenticated: boolean = false;
  currentUser!: User;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Handset])
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((data) => (this.currentUser = data));
  }

  logout(): void {
    this.authService.cleanAuth().subscribe();
  }
}
