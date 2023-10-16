FROM uselagoon/node-18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm i dotenv-cli

COPY . . 

RUN npm run generate:auth:docker 

RUN npm run build authorization

CMD ["npm", "run", "docker:run"]