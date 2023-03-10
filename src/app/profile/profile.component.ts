import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { User } from '../core/interfaces/user.inferface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { whitespaceValidator } from '../shared/validators/validator';
import { Router } from '@angular/router';
import { SnackService } from '../core/services/snack.service';
import { ProjectService } from '../core/services/project.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  private subscription!: Subscription;
  currentUser!: User;
  form: FormGroup = this.formBuilder.group({
    username: [
      '',
      [
        Validators.required,
        whitespaceValidator,
        Validators.minLength(3),
        Validators.maxLength(24),
        Validators.pattern('[ña-zA-Z0-9*_.-]*'),
      ],
    ],
    bio: ['', []],
  });

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private snackService: SnackService,
    private projectService: ProjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription = this.authService.currentUser.subscribe((data) => {
      this.currentUser = data;
      this.form.setValue({
        username: this.currentUser.username || '',
        bio: this.currentUser.bio || '',
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    if (!this.form.pristine) {
      this.loading = true;

      const username = this.form.get('username')?.value.replaceAll(' ', '-');

      let bio = this.form.get('bio')?.value;
      bio =
        bio === null || bio.trim().length === 0
          ? null
          : this.form.get('bio')?.value.trim();

      this.authService.updateProfile({ username, bio }).subscribe({
        next: () => {
          this.projectService.refreshProjects();
          this.snackService.open('Perfil actualizado', 'success');
          this.loading = false;
        },
        error: (err) => {
          this.snackService.open(err.message, 'error');
          this.loading = false;
        },
      });
    }
  }

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }
}
