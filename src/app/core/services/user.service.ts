import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user.inferface';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private apiService: ApiService) {}

  getUsers(query: string): Observable<User[]> {
    let params = new HttpParams();

    params = params.append('q', query);

    return this.apiService.get('/profile', { params });
  }
}
