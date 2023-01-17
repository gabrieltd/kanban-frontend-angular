import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { whitespaceValidator } from '../../../shared/validators/validator';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-board-dialog',
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <h1 mat-dialog-title>Nuevo tablero</h1>
      <div mat-dialog-content>
        <p>Escoje un título para el tablero</p>
        <mat-form-field
          [color]="this.form.get('title')?.valid ? 'accent' : 'primary'"
        >
          <mat-label>Título</mat-label>
          <input
            matInput
            formControlName="title"
            autocomplete="off"
            maxlength="20"
          />
          <mat-hint align="end"
            >{{ this.form.get('title')?.value.length }}/20</mat-hint
          >

          <mat-error>
            <span *ngIf="this.form.get('title')?.hasError('required')"
              >El título es requerido</span
            >
            <span
              *ngIf="this.form.get('title')?.hasError('minlength'); else second"
              >El título debe contener al menos 1 caracter</span
            >
            <ng-template #second>
              <span
                *ngIf="
                  this.form.get('title')?.hasError('whitespace');
                  else third
                "
                >Debes ingresar un título válido</span
              >
            </ng-template>

            <ng-template #third>
              <span
                *ngIf="
                  this.form.get('title')?.hasError('duplicated');
                  else fourth
                "
                >Ya existe un proyecto con este nombre</span
              >
            </ng-template>

            <ng-template #fourth>
              <span *ngIf="this.form.get('title')?.hasError('maxlength')"
                >El título no puede exceder los 20 caracteres</span
              >
            </ng-template>
          </mat-error>
        </mat-form-field>
      </div>

      <div mat-dialog-actions>
        <button type="submit" mat-button [disabled]="this.form.invalid">
          Crear
        </button>
        <button type="button" mat-button (click)="onNoClick()">Cerrar</button>
      </div>
    </form>
  `,

  styles: ['.mat-mdc-dialog-actions { padding: 0 20px}'],
})
export class BoardDialogComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,

    public dialogRef: MatDialogRef<BoardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: [
        '',
        [
          Validators.required,
          whitespaceValidator,
          Validators.minLength(1),
          Validators.maxLength(20),
        ],
      ],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit(): void {
    this.dialogRef.close(this.form.value);
  }
}
