import { Injectable, Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppService } from './app.service';
import { AgentMessage } from '@prisma/client';
import { RoadStateMap } from './road-state-map';

@Injectable()
@WebSocketGateway({ cors: true })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly appService: AppService,
    private readonly logger: Logger,
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

    this.server.emit('all-messages', messages.map((msg) => {
      const recommendedSpeed: number = RoadStateMap[msg.roadState ?? 'unknown'] ?? 50;

      return { ...msg, recommendedSpeed };
    }));
  }

  @SubscribeMessage('create')
  async handleCreateMessage(
    @ConnectedSocket() _: Socket,
    message: AgentMessage,
  ) {
    this.logger.log('Client requested to create a message');
    
    const recommendedSpeed: number = RoadStateMap[message.roadState ?? 'unknown'] ?? 50;

    this.server.emit('message-created', { ...message, recommendedSpeed });
  }
}
