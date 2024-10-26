import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<string | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private users = [
    { username: 'user1', password: 'user1' },
    { username: 'user2', password: 'user2' }
  ];

  login(username: string, password: string): Observable<string> {
    const user = this.users.find(u => u.username === username && u.password === password);
    
    if (user) {
      localStorage.setItem('currentUser', username);
      this.currentUserSubject.next(username);
      return of(username);
    }
    
    return throwError(() => new Error('Invalid credentials'));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('currentUser');
  }
}