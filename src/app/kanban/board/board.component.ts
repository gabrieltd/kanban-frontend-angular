import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Board } from '../../core/interfaces/board.interface';
import { BoardService } from '../../core/services/board.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Task } from '../../core/interfaces/task.interface';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from '../dialogs/task-dialog/task-dialog.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  @Input() board!: Board;
  @Output() deleteRequest = new EventEmitter<string>();

  constructor(private boardService: BoardService, private dialog: MatDialog) {}

  ngOnInit(): void {
    if (this.board.tasks) {
      this.board.tasks.sort((a, b) => a.priority - b.priority);
    }
  }

  taskDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.board.tasks, event.previousIndex, event.currentIndex);
    this.sortTasks();
  }

  openTaskDialog(task?: Task, index?: number): void {
    const newTask = { color: 'purple' };
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: task
        ? { task: { ...task }, isNew: false, boardId: this.board.id, index }
        : { task: newTask, isNew: true },
      panelClass: 'custom-modalbox',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.isNew) {
          const priority = this.board.tasks.length;
          const boardId = this.board.id;

          const lastElem = this.board.tasks.length;
          this.board.tasks.push({ ...result.task, priority, boardId });

          this.boardService
            .saveTask({ ...result.task, priority, boardId })
            .subscribe((data) => {
              this.board.tasks[lastElem] = data;
            });
        } else if (result.isDelete) {
          this.board.tasks = this.board.tasks.filter(
            (t) => t.id !== result.task.id
          );

          this.sortTasks();
        } else {
          this.boardService
            .updateTask(result.task.id, result.task)
            .subscribe((res) =>
              this.board.tasks.splice(result.index, 1, result.task)
            );
        }
      }
    });
  }

  handleDelete(): void {
    const boardId = this.board.id;
    this.deleteRequest.emit(boardId);
    this.boardService.delete(boardId).subscribe();
  }

  sortTasks(): void {
    this.board.tasks.forEach((t, index) => (t.priority = index));
    this.boardService.updateTaskPriority(this.board).subscribe();
  }
}
