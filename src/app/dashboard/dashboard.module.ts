import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ProjectComponent } from './project/project.component';
import { SharedModule } from '../shared/shared.module';
import { DeleteProjectDialogComponent } from './dialogs/delete-project-dialog/delete-project-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NewProjectDialogComponent } from './dialogs/new-project-dialog/new-project-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserSearchComponent } from './user-search/user-search.component';
import { MembersImageComponent } from './project/members-image/members-image.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ProjectComponent,
    DeleteProjectDialogComponent,
    NewProjectDialogComponent,
    UserSearchComponent,
    MembersImageComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
  ],
})
export class DashboardModule {}
