import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  onContactsUpdated(): Observable<void> {
    return new Observable(observer => {
      this.socket.on('contactsUpdated', () => {
        observer.next();
      });
    });
  }

  onContactLocked(): Observable<{ contactId: string; username: string }> {
    return new Observable(observer => {
      this.socket.on('contactLocked', (data) => {
        observer.next(data);
      });
    });
  }

  onContactUnlocked(): Observable<{ contactId: string }> {
    return new Observable(observer => {
      this.socket.on('contactUnlocked', (data) => {
        observer.next(data);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
