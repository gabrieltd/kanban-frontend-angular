import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  Observable,
  BehaviorSubject,
  distinctUntilChanged,
  delay,
  tap,
} from 'rxjs';
import { Project } from '../interfaces/project.interface';
import { of, map, catchError, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private projectsLoaded: boolean = false;
  private projectsSubject = new BehaviorSubject<Project[]>([] as Project[]);
  public projects = this.projectsSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  constructor(private apiService: ApiService) {}

  setProjects(): Observable<boolean> {
    if (!this.projectsLoaded) {
      return this.getAll().pipe(
        map((data) => {
          this.projectsSubject.next(data);
          this.projectsLoaded = true;
          return true;
        })
      );
    }

    return of(false);
  }

  getAll(): Observable<any> {
    return this.apiService.get('/projects');
  }

  getById(projectId: string): Observable<Project> {
    return this.apiService.get(`/projects/${projectId}`);
  }

  save(body: Object): Observable<boolean> {
    return this.apiService.post(`/projects/`, body).pipe(
      switchMap((data) => this.getById(data.id)),
      map((data) => {
        const nextValue = this.projectsSubject.getValue();
        nextValue.push(data);
        this.projectsSubject.next(nextValue);

        return true;
      })
    );
  }

  update(body: Object, projectId: string): Observable<boolean> {
    return this.apiService.put(`/projects/${projectId}`, body).pipe(
      switchMap((data) => this.getById(data.id)),
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

  delete(projectId: string): Observable<boolean> {
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

  clean(): void {
    this.projectsLoaded = false;
    this.projectsSubject.next([]);
  }
}
