export const APPLICATION = {
  PORT: process.env.PORT || 3000,
};

export const AUTH_MICROSERVICE = {
  RMQ_URL: process.env.RMQ_URL_MEETUP_MICROSERVICE || 'amqp://localhost:5672',
  RMQ_QUEUE: process.env.RMQ_QUEUE_MEETUP_MICROSERVICE || 'auth_microservice_queue',
  RMQ_CLIENT_NAME: process.env.RMQ_CLIENT_NAME_MEETUP_MICROSERVICE || 'GATEWAY_MEETUP_SERVICE',
};

export const MEETUP_MICROSERVICE = {
  RMQ_URL: process.env.RMQ_URL_MEETUP_MICROSERVICE || 'amqp://localhost:5672',
  RMQ_QUEUE: process.env.RMQ_QUEUE_MEETUP_MICROSERVICE || 'meetup_microservice_queue',
  RMQ_CLIENT_NAME: process.env.RMQ_CLIENT_NAME_MEETUP_MICROSERVICE || 'GATEWAY_MEETUP_SERVICE',
};

export const JWT = {
  ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'JWT_ACCESS_SECRET',
  REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'JWT_REFRESH_SECRET',
  ACCESS_DURATION: process.env.JWT_ACCESS_DURATION || '1h',
  REFRESH_DURATION: process.env.JWT_REFRESH_DURATION || '24h',
};
