import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MessageWsService } from './message-ws.service';

@WebSocketGateway({ cors: true })
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly messageWsService: MessageWsService,
  ) {}

  handleConnection(client: Socket) {
    console.log('Cliente conectado', client.id)
  }

  handleDisconnect(client: Socket) {
    console.log('Cliente desonectado', client.id)
  }

}
