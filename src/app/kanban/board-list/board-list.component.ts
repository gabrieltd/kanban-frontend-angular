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
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { fromEvent, map, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BoardDialogComponent } from '../dialogs/board-dialog/board-dialog.component';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss'],
})
export class BoardListComponent implements OnInit {
  @ViewChild('container') public div!: ElementRef;

  boards: Board[] = [];

  constructor(private boardService: BoardService, public dialog: MatDialog) {}

  scroll$ = fromEvent<WheelEvent>(document, 'wheel');

  ngOnInit(): void {
    this.boardService
      .getAll()
      .pipe(map((data) => data.sort((a, b) => a.priority - b.priority)))
      .subscribe((data) => (this.boards = data));

    this.scroll$.subscribe((ev: any) => {
      this.div.nativeElement.scrollLeft += ev.deltaY / 2;
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
        this.boardService
          .save({ title: result, priority: this.boards.length })
          .subscribe((data) => this.boards.push({ ...data, tasks: [] }));
      }
    });
  }

  handleDeleteRequest(boardId: string): void {
    this.boards = this.boards.filter((b) => b.id !== boardId);
    this.sortBoards();
  }

  sortBoards(): void {
    this.boards.forEach((b, index) => (b.priority = index));
    this.boardService.updateBoardPriority(this.boards).subscribe();
  }
}
