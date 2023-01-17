import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-delete-project-dialog',
  template: `
    <h1 mat-dialog-title>¿Estas seguro que deseas eliminar el proyecto?</h1>
    <div mat-dialog-content>
      <span>Se eliminará permanentemente todo su contenido.</span>
    </div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="true" color="warn">
        Confirmar
      </button>
      <button mat-button (click)="onNoClick()">Cancelar</button>
    </div>
  `,
  styles: [
    '::ng-deep mat-dialog-container .mat-mdc-dialog-surface {padding:0.75rem;}; .mat-mdc-dialog-actions { padding: 0 20px}',
  ],
})
export class DeleteProjectDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
