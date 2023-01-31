import { Component } from '@angular/core';

@Component({
  selector: 'app-task-preview',
  template: `
    <ngx-skeleton-loader
      count="1"
      appearance="line"
      animation="progress-dark"
      [theme]="{
        height: '55px',
        margin: 0,
        'background-color': '#686868'
      }"
    ></ngx-skeleton-loader>
  `,
  styles: [],
})
export class TaskPreviewComponent {}
