FROM node:20.15.1-alpine

WORKDIR /app

COPY package.json .
RUN npm install --omit=dev

COPY index.js .

EXPOSE 3000

CMD ["npm", "start"]
