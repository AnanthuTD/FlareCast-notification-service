import {Kafka} from 'kafkajs'
import env from '../env'

const kafka = new Kafka({
  brokers: [env.KAFKA_BROKER],
  clientId: 'notification-service',
})

export default kafka