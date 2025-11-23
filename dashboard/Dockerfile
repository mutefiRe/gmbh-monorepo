FROM danlynn/ember-cli:2.18.2-node_9.5

WORKDIR /app

COPY package.json /app/package.json

RUN npm install

COPY . /app

RUN bower install --allow-root

RUN npm run build

CMD [ "npm", "run" ,"serve:prod" ]
