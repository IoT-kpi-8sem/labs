import { Logger, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbClient } from './db/prisma-client';
import { AppGateway } from './app.gateway';
import { MetricsModule } from './metrics/metrics.module';
import { HttpMetricsInterceptor } from './metrics/http-metrics.interceptor';


@Module({
  imports: [MetricsModule],
  controllers: [AppController],
  providers: [
    AppService,
    DbClient,
    AppGateway,
    Logger,
    { provide: APP_INTERCEPTOR, useClass: HttpMetricsInterceptor },
  ],
})
export class AppModule {}
