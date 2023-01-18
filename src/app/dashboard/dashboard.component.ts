import { Component, OnInit } from '@angular/core';
import { Project } from '../core/interfaces/project.interface';
import { ProjectService } from '../core/services/project.service';
import { MatDialog } from '@angular/material/dialog';
import { NewProjectDialogComponent } from './dialogs/new-project-dialog/new-project-dialog.component';
import { delay, switchMap } from 'rxjs';
import { SnackService } from '../core/services/snack.service';
import { CDK_DRAG_HANDLE } from '@angular/cdk/drag-drop';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  projects: Project[] = [];
  loading: { status: boolean; quantity: number } = {
    status: true,
    quantity: 4,
  };

  constructor(
    private projectService: ProjectService,
    public dialog: MatDialog,
    private snackService: SnackService
  ) {}

  ngOnInit(): void {
    this.loading = { status: true, quantity: 4 };
    this.projectService
      .setProjects()
      .pipe(switchMap(() => this.projectService.projects))
      .subscribe({
        next: (data) => {
          data.sort((a: Project, b: Project) => {
            const dateA = dayjs(a.createdAt);
            const dateB = dayjs(b.createdAt);
            return dateA.isBefore(dateB) ? -1 : 1;
          });
          this.projects = data;
          this.loading.status = false;
        },
        error: () => {
          this.snackService.open(
            'Algo salio mal. Inténtelo más tarde.',
            'error'
          );
          this.loading.status = false;
        },
      });
  }

  openNewDialog(): void {
    const dialogRef = this.dialog.open(NewProjectDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog',
      data: { isNew: true, projects: this.projects, project: { members: [] } },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading = { status: true, quantity: 1 };
        this.projectService.save(result).subscribe({
          next: (res) => {
            this.loading.status = false;
          },
          error: (err) => {
            this.loading.status = false;
            this.snackService.open(
              'Error en la creación del proyecto',
              'error'
            );
          },
        });
      }
    });
  }
}
