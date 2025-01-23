import { Kafka } from 'kafkajs';
import env from './env';
import { logger } from './logger/logger';

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: [env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: 'notification-consumers' });

async function run() {
  await consumer.connect();
  
  // Subscribe to multiple topics
  await consumer.subscribe({ topic: 'user-notifications', fromBeginning: true });
  // await consumer.subscribe({ topic: 'service2-notifications', fromBeginning: true });

  // Handle messages from service1 and service2
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      // Handle the message based on the topic
      if (topic === 'service1-notifications') {
        logger.info(`Received message from service1: ${message.value.toString()}`);
      } else if (topic === 'service2-notifications') {
        logger.info(`Received message from service2: ${message.value.toString()}`);
      }
    },
  });
}

run().catch(logger.error);
