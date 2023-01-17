import { Component } from '@angular/core';

@Component({
  selector: 'app-board-loading',
  template: `
    <mat-card class="outer-card">
      <ngx-skeleton-loader
        count="1"
        appearance="line"
        animation="progress-dark"
        [theme]="{
          width: '150px',
          margin: '22px 16px 4px 16px',
          'background-color': '#686868'
        }"
      ></ngx-skeleton-loader>

      <ngx-skeleton-loader
        count="1"
        appearance="line"
        animation="progress-dark"
        [theme]="{
          height: '16px',
          width: '100px',
          margin: '0 16px 8px 16px',
          'background-color': '#686868'
        }"
      ></ngx-skeleton-loader>

      <div class="tasks" cdkDropList cdkDropListOrientation="vertical">
        <ngx-skeleton-loader
          count="3"
          appearance="line"
          animation="progress-dark"
          [theme]="{
            height: '55px',
            margin: 0,
            'background-color': '#686868'
          }"
        ></ngx-skeleton-loader>
      </div>
    </mat-card>
  `,
  styles: [
    '.outer-card { margin: 10px; min-width: 300px; max-width: 300px; padding: 10px; background: #212121; height: 324px; }',
  ],
})
export class BoardLoadingComponent {}
