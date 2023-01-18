import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteProjectDialogComponent } from '../dialogs/delete-project-dialog/delete-project-dialog.component';
import { Project } from '../../core/interfaces/project.interface';
import { ProjectService } from '../../core/services/project.service';
import { catchError, of } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { NewProjectDialogComponent } from '../dialogs/new-project-dialog/new-project-dialog.component';
import { SnackService } from '../../core/services/snack.service';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
})
export class ProjectCardComponent {
  loading: boolean = false;
  @Input() project!: Project;
  @Output() deleteRequest = new EventEmitter<string>();

  constructor(
    private projectService: ProjectService,
    public authService: AuthService,
    private snackService: SnackService,
    public dialog: MatDialog
  ) {}
  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(DeleteProjectDialogComponent, {
      width: '400px',
      panelClass: 'custom-dialog',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading = true;

        this.projectService.delete(this.project.id).subscribe(() => {
          this.loading = false;
        });
      }
    });
  }

  openOptionsDialog(): void {
    const dialogRef = this.dialog.open(NewProjectDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog',
      data: { isNew: false, project: this.project },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading = true;
        this.projectService.update(result, this.project.id).subscribe({
          next: (res) => {
            this.loading = false;
          },
          error: (err) => {
            this.loading = false;
            this.snackService.open(
              'Error en la actualización del proyecto',
              'error'
            );
          },
        });
      }
    });
  }
}
