import io from 'socket.io-client';
import { environment } from '../../environments/environment';

export class SocketioService {
    socket;
    connections = [];
    constructor() {}
    setupSocketConnection() {
      if (!this.socket) {
        this.socket = io(environment.SOCKET_ENDPOINT, { forceNew: true });
      }
    }
}