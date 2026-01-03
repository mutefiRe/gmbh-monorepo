FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY src ./src

CMD ["node", "src/index.js"]
