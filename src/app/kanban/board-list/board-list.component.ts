import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { BoardService } from '../../core/services/board.service';
import { Board } from '../../core/interfaces/board.interface';
import {
  CdkDragDrop,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  catchError,
  fromEvent,
  map,
  Observable,
  switchMap,
  of,
  tap,
  last,
} from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BoardDialogComponent } from '../dialogs/board-dialog/board-dialog.component';
import { ProjectService } from '../../core/services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../core/interfaces/project.interface';
import { SnackService } from '../../core/services/snack.service';
import { Task } from '../../core/interfaces/task.interface';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss'],
})
export class BoardListComponent implements OnInit {
  boards: Board[] = [];
  projectId: string = '';
  loading: { status: boolean; quantity: number } = {
    status: false,
    quantity: 3,
  };

  @ViewChild('container') public div!: ElementRef;

  constructor(
    private projectService: ProjectService,
    private boardService: BoardService,
    private route: ActivatedRoute,
    private router: Router,
    private snackService: SnackService,
    public dialog: MatDialog
  ) {}

  scroll$ = fromEvent<WheelEvent>(document, 'wheel');

  ngOnInit(): void {
    this.loading = { status: true, quantity: 3 };

    this.scroll$.subscribe((ev: any) => {
      this.div.nativeElement.scrollLeft += ev.deltaY / 2;
    });

    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const projectId = params.get('projectId');
          return this.projectService.getById(projectId!);
        }),
        catchError((error) => {
          this.router.navigateByUrl('404');
          return of();
        }),
        tap((project) => project.boards.sort((a, b) => a.priority - b.priority))
      )
      .subscribe((project) => {
        this.loading.status = false;
        this.projectId = project.id;
        this.boards = project.boards;
      });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.boards, event.previousIndex, event.currentIndex);
    this.sortBoards();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(BoardDialogComponent, {
      width: '400px',
      panelClass: 'custom-modalbox',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const lastElem = this.boards.length;
        this.boards.push({
          id: `${result.title}-${this.boards.length}`,
          title: result.title,
          priority: this.boards.length,
          tasks: [],
          projectId: this.projectId,
        });

        this.boardService
          .save(
            {
              title: result.title,
              priority: this.boards.length,
            },
            this.projectId
          )

          .subscribe({
            next: (data) => {
              this.boards[lastElem] = { ...data, tasks: [] };
            },
            error: (error) => {
              this.boards = this.boards.filter((_, index) => {
                index !== lastElem;
              });
              this.snackService.open(
                'Error en la creación del tablero. Inténtalo más tarde.',
                'error'
              );
            },
          });
      }
    });
  }

  sortBoards(): void {
    this.boards.forEach((b, index) => (b.priority = index));

    this.boardService
      .updateBoardPriority(this.boards, this.projectId)
      .subscribe();
  }

  handleDeleteBoardEvent(boardId: string): void {
    this.boards = this.boards.filter((b) => b.id !== boardId);
    this.sortBoards();
  }
}
