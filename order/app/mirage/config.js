import Mirage from 'ember-cli-mirage';

export default function () {
  const ERROR_CODE = 403;
  const PAYLOAD = 'eyJpZCI6MSwiaWF0IjoxNDYyODIxODM2LCJleHAiOjE0NjI5MDgyMzZ9';
  const PAYLOAD_ADMIN = 'eyJpZCI6MSwicGVybWlzc2lvbiI6MH0';
  const PAYLOAD_WAITER = 'eyJpZCI6MSwicGVybWlzc2lvbiI6MX0';

  this.namespace = '/api';
  this.urlPrefix = 'http://localhost:8080';
  this.get('/users');
  this.get('/users/:id');

  this.get('/items');
  this.get('/categories');
  this.get('/units');

  this.get('/orders');
  this.get('/orderitems');

  this.get('/tables');

  this.post('http://localhost:8080/authenticate', function (db, req) {
    switch (JSON.parse(req.requestBody).username) {
      case 'no':
        return new Mirage.Response(ERROR_CODE, {}, {error: 'User not foud'});
      case 'admin':
        return {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + PAYLOAD_ADMIN + '.Xlfhc0DpyJLHPVJp3fp1ZWZT-K9GQmwWZ52X6WVLi8M'
        };
      case 'waiter':
        return {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + PAYLOAD_WAITER + '.KWMu1UJLrqHdO_n9h9x_itkDHExNXC91JxtyMbXPE_c'
        };
      default:
        return {
          token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.' + PAYLOAD + '.QTVEuD2rlKRHREQhViVSf32pF0aAO7X9b5Zx1EwkN-g'
        };
    }
  });

  this.passthrough('http://localhost:8080/socket.io');
}
