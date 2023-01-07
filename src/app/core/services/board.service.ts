import { Injectable } from '@angular/core';
import { Board } from '../interfaces/board.interface';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  constructor(private apiService: ApiService) {}

  //* BOARDS

  getAll(): Observable<Board[]> {
    return this.apiService.get('/boards/');
  }

  save(body: Object): Observable<any> {
    return this.apiService.post('/boards/', body);
  }

  delete(boardId: string): Observable<any> {
    return this.apiService.delete(`/boards/${boardId}`);
  }

  updateBoardPriority(boards: Board[]): Observable<any> {
    return this.apiService.put('/boards/batch', boards);
  }

  //* TASKS

  updateTaskPriority(board: Board): Observable<any> {
    return this.apiService.put('/tasks/batch', board);
  }

  saveTask(body: Object): Observable<any> {
    return this.apiService.post('/tasks/', body);
  }

  updateTask(taskId: string, body: Object): Observable<any> {
    return this.apiService.put(`/tasks/${taskId}`, body);
  }

  deleteTask(taskId: string): Observable<any> {
    return this.apiService.delete(`/tasks/${taskId}`);
  }
}
