import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';
import { rabbitmqConfig } from './rabbitmq.config';

@Injectable()
export class RabbitMQService {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async init() {
    try {
      // Create connection
      this.connection = await amqp.connect({
        hostname: rabbitmqConfig.hostname,
        port: rabbitmqConfig.port,
        username: rabbitmqConfig.username,
        password: rabbitmqConfig.password,
        vhost: rabbitmqConfig.vhost,
      });

      // Create channel
      this.channel = await this.connection.createChannel();

      // Assert queue
      await this.channel.assertQueue(rabbitmqConfig.queue, {
        durable: true,
      });

      console.log('Successfully connected to RabbitMQ');
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error);
      throw error;
    }
  }

  async sendMessage(message: any) {
    try {
      if (!this.channel) {
        await this.init();
      }

      const messageBuffer = Buffer.from(JSON.stringify(message));

      return this.channel.sendToQueue(rabbitmqConfig.queue, messageBuffer, {
        persistent: true,
      });
    } catch (error) {
      console.error('Error sending message to RabbitMQ:', error);
      throw error;
    }
  }

  async closeConnection() {
    try {
      await this.channel?.close();
      await this.connection?.close();
    } catch (error) {
      console.error('Error closing RabbitMQ connection:', error);
      throw error;
    }
  }
}
