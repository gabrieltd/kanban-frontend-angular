import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { asyncScheduler, delay, timer } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  form: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.minLength(6), Validators.required]],
    passwordConfirm: ['', []],
  });

  type: 'login' | 'signup' = 'signup';
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {}

  changeType(val: any) {
    this.type = val;
  }

  private showErrorMessage(message: string = 'Error') {
    this.snackBar.open(message, 'OK', {
      panelClass: ['error-snackbar'],
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  get isLogin() {
    return this.type === 'login';
  }

  get isSignup() {
    return this.type === 'signup';
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  get passwordConfirm() {
    return this.form.get('passwordConfirm');
  }

  get passwordDoesMatch() {
    if (this.type !== 'signup') {
      return true;
    } else {
      return this.password?.value === this.passwordConfirm?.value;
    }
  }

  onSubmit() {
    this.loading = true;

    const email = this.email!.value;
    const password = this.password!.value;

    if (this.isLogin) {
      this.authService.attemptAuth('login', email, password).subscribe({
        next: () => this.router.navigateByUrl('/'),
        error: (err: Error) => {
          this.loading = false;
          this.showErrorMessage(err.message);
        },
      });
    }

    if (this.isSignup) {
      this.authService.attemptAuth('register', email, password).subscribe({
        next: () => this.router.navigateByUrl('/'),
        error: (err: Error) => {
          this.loading = false;
          this.showErrorMessage(err.message);
        },
      });
    }
  }

  demo() {
    this.loading = true;
    this.authService.attemptAuth('login', 'test@test.cl', '123456').subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (err: Error) => {
        this.loading = false;
        this.showErrorMessage(err.message);
      },
    });
  }
}
