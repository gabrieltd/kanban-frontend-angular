import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BoardService } from '../../../core/services/board.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { whitespaceValidator } from '../../../shared/validators/validator';

@Component({
  selector: 'app-task-dialog',
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <h1 mat-dialog-title>
        {{ data.isNew ? 'Nueva tarea' : 'Actualizar tarea' }}
      </h1>
      <div mat-dialog-content class="content">
        <mat-form-field>
          <mat-label>Descripción de la tarea</mat-label>
          <textarea matInput formControlName="description"></textarea>
          <mat-error>
            <span *ngIf="form.controls['description'].hasError('required')"
              >El título es requerido</span
            >
            <span
              *ngIf="
                form.controls['description'].hasError('minlength');
                else second
              "
              >El título debe contener al menos 1 caracter</span
            >
            <ng-template #second>
              <span *ngIf="form.controls['description'].hasError('maxlength')"
                >El título debe contener 50 caracteres como máximo</span
              >
            </ng-template>
          </mat-error>
        </mat-form-field>
        <br />
        <mat-button-toggle-group
          #group="matButtonToggleGroup"
          formControlName="color"
        >
          <mat-button-toggle *ngFor="let opt of colorOptions" [value]="opt">
            <mat-icon [ngClass]="opt">{{
              opt === 'gray' ? 'check_circle' : 'lens'
            }}</mat-icon>
          </mat-button-toggle>
        </mat-button-toggle-group>
      </div>
      <div mat-dialog-actions>
        <button
          type="submit"
          mat-button
          [mat-dialog-close]="data"
          [disabled]="this.form.invalid"
        >
          {{ data.isNew ? 'Crear' : 'Actualizar' }}
        </button>

        <button type="button" mat-button (click)="onNoClick()">Cerrar</button>

        <div class="spacer"></div>
        <app-delete-button
          (delete)="handleTaskDelete()"
          *ngIf="!data.isNew"
        ></app-delete-button>
      </div>
    </form>
  `,
  styleUrls: ['./task-dialog-component.scss'],
})
export class TaskDialogComponent implements OnInit {
  form!: FormGroup;

  colorOptions = ['purple', 'blue', 'green', 'yellow', 'red', 'gray'];

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    private formBuilder: FormBuilder,
    private boardService: BoardService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      description: [
        this.data.task.description,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
        ],
      ],
      color: [this.data.task.color, []],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleTaskDelete(): void {
    this.data.isDelete = true;

    this.dialogRef.close(this.data);
    this.boardService.deleteTask(this.data.task.id).subscribe();
  }

  submit(): void {
    this.data.task = { ...this.data.task, ...this.form.value };
    this.dialogRef.close(this.data);
  }
}
