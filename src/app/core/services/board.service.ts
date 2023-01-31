import { Injectable } from '@angular/core';
import { Board } from '../interfaces/board.interface';
import { ApiService } from './api.service';
import { ProjectService } from './project.service';
import { tap, switchMap, distinct, delay } from 'rxjs';
import { Task } from '../interfaces/task.interface';
import { SocketService } from './socket.service';
import { AuthService } from './auth.service';
import {
  BehaviorSubject,
  distinctUntilChanged,
  Observable,
  map,
  of,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private boardsSubject = new BehaviorSubject<Board[]>([] as Board[]);
  public boards = this.boardsSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  private projectId: string = '';

  private initialLoading: boolean = false;

  constructor(
    private apiService: ApiService,
    private projectService: ProjectService,
    private socketService: SocketService,
    private authService: AuthService
  ) {}

  //* BOARDS

  setBoards(projectId: string): Observable<boolean> {
    if (!this.initialLoading) {
      this.initialLoading = true;
      this.projectId = projectId;

      return this.projectService.getProjectById(projectId).pipe(
        tap((project) =>
          project.boards.sort((a, b) => a.priority - b.priority)
        ),
        map((project) => {
          this.boardsSubject.next(project.boards);
          this.socketService.connect(
            this.authService.getCurrentUser().id,
            projectId
          );

          this.listenEvents();
          return true;
        })
      );
    }

    return of(false);
  }

  getAll(projectId: string): Observable<Board[]> {
    return this.apiService.get(`/projects/${projectId}/boards/`);
  }

  addBoard(body: Object, projectId: string): Observable<any> {
    return this.apiService.post(`/projects/${projectId}/boards/`, body).pipe(
      map((board) => {
        const nextValue = [...this.boardsSubject.getValue(), board];
        this.boardsSubject.next(nextValue);
        this.socketService.send('board-update', {
          projectId: this.projectId,
          content: nextValue,
          sender: this.authService.getCurrentUser().id,
        });
        return of(true);
      })
    );
  }

  deleteBoard(boardId: string, projectId: string): Observable<any> {
    return this.apiService
      .delete(`/projects/${projectId}/boards/${boardId}`)
      .pipe(
        map((board) => {
          const boards = this.boardsSubject
            .getValue()
            .filter((b) => b.id !== boardId)
            .map((b, index) => {
              b.priority = index;
              return b;
            });

          this.boardsSubject.next(boards);

          return boards;
        }),
        switchMap((boards) => this.updateBoards(projectId)),
        map(() => of(true))
      );
  }

  updateBoards(projectId: string): Observable<any> {
    const boards = this.boardsSubject.getValue().map((board, index) => {
      return { ...board, priority: index };
    });

    this.boardsSubject.next(boards);
    this.socketService.send('board-update', {
      projectId: this.projectId,
      content: boards,
      sender: this.authService.getCurrentUser().id,
    });
    return this.apiService.put(`/projects/${projectId}/boards/batch`, boards);
  }

  cleanBoards(projectId: string): void {
    this.socketService.stop('board-update', projectId);
    this.initialLoading = false;
    this.projectId = '';
    this.boardsSubject.next([]);
  }

  //* TASKS

  addTask(body: Task, boardId: string, projectId: string): Observable<any> {
    return this.apiService
      .post(`/projects/${projectId}/boards/${boardId}/tasks/`, body)
      .pipe(
        map((task) => {
          const nextValue = this.boardsSubject.getValue().map((board) => {
            if (board.id === boardId) {
              board = { ...board, tasks: [...board.tasks, task] };
            }
            return board;
          });

          this.boardsSubject.next(nextValue);
          this.socketService.send('board-update', {
            projectId: this.projectId,
            content: nextValue,
            sender: this.authService.getCurrentUser().id,
          });
        })
      );
  }

  updateTask(
    task: Task,
    projectId: string,
    boardId: string,
    taskId: string
  ): any {
    const nextValue = this.boardsSubject.getValue().map((board) => {
      if (board.id === boardId) {
        board = {
          ...board,
          tasks: board.tasks.map((t) => {
            if (t.id === taskId) {
              return { ...task };
            }
            return t;
          }),
        };
      }

      return board;
    });

    this.socketService.send('board-update', {
      projectId: this.projectId,
      content: nextValue,
      sender: this.authService.getCurrentUser().id,
    });

    return this.apiService.put(
      `/projects/${projectId}/boards/${boardId}/tasks/${taskId}`,
      task
    );
  }

  updateTasks(
    board: Board,
    boardId: string,
    projectId: string
  ): Observable<any> {
    return this.apiService.put(
      `/projects/${projectId}/boards/${boardId}/tasks/`,
      board
    );
  }

  deleteTask(
    projectId: string,
    boardId: string,
    taskId: string
  ): Observable<any> {
    return this.apiService
      .delete(`/projects/${projectId}/boards/${boardId}/tasks/${taskId}`)
      .pipe(
        map((task) => {
          //* Delete task from board state & update task priority

          let nextValue = this.boardsSubject.getValue().map((board) => {
            if (board.id === boardId) {
              const tasksUpdate = board.tasks
                .filter((task) => task.id !== taskId)
                .map((task, index) => {
                  return { ...task, priority: index };
                });

              return { ...board, tasks: tasksUpdate };
            }
            return board;
          });

          this.boardsSubject.next(nextValue);
          this.socketService.send('board-update', {
            projectId: this.projectId,
            content: nextValue,
            sender: this.authService.getCurrentUser().id,
          });
          return nextValue;
        }),
        switchMap((boards) => {
          const board = boards.find((board) => board.id === boardId);
          return this.updateTasks(board!, boardId, projectId);
        }),
        map((data) => {
          return of(true);
        })
      );
  }

  transferTask(
    nextBoardId: string,
    projectId: string,
    boardId: string
  ): Observable<any> {
    const boards = this.boardsSubject.getValue().map((board) => {
      if (board.id === nextBoardId) {
        return {
          ...board,
          tasks: board.tasks.map((task, index) => {
            return { ...task, boardId: boardId, priority: index };
          }),
        };
      }
      return board;
    });

    let board = boards.find((board) => board.id === nextBoardId);

    this.socketService.send('board-update', {
      projectId: this.projectId,
      content: boards,
      sender: this.authService.getCurrentUser().id,
    });

    return this.updateTasks(board!, boardId, projectId);
  }

  moveTask(boardId: string, projectId: string): Observable<any> {
    let nextValue = this.boardsSubject.getValue().map((board) => {
      if (board.id === boardId) {
        return {
          ...board,
          tasks: board.tasks.map((task, index) => {
            return { ...task, priority: index };
          }),
        };
      }
      return board;
    });

    this.boardsSubject.next(nextValue);
    this.socketService.send('board-update', {
      projectId: this.projectId,
      content: nextValue,
    });

    let board = this.boardsSubject
      .getValue()
      .find((board) => board.id === boardId);

    return this.updateTasks(board!, boardId, projectId);
  }

  listenEvents(): void {
    this.socketService.listen('board-update', ({ content }: any) => {
      this.boardsSubject.next(content);
    });
  }
}
