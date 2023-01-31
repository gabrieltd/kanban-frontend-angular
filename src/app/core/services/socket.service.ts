import { Injectable, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: io.Socket;

  constructor() {
    this.socket = io.connect(environment.socketUrl, {
      withCredentials: true,
      transports: ['websocket'],
      autoConnect: false,
    });
  }

  listen(event: string, callback: any): any {
    this.socket.on(event, callback);
  }

  send(event: string, data: string | Object) {
    this.socket.emit(event, data);
  }

  connect(from: string, to: string): void {
    this.socket.emit('join-project', { from, to });
    this.socket.connect();
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  stop(event: string, to: string): void {
    this.socket.emit('leave-project', { to });
    this.socket.off('board-update');
  }

  checkConnection(): boolean {
    return this.socket.connected;
  }
}
