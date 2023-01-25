import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ProjectCardComponent } from './project-card/project-card.component';
import { SharedModule } from '../shared/shared.module';
import { DeleteProjectDialogComponent } from './dialogs/delete-project-dialog/delete-project-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NewProjectDialogComponent } from './dialogs/new-project-dialog/new-project-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectCardLoadingComponent } from './project-card-loading/project-card-loading.component';
import { UserSearchComponent } from './user-search/user-search.component';
import { MembersImageComponent } from './project-card/members-image/members-image.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ProjectCardComponent,
    DeleteProjectDialogComponent,
    NewProjectDialogComponent,
    ProjectCardLoadingComponent,
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
