export const AUTH_MICROSERVICE = {
  RMQ_URL: process.env.RMQ_URL_AUTH_MICROSERVICE || 'amqp://localhost:5672',
  RMQ_QUEUE: process.env.RMQ_QUEUE_AUTH_MICROSERVICE || 'auth_microservice_queue',
};

export const METADATA = {
  MP_REGISTRATION: 'REGISTRATION',
  MP_LOGIN: 'LOGIN',
  MP_VALIDATE_USER: 'VALIDATE_USER',
};
