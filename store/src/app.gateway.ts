import { Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppService } from './app.service';


@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly appService: AppService, 
    private readonly logger: Logger
  ) {}

  handleConnection(client: any) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('all')
  async handleGetMessages(@ConnectedSocket() _: Socket) {
    this.logger.log('Client requested all messages');

    const messages = await this.appService.getAll();

    this.logger.log(`Sending ${messages.length} messages to client`);

    this.server.emit('all-messages', messages);
  }
}