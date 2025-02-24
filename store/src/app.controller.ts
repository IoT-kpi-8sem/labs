import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { AgentMessageDto } from './dto/agent-message.dto';

@Controller('messages')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getAll() {
    return this.appService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.appService.getById(id);
  }

  @Post('create')
  async create(@Body() agentMessage: AgentMessageDto) {
    return this.appService.create(agentMessage);
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
