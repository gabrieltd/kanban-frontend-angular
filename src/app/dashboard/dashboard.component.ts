import { Component, OnInit } from '@angular/core';
import { Project } from '../core/interfaces/project.interface';
import { ProjectService } from '../core/services/project.service';
import { MatDialog } from '@angular/material/dialog';
import { NewProjectDialogComponent } from './dialogs/new-project-dialog/new-project-dialog.component';
import { delay } from 'rxjs';
import { SnackService } from '../core/services/snack.service';

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

    this.projectService.getAll().subscribe({
      next: (data) => {
        this.projects = data;
        this.loading.status = false;
      },
      error: (err) => {
        this.loading.status = false;
      },
    });
  }

  handleDeleteRequest(projectId: string): void {
    this.projects = this.projects.filter((p) => p.id !== projectId);
  }

  openNewDialog(): void {
    const dialogRef = this.dialog.open(NewProjectDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog',
      data: { projects: this.projects },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading = { status: true, quantity: 1 };
        this.projectService.save(result).subscribe({
          next: (data) => {
            this.projects.push(data);
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
