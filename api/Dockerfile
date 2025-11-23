FROM node:24-bookworm

ENV PYTHON=python3
RUN ln -s /usr/bin/python3 /usr/bin/python

RUN apt-get update && apt-get install -y \
  cups \
  nmap \
  libcups2-dev python3 make g++ && rm -rf /var/lib/apt/lists/*

RUN npm install -g node-gyp

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "npm", "run", "start" ]

