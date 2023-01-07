import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ApiService } from './core/services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.authService.refreshSession().subscribe((res) => {
      if (!res) {
        this.router.navigateByUrl('/login');
      }
    });
  }
}
