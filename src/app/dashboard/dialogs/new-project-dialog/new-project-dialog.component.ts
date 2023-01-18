import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Project } from '../../../core/interfaces/project.interface';
import { User } from '../../../core/interfaces/user.inferface';
import { ProjectService } from '../../../core/services/project.service';
import { take } from 'rxjs';
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
  members: any[] = [];
  projects: Project[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    public dialogRef: MatDialogRef<NewProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.projectService.projects
      .pipe(take(1))
      .subscribe((data) => (this.projects = data));

    let projectNames = this.projects.map((p: Project) => p.title);
    let titleValue = '';
    let descriptionValue = '';

    if (!this.data.isNew) {
      titleValue = this.data.project.title;
      descriptionValue = this.data.project.description;
      projectNames = projectNames.filter((name) => name !== titleValue);
      this.members = this.data.project.members.map((m: any) => {
        return { ...m.user, pending: m.pending };
      });
    }

    this.form = this.formBuilder.group(
      {
        title: [
          titleValue,
          [
            Validators.required,
            whitespaceValidator,
            Validators.minLength(3),
            Validators.maxLength(25),
          ],
        ],
        description: [descriptionValue, [Validators.required]],
      },
      {
        validators: [duplicatedValue('title', projectNames)],
      }
    );
  }

  membersInvited(members: any[]) {
    this.members = members;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  submit() {
    console.log(this.members);
    const projectSubmit = {
      project: { ...this.form.value },
      members: this.members.map((m) => {
        return { id: m.id, pending: m.pending };
      }),
    };

    this.dialogRef.close(projectSubmit);
  }
}
