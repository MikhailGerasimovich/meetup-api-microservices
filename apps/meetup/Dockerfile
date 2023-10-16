FROM uselagoon/node-18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm i dotenv-cli -g

COPY . . 

RUN  npm run generate:meetup:docker 

RUN npm run build meetup

CMD ["npm", "run", "docker:run"]