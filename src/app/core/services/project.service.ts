import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, BehaviorSubject, distinctUntilChanged, tap } from 'rxjs';
import { Project } from '../interfaces/project.interface';
import { of, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private initialLoading: boolean = false;
  private projectsSubject = new BehaviorSubject<Project[]>([] as Project[]);
  public projects = this.projectsSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  constructor(private apiService: ApiService) {}

  setProjects(): Observable<boolean> {
    if (!this.initialLoading) {
      this.initialLoading = true;

      return this.getAll().pipe(
        map((data) => {
          this.projectsSubject.next(data);
          return true;
        })
      );
    }

    return of(false);
  }

  refreshProjects(): void {
    this.getAll()
      .pipe()
      .subscribe((data) => {
        this.projectsSubject.next(data);
      });
  }

  private getAll(): Observable<any> {
    return this.apiService.get('/projects');
  }

  getProjectById(projectId: string): Observable<Project> {
    return this.apiService.get(`/projects/${projectId}`);
  }

  addProject(body: Object): Observable<boolean> {
    return this.apiService.post(`/projects/`, body).pipe(
      switchMap((data) => this.getProjectById(data.id)),
      map((data) => {
        this.projectsSubject.next([...this.projectsSubject.getValue(), data]);

        return true;
      })
    );
  }

  updateProject(body: Object, projectId: string): Observable<boolean> {
    return this.apiService.put(`/projects/${projectId}`, body).pipe(
      switchMap((data) => this.getProjectById(data.id)),
      map((data) => {
        const arr = this.projectsSubject.getValue();

        let index = arr.findIndex((p) => p.id === data.id);
        if (index !== -1) {
          arr.splice(index, 1, data);
        }

        this.projectsSubject.next(arr);

        return true;
      })
    );
  }

  deleteProject(projectId: string): Observable<boolean> {
    return this.apiService.delete(`/projects/${projectId}`).pipe(
      map(() => {
        const nextValue = this.projectsSubject
          .getValue()
          .filter((p) => p.id !== projectId);
        this.projectsSubject.next(nextValue);
        return true;
      })
    );
  }

  cleanProjects(): void {
    this.initialLoading = false;
    this.projectsSubject.next([]);
  }
}
