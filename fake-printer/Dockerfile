FROM node:20.15.1-alpine

WORKDIR /app

COPY package.json tsconfig.json ./
COPY src ./src

RUN npm install

RUN npm run build

EXPOSE 9100 9101

CMD ["npm", "run", "start"]
