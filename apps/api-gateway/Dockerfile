FROM uselagoon/node-18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . . 

RUN npm run build api-gateway

CMD ["npm", "run", "docker:run"]