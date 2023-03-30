import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { SubscribeMessage, WebSocketServer } from '@nestjs/websockets/decorators';
import { Server, Socket } from 'socket.io';
import { JwtPayload } from 'src/auth/interfaces';
import { NewMessageDto } from './dtos/new-message.dto';
import { MessageWsService } from './message-ws.service';

@WebSocketGateway({ cors: true })
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() wss: Server;
  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService
  ) {}

  async handleConnection(client: Socket) {

    const token =  client.handshake.headers.authentication  as string;

    let payload: JwtPayload;
    try{

      payload = this.jwtService.verify( token );

      await this.messageWsService.registerClient( client, payload.id);

    }catch(err){

      client.disconnect();

      return;

    }



    this.wss.emit('clients-updated', this.messageWsService.getConnectedClients())
    
  }

  handleDisconnect(client: Socket) {

    this.messageWsService.removeClient( client.id );

    this.wss.emit('clients-updated', this.messageWsService.getConnectedClients())
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient( client: Socket, payload: NewMessageDto ){
  
    // Emite unicamente al cliente
    // client.emit('message-from-server', {
    //   fullName:'Soy Yo',
    //   message: payload.message || 'no-message!!'
    // });


    // Emite a todos menos, al cliente inicial
    // client.broadcast.emit('message-from-server', {
    //   fullName:'Soy Yo',
    //   message: payload.message || 'no-message!!'
    // });


    this.wss.emit('message-from-server', {
      fullName: this.messageWsService.getUserFullName(client.id),
      message: payload.message || 'no-message!!'
    });
  
  }

}
