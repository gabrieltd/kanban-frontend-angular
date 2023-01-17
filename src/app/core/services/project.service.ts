import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Project } from '../interfaces/project.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private apiService: ApiService) {}

  getAll(): Observable<any> {
    return this.apiService.get('/projects');
  }

  getById(projectId: string): Observable<Project> {
    return this.apiService.get(`/projects/${projectId}`);
  }

  save(body: Object) {
    return this.apiService.post(`/projects/`, body);
  }

  delete(projectId: string): Observable<Project> {
    return this.apiService.delete(`/projects/${projectId}`);
  }
}
