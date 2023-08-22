export const MEETUP_MICROSERVICE = {
  RMQ_URL: process.env.RMQ_URL_MEETUP_MICROSERVICE || 'amqp://localhost:5672',
  RMQ_QUEUE: process.env.RMQ_QUEUE_MEETUP_MICROSERVICE || 'meetup_microservice_queue',
};

export const METADATA = {
  MP_GET_ALL_MEETUPS: 'GET_ALL_MEETUPS',
  MP_GET_MEETUP_BY_ID: 'GET_MEETUP_BY_ID',
  MP_CREATE_MEETUP: 'CREATE_MEETUP',
  MP_UPDATE_MEETUP_BY_ID: 'UPDATE_MEETUP_BY_ID',
  EP_DELETE_MEETUP_BY_ID: 'DELETE_MEETUP_BY_ID',

  MP_GET_ALL_TAGS: 'GET_ALL_TAGS',
  MP_GET_TAG_BY_ID: 'GET_TAG_BY_ID',
  MP_CREATE_TAG: 'CREATE_TAG',
  MP_UPDATE_TAG_BY_ID: 'UPDATE_TAG_BY_ID',
  EP_DELETE_TAG_BY_ID: 'DELETE_TAG_BY_ID',
};
