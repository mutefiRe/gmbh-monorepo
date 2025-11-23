FROM danlynn/ember-cli:2.18.2-node_8.9

WORKDIR /app

COPY package.json /app/package.json
COPY bower.json /app/bower.json

RUN npm install

RUN bower install --allow-root

COPY . /app

RUN npm run build

CMD [ "npm", "start" ]
