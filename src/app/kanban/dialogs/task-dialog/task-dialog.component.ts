import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BoardService } from '../../../core/services/board.service';

@Component({
  selector: 'app-task-dialog',
  template: `
    <h1 mat-dialog-title>
      {{ data.isNew ? 'Nueva tarea' : 'Actualizar tarea' }}
    </h1>
    <div mat-dialog-content class="content">
      <mat-form-field>
        <mat-label>Descripción de la tarea</mat-label>
        <textarea matInput [(ngModel)]="data.task.description"></textarea>
      </mat-form-field>
      <br />
      <mat-button-toggle-group
        #group="matButtonToggleGroup"
        [(ngModel)]="data.task.color"
      >
        <mat-button-toggle *ngFor="let opt of colorOptions" [value]="opt">
          <mat-icon [ngClass]="opt">{{
            opt === 'gray' ? 'check_circle' : 'lens'
          }}</mat-icon>
        </mat-button-toggle>
      </mat-button-toggle-group>
    </div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="data" cdkFocusInitial>
        {{ data.isNew ? 'Crear' : 'Actualizar' }}
      </button>

      <button mat-button (click)="onNoClick()">Cerrar</button>

      <div class="spacer"></div>
      <app-delete-button
        (delete)="handleTaskDelete()"
        *ngIf="!data.isNew"
      ></app-delete-button>
    </div>
  `,
  styleUrls: ['./task-dialog-component.scss'],
})
export class TaskDialogComponent {
  colorOptions = ['purple', 'blue', 'green', 'yellow', 'red', 'gray'];

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    private boardService: BoardService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleTaskDelete(): void {
    this.boardService.deleteTask(this.data.task.id).subscribe(() => {
      this.data.isDelete = true;
      this.dialogRef.close(this.data);
    });
  }
}
