import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Board } from '../../core/interfaces/board.interface';
import { BoardService } from '../../core/services/board.service';
import {
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { Task } from '../../core/interfaces/task.interface';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from '../dialogs/task-dialog/task-dialog.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  tasks: string[] = [];
  isDeleting: boolean = false;
  hasPreviewData: boolean = true;

  @Input() board!: Board;
  @Output() deleteBoardEvent = new EventEmitter<string>();
  @Output() transferSortEvent = new EventEmitter<any>();

  constructor(private boardService: BoardService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.hasPreviewData = this.board.id.includes(this.board.title);

    if (this.board.tasks) {
      this.tasks = this.board.tasks.map((t) => t.description);
      this.board.tasks.sort((a, b) => a.priority - b.priority);
    }
  }

  taskDrop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        this.board.tasks,
        event.previousIndex,
        event.currentIndex
      );
      this.updatePriority();
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      this.transferSort(event.container.id);
    }
  }

  openTaskDialog(task?: Task, index?: number): void {
    const newTask = { color: 'purple' };
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: task
        ? {
            task: { ...task },
            isNew: false,
            isDelete: false,
            boardId: this.board.id,
            index,
          }
        : { task: newTask, isNew: true, isDelete: false },
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
            .saveTask(
              { ...result.task, priority, boardId },
              this.board.id,
              this.board.projectId
            )
            .subscribe((data) => {
              this.board.tasks[lastElem] = data;
            });
        } else if (result.isDelete) {
          this.boardService
            .deleteTask(this.board.projectId, this.board.id, result.task.id)
            .subscribe();

          this.board.tasks = this.board.tasks.filter(
            (t) => t.id !== result.task.id
          );

          this.updatePriority();
        } else {
          this.boardService
            .updateTask(
              result.task,
              this.board.projectId,
              this.board.id,
              result.task.id
            )
            .subscribe((res) =>
              this.board.tasks.splice(result.index, 1, result.task)
            );
        }
      }
    });
  }

  handleDeleteBoard(): void {
    this.isDeleting = true;
    const boardId = this.board.id;

    this.boardService.delete(boardId, this.board.projectId).subscribe(() => {
      this.isDeleting = false;
      this.deleteBoardEvent.emit(boardId);
    });
  }

  updatePriority(): void {
    this.board.tasks.forEach((t, index) => (t.priority = index));

    this.boardService
      .updateTasks(this.board, this.board.id, this.board.projectId)
      .subscribe();
  }

  transferSort(nextBoardId: string): void {
    this.board.tasks.map((t) => (t.boardId = nextBoardId));
    this.updatePriority();
  }
}
