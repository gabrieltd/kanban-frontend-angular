import { Component } from '@angular/core';

@Component({
  selector: 'app-project-preview',
  template: `<mat-card class="project-card">
    <ngx-skeleton-loader
      count="2"
      appearance="line"
      animation="progress-dark"
      [theme]="{
        'background-color': '#686868'
      }"
    ></ngx-skeleton-loader>
    <div class="bottom-aligner"></div>
    <ngx-skeleton-loader
      count="3"
      appearance="circle"
      animation="progress-dark"
      [theme]="{
        height: '35px',
        width: '35px',
        'background-color': '#686868'
      }"
    ></ngx-skeleton-loader>
  </mat-card> `,
  styles: [
    '.project-card { min-width: 380px; max-width: 400px; height: 190px; padding: 20px 16px; padding-top: 30px; }',
  ],
})
export class ProjectPreviewComponent {}
