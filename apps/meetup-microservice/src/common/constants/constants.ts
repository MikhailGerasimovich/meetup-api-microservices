export const MEETUP_MICROSERVICE = {
  RMQ_URL: process.env.RMQ_URL_MEETUP_MICROSERVICE || 'amqp://localhost:5672',
  RMQ_QUEUE: process.env.RMQ_QUEUE_MEETUP_MICROSERVICE || 'meetup_microservice_queue',
};
