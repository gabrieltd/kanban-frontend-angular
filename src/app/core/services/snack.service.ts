import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackService {
  constructor(private snackBar: MatSnackBar) {}

  open(message: string = 'Error', type: 'error' | 'success' = 'error'): void {
    this.snackBar.open(message, 'OK', {
      panelClass: [`${type}-snackbar`],
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
