import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Project } from '../../../core/interfaces/project.interface';
import { User } from '../../../core/interfaces/user.inferface';
import {
  duplicatedValue,
  whitespaceValidator,
} from '../../../shared/validators/validator';

export interface State {
  flag: string;
  name: string;
  population: string;
}

@Component({
  selector: 'app-new-project-dialog',
  templateUrl: './new-project-dialog.component.html',
  styleUrls: ['./new-project-dialog.component.scss'],
})
export class NewProjectDialogComponent implements OnInit {
  form!: FormGroup;
  members: User[] = [];
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

  membersInvited(members: User[]) {
    this.members = members;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  submit() {
    const projectSubmit = {
      project: { ...this.form.value },
      members: this.members,
    };

    this.dialogRef.close(projectSubmit);
  }
}
