import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-delete-button',
  templateUrl: './delete-button.component.html',
  styleUrls: ['./delete-button.component.scss'],
})
export class DeleteButtonComponent {
  canDelete: boolean = false;
  @Input() showSpinner = false;
  @Output() delete = new EventEmitter<boolean>();

  enableDelete() {
    this.canDelete = true;
  }

  cancel() {
    this.canDelete = false;
  }

  deleteBoard() {
    this.delete.emit(true);

    this.canDelete = false;
  }
}
