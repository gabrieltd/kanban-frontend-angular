import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  private tokenSubject = new BehaviorSubject<string>('');
  public token = this.tokenSubject.asObservable().pipe(distinctUntilChanged());

  constructor() {}

  getToken(): string {
    return this.tokenSubject.getValue();
  }

  saveToken(newToken: string): void {
    this.tokenSubject.next(newToken);
  }

  destroyToken(): void {
    this.tokenSubject.next('');
  }
}
