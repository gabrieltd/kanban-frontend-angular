import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BoardService } from '../../core/services/board.service';
import { Board } from '../../core/interfaces/board.interface';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { catchError, switchMap, of, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BoardDialogComponent } from '../dialogs/board-dialog/board-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackService } from '../../core/services/snack.service';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss'],
})
export class BoardListComponent implements OnInit, OnDestroy {
  boards: Board[] = [];
  projectId: string = '';

  loading: { status: boolean; previews: number } = {
    status: false,
    previews: 3,
  };

  showPreview: boolean = false;

  canScroll: boolean = false;

  constructor(
    private boardService: BoardService,
    private route: ActivatedRoute,
    private router: Router,
    private snackService: SnackService,

    public dialog: MatDialog
  ) {}

  @ViewChild('container') public scrollContainer!: ElementRef;

  @HostListener('wheel', ['$event'])
  onScroll = (event: WheelEvent) => {
    if (this.canScroll) {
      this.scrollContainer.nativeElement.scrollLeft += event.deltaY / 2;
    }
  };

  setCanScroll(value: boolean): void {
    this.canScroll = !value;
  }

  ngOnInit(): void {
    this.loading = { status: true, previews: 4 };
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const projectId = params.get('projectId');
          this.projectId = projectId!;

          return this.boardService.setBoards(projectId!);
        }),
        switchMap(() => {
          return this.boardService.boards;
        }),
        catchError((error) => {
          this.router.navigateByUrl('404');
          return of();
        })
      )

      .subscribe((boards) => {
        this.boards = boards;
        this.loading = { status: false, previews: 4 };
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
        this.showPreview = true;
        this.boardService
          .addBoard(
            {
              title: result.title,
              priority: this.boards.length,
            },
            this.projectId
          )

          .subscribe({
            next: (data) => {
              this.showPreview = false;
            },
            error: (error) => {
              this.showPreview = false;

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
    this.boardService.updateBoards(this.projectId).subscribe({
      error: () => {
        this.snackService.open(
          'Error en la actualización del tablero. Inténtalo más tarde.',
          'error'
        );
      },
    });
  }

  ngOnDestroy(): void {
    this.boardService.cleanBoards(this.projectId);
  }
}
