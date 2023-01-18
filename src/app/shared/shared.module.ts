import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LayoutComponent } from './layout/layout.component';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DeleteButtonComponent } from './delete-button/delete-button.component';
import { ShowAuthedDirective } from './show-authed.directive';
import { NotFoundComponent } from './not-found/not-found.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
  declarations: [
    LayoutComponent,
    DeleteButtonComponent,
    ShowAuthedDirective,
    NotFoundComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    LayoutModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    HttpClientModule,
    DragDropModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatAutocompleteModule,
    NgxSkeletonLoaderModule,
    MatTableModule,
    MatChipsModule,
    MatBadgeModule,
  ],
  exports: [
    MatTooltipModule,
    LayoutComponent,
    CommonModule,
    RouterModule,
    MatToolbarModule,
    LayoutModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    HttpClientModule,
    DragDropModule,
    DeleteButtonComponent,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    NgxSkeletonLoaderModule,
    MatTableModule,
    MatChipsModule,
    MatBadgeModule,
  ],
})
export class SharedModule {}
