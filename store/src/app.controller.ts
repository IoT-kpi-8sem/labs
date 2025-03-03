import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { AgentMessageDto, HubMessageDto } from './dto/agent-message.dto';
import { AppGateway } from './app.gateway';

@Controller('messages')
export class AppController {
  constructor(
    private readonly appService: AppService, 
    private readonly ws: AppGateway
  ) {}

  @Get()
  async getAll() {
    return this.appService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.appService.getById(id);
  }

  @Post('create')
  async create(@Body() messages: HubMessageDto[]) {
    for (const message of messages) {
      console.dir(message, { depth: null });

      const created = await this.appService.create(message);

      this.ws.server.emit('message-created', created);
    }

    return 'ok';
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() agentMessage: Partial<AgentMessageDto>) {
    return this.appService.update(id, agentMessage);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.appService.delete(id);
  }
}
