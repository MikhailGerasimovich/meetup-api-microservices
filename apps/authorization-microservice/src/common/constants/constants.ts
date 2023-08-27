export const AUTH_MICROSERVICE = {
  RMQ_URL: process.env.RMQ_URL_AUTH_MICROSERVICE || 'amqp://localhost:5672',
  RMQ_QUEUE: process.env.RMQ_QUEUE_AUTH_MICROSERVICE || 'auth_microservice_queue',
};

export const ROLES_NAME = {
  USER: 'USER',
  ADMIN: 'ADMIN',
};

export const JWT = {
  ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'JWT_ACCESS_SECRET',
  REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'JWT_REFRESH_SECRET',
  ACCESS_DURATION: process.env.JWT_ACCESS_DURATION || '1h',
  REFRESH_DURATION: process.env.JWT_REFRESH_DURATION || '24h',
};
