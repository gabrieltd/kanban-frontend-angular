import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Project } from '../../../core/interfaces/project.interface';
import {
  duplicatedValue,
  whitespaceValidator,
} from '../../../shared/validators/validator';

@Component({
  selector: 'app-new-project-dialog',
  templateUrl: './new-project-dialog.component.html',
  styleUrls: ['./new-project-dialog.component.scss'],
})
export class NewProjectDialogComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NewProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    const projectNames = this.data.projects.map((p: Project) => p.title);

    this.form = this.formBuilder.group(
      {
        title: [
          '',
          [
            Validators.required,
            whitespaceValidator,
            Validators.minLength(3),
            Validators.maxLength(25),
          ],
        ],
        description: ['', [Validators.required]],
      },
      {
        validators: [duplicatedValue('title', projectNames)],
      }
    );
  }

  cancel(): void {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close(this.form.value);
  }
}
