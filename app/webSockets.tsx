import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { EditNoteDto, Note } from './model';
import { WEB_SOCKET_URL } from '@/paths';


class WebSocketService {
  private client: Client | null = null;

  connect(onMessageCallback: (note: Note) => void): void {
    const socket = new SockJS(`${WEB_SOCKET_URL}/noteMessage`);

    this.client = new Client({
      webSocketFactory: () => socket,
      debug: (str: string) => console.log(str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('WebSocket connected');

        this.client?.subscribe(
          `/${"petar"}/queue/position-updates`,
          (message: IMessage) => {
            const body: Note = JSON.parse(message.body);
            console.log(message.body, "bodyyyyyyyyyy")
            onMessageCallback(body);
          }
        );
      },
      onStompError: (frame) => {
        console.error('Broker error:', frame.headers['message']);
        console.error('Details:', frame.body);
      },
    });

    this.client.activate();
  }

  sendMessage(payload: EditNoteDto): void {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination: '/app/update-note',
        body: JSON.stringify(payload),
      });
    } else {
      console.warn('Cannot send message: STOMP client is not connected.');
    }
  }

  disconnect(): void {
    if (this.client && this.client.active) {
      this.client.deactivate();
    }
  }
}

const websocketService = new WebSocketService();
export default websocketService;
