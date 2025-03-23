import { Injectable } from '@nestjs/common';

import { DbClient } from './db/prisma-client';
import { AgentMessageDto, HubMessageDto } from './dto/agent-message.dto';

@Injectable()
export class AppService {
  constructor(private readonly db: DbClient) {}
  
  async getAll() {
    return this.db.agentMessage.findMany()
  }

  async getById(id: string) {
    return this.db.agentMessage.findUnique({
      where: {
        id,
      },
    })
  }

  async create({ AgentMessage, RoadState }: HubMessageDto) {
    return this.db.agentMessage.create({
      data: {
        gps: AgentMessage.Gps,
        accelerometer: AgentMessage.Accelerometer,
        clientId: AgentMessage.ClientId,
        time: AgentMessage.Time,
        roadState: RoadState,
        speed: AgentMessage.Speed,
      },
    })
  }

  async update(id: string, agentMessage: Partial<AgentMessageDto>) {
    return this.db.agentMessage.update({
      where: {
        id,
      },
      data: agentMessage,
    })
  }

  async delete(id: string) {
    return this.db.agentMessage.delete({
      where: {
        id,
      },
    })
  }
}
