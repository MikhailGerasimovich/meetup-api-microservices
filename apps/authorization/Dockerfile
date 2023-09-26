FROM uselagoon/node-18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . . 

RUN npm i dotenv-cli

RUN  npm run generate:auth:docker 

RUN npm run build authorization-microservice

CMD ["npm", "run", "docker:run"]