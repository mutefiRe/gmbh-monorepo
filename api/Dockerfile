FROM node:24-alpine

ENV PYTHON=/usr/bin/python3



WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "npm", "run", "start" ]
