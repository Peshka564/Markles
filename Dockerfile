FROM node:14.5.0-alpine

# React
WORKDIR /app/client

COPY client/package*.json ./

RUN npm install

COPY client .

RUN npm run build

RUN rm -r node_modules

# Node

WORKDIR /app

COPY package*.json ./

RUN npm install && npm prune --production

COPY . .

ENV PORT=5000

EXPOSE ${PORT}

CMD ["npm", "start"]