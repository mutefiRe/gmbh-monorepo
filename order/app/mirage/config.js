import Mirage from 'ember-cli-mirage';
export default function () {
  const ERROR_CODE = 403;
  const PAYLOAD = 'eyJpZCI6MSwiaWF0IjoxNDYyODIxODM2LCJleHAiOjE0NjI5MDgyMzZ9';

  this.namespace = '/api';
  this.urlPrefix = 'http://localhost:8080';
  this.get('/users');
  this.get('/users/:id', 'user');

  this.post('http://localhost:8080/authenticate', function (db, req) {
    if (JSON.parse(req.requestBody).username === 'no') {
      return new Mirage.Response(ERROR_CODE, {}, {error: 'User not foud'});
    }

    return {
      token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.' + PAYLOAD + '.QTVEuD2rlKRHREQhViVSf32pF0aAO7X9b5Zx1EwkN-g'
    };
  });
}
