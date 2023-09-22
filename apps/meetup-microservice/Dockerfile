FROM uselagoon/node-18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . . 

RUN npm i dotenv-cli

RUN  npm run generate:meetup:docker 

RUN npm run build

CMD ["npm", "run", "docker:run"]