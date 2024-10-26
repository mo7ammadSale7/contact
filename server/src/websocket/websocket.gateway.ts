import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway {
  @WebSocketServer()
  server: Server;

  notifyContactsUpdated() {
    this.server.emit('contactsUpdated');
  }

  notifyContactLocked(contactId: string, username: string) {
    this.server.emit('contactLocked', { contactId, username });
  }

  notifyContactUnlocked(contactId: string) {
    this.server.emit('contactUnlocked', { contactId });
  }
}