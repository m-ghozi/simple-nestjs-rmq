// src/app.module.ts
import { Module } from '@nestjs/common';
import { RabbitMQController } from './rabbitmq.controller';
import { RabbitMQService } from './rabbitmq.service';

@Module({
  controllers: [RabbitMQController],
  providers: [RabbitMQService],
})
export class AppModule {}
