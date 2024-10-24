// src/rabbitmq/rabbitmq.controller.ts
import {
  Controller,
  Post,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';

@Controller('rabbitmq')
export class RabbitMQController {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  @Post('hello')
  async sendHelloWorld() {
    try {
      const message = {
        message: 'Hello World',
        timestamp: new Date().toISOString(),
      };

      await this.rabbitMQService.sendMessage(message);

      return {
        status: 'success',
        message: 'Hello World message sent successfully',
        sentData: message,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to send message to RabbitMQ',
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
