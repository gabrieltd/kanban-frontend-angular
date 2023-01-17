import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { passwordsMatch } from '../shared/validators/validator';
import { SnackService } from '../core/services/snack.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  form: FormGroup = this.formBuilder.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required]],
    },
    {
      validators: [passwordsMatch('password', 'passwordConfirm')],
    }
  );

  type: 'login' | 'signup' = 'login';
  loading = false;
  hide: boolean = true;
  hideConfirm: boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,

    private snackService: SnackService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  changeType(val: any) {
    this.type = val;
  }

  isValidForm() {
    if (this.type === 'signup') {
      return (
        this.form.controls['email'].valid &&
        this.form.controls['password'].valid &&
        this.form.controls['passwordConfirm'].valid
      );
    }
    return (
      this.form.controls['email'].valid && this.form.controls['password'].valid
    );
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

  onSubmit() {
    this.loading = true;

    const email = this.email!.value;
    const password = this.password!.value;

    if (this.isLogin) {
      this.authService.attemptAuth('login', email, password).subscribe({
        next: () => this.router.navigateByUrl('/dashboard'),
        error: (err: Error) => {
          this.loading = false;
          this.snackService.open(err.message, 'error');
        },
      });
    }

    if (this.isSignup) {
      this.authService.attemptAuth('register', email, password).subscribe({
        next: () => this.router.navigateByUrl('/dashboard'),
        error: (err: Error) => {
          this.loading = false;
          this.snackService.open(err.message, 'error');
        },
      });
    }
  }

  demo() {
    this.loading = true;
    this.authService.attemptAuth('login', 'test@test.cl', '123456').subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: (err: Error) => {
        this.loading = false;
        this.snackService.open(err.message, 'error');
      },
    });
  }
}
