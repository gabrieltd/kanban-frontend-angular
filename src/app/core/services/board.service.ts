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

  getAll(projectId: string): Observable<Board[]> {
    return this.apiService.get(`/projects/${projectId}/boards/`);
  }

  save(body: Object, projectId: string): Observable<any> {
    return this.apiService.post(`/projects/${projectId}/boards/`, body);
  }

  delete(boardId: string, projectId: string): Observable<any> {
    return this.apiService.delete(`/projects/${projectId}/boards/${boardId}`);
  }

  updateBoardPriority(boards: Board[], projectId: string): Observable<any> {
    return this.apiService.put(`/projects/${projectId}/boards/batch`, boards);
  }

  //* TASKS

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

  saveTask(body: Object, boardId: string, projectId: string): Observable<any> {
    return this.apiService.post(
      `/projects/${projectId}/boards/${boardId}/tasks/`,
      body
    );
  }

  updateTask(
    body: Object,
    projectId: string,
    boardId: string,
    taskId: string
  ): Observable<any> {
    return this.apiService.put(
      `/projects/${projectId}/boards/${boardId}/tasks/${taskId}`,
      body
    );
  }

  deleteTask(
    projectId: string,
    boardId: string,
    taskId: string
  ): Observable<any> {
    return this.apiService.delete(
      `/projects/${projectId}/boards/${boardId}/tasks/${taskId}`
    );
  }
}
