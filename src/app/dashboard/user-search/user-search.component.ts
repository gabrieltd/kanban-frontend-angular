import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { User } from '../../core/interfaces/user.inferface';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import { MatChipOption } from '@angular/material/chips';

interface UserProperties {
  id: string;
  email: string;
  username: string;
  image: string;
  bio: string;
  pending: boolean;
  invited: boolean;
}

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss'],
})
export class UserSearchComponent implements OnInit {
  chipText: string = 'Invitado';
  users!: User[];
  selectedUsers: UserProperties[] = [];
  usersInvited: any[] = [];
  query = new FormControl();

  @Input() members?: User[] = [];
  @Output() selectUserEvent = new EventEmitter<User[]>();

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.members!.length > 0) {
      const membersSelected = this.members!.map((m: any) => {
        return { ...m.user, pending: m.pending, invited: true };
      });
      const membersInvited = this.members!.map((m: any) => {
        return { ...m.user, pending: m.pending };
      });
      this.usersInvited = membersInvited;

      this.selectedUsers = membersSelected;
    }
  }

  search() {
    this.userService
      .getUsers(this.query.value)

      .subscribe((users) => {
        this.users = users.filter(
          (user) =>
            user.username !== this.authService.getCurrentUser().username &&
            !this.selectedUsers.some(
              (selectedUser) => user.id === selectedUser.id
            )
        );
      });
  }

  onUserSelected(event: MatAutocompleteSelectedEvent) {
    const user: User = event.option.value;
    const userProperties = { ...user, pending: true, invited: true };
    this.selectedUsers.push(userProperties);
    this.usersInvited.push({ ...user, pending: true });

    this.selectUserEvent.emit(this.usersInvited);

    //Clean input
    this.users = [];
    this.query.reset();
  }

  onChipClicked(chip: MatChipOption, user: UserProperties) {
    if (user.pending) {
      chip.value = chip.selected ? 'Invitado' : 'Invitar';
    } else {
      chip.value = chip.selected ? 'Aceptado' : 'Invitar';
    }

    if (!chip.selected) {
      this.usersInvited = this.usersInvited.filter(
        (selectedUser) => selectedUser.id !== user.id
      );
    } else {
      this.usersInvited.push(user);
    }

    this.selectUserEvent.emit(this.usersInvited);
  }
}
