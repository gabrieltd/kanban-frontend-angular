import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-board-dialog',
  template: `
    <h1 mat-dialog-title>Nuevo tablero</h1>
    <div mat-dialog-content>
      <p>Escoje un título para el tablero</p>
      <mat-form-field>
        <mat-label>Título</mat-label>
        <input matInput [(ngModel)]="data.title" />
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="data.title" cdkFocusInitial>
        Crear
      </button>
      <button mat-button (click)="onNoClick()">Cerrar</button>
    </div>
  `,

  styles: ['.mat-mdc-dialog-actions { padding: 0 20px}'],
})
export class BoardDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<BoardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
