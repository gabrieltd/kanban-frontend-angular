import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Board } from '../../core/interfaces/board.interface';
import { BoardService } from '../../core/services/board.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { Task } from '../../core/interfaces/task.interface';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from '../dialogs/task-dialog/task-dialog.component';
import { SnackService } from '../../core/services/snack.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  tasks: string[] = [];
  isDeleting: boolean = false;
  showPreview: boolean = false;
  @Input() board!: Board;

  @Output() transferSortEvent = new EventEmitter<any>();
  @Output() scrollEvent = new EventEmitter<boolean>();

  constructor(
    private boardService: BoardService,
    private dialog: MatDialog,
    private snackService: SnackService
  ) {}

  ngOnInit(): void {
    if (this.board.tasks) {
      this.tasks = this.board.tasks.map((t) => t.description);
      this.board.tasks.sort((a, b) => a.priority - b.priority);
    }
  }

  @ViewChild('tasksContainer', { read: ElementRef })
  public scrollContainer!: ElementRef;

  @HostListener('wheel', ['$event'])
  onBoardScroll(event: WheelEvent): void {
    const hasScrollbar =
      this.scrollContainer.nativeElement.scrollHeight !==
      this.scrollContainer.nativeElement.clientHeight;

    const isBoardScroll = this.scrollContainer.nativeElement.contains(
      event.target
    );

    this.scrollEvent.emit(hasScrollbar && isBoardScroll);
  }

  taskDrop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        this.board.tasks,
        event.previousIndex,
        event.currentIndex
      );
      this.move();
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      this.transfer(event.container.id);
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
          this.showPreview = true;
          this.boardService
            .addTask(
              { ...result.task, priority, boardId },
              this.board.id,
              this.board.projectId
            )
            .subscribe({
              next: () => {
                this.showPreview = true;
              },
              error: () => {
                this.showPreview = false;
                this.snackService.open(
                  'Error en la creación de la tarea. Inténtelo más tarde.',
                  'error'
                );
              },
            });
        } else if (result.isDelete) {
          this.board = {
            ...this.board,
            tasks: this.board.tasks.filter(
              (task) => task.id !== result.task.id
            ),
          };

          this.boardService
            .deleteTask(this.board.projectId, this.board.id, result.task.id)
            .subscribe({
              next: () => {},
              error: () => {
                this.snackService.open(
                  'Error en la eliminación de la tarea. Inténtelo más tarde.',
                  'error'
                );
              },
            });
        } else {
          this.boardService
            .updateTask(
              result.task,
              this.board.projectId,
              this.board.id,
              result.task.id
            )
            .subscribe((res: any) =>
              this.board.tasks.splice(result.index, 1, result.task)
            );
        }
      }
    });
  }

  handleDeleteBoard(): void {
    this.isDeleting = true;

    this.boardService
      .deleteBoard(this.board.id, this.board.projectId)
      .subscribe(() => {
        this.isDeleting = false;
      });
  }

  move(): void {
    this.boardService.moveTask(this.board.id, this.board.projectId).subscribe();
  }

  transfer(nextBoardId: string): void {
    this.boardService
      .transferTask(nextBoardId, this.board.projectId, this.board.id)
      .subscribe();
  }
}
