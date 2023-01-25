import { Component, Input, OnInit } from '@angular/core';
import { Membership } from '../../../core/interfaces/membership.interface';

@Component({
  selector: 'app-members-image',
  template: `
    <img
      [matTooltip]="adminMember.user!.username"
      [src]="adminMember.user!.image"
      class="user-img"
      [matTooltipPosition]="'above'"
    />
    <img
      [matTooltip]="members[0].user?.username || ''"
      *ngIf="members[0]"
      [src]="members[0].user?.image"
      class="user-img"
      [matTooltipPosition]="'above'"
    />
    <img
      [matTooltip]="members[1].user?.username || ''"
      *ngIf="members[1]"
      [src]="members[1].user?.image"
      class="user-img"
      [matTooltipPosition]="'above'"
    />

    <div class="user-img user-count" *ngIf="members.length > 3">
      <span>+{{ members.length - 3 }}</span>
    </div>
  `,
  styleUrls: ['./members-image.component.scss'],
})
export class MembersImageComponent implements OnInit {
  @Input() members: Membership[] = [];
  adminMember!: Membership;

  ngOnInit(): void {
    this.adminMember = this.members.filter((m) => m.admin === true)[0];
    this.members = this.members.filter((m) => m.admin !== true);
  }
}
