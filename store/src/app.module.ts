import {  Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbClient } from './db/prisma-client';
import { AppGateway } from './app.gateway';


@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, DbClient, AppGateway, Logger],
})
export class AppModule {}
