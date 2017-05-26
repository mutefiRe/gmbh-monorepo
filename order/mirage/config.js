export default function() {

  // make this `http://localhost:8080`, for example, if your API is on a different server
  this.urlPrefix = 'http://localhost:8080';
  // delay for each request, automatically set to 0 during testing
  this.timing = 400;

  this.post('/authenticate', () => {
    return {token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3RuYW1lIjoiMTIzNDU2Nzg5MCIsImxhc3RuYW1lIjoiSm9obiBEb2UiLCJ1c2VybmFtZSI6IndhaXRlcl8xIiwicGFzc3dvcmQiOiJhYmMiLCJwZXJtaXNzaW9uIjoxLCJwcmludGVyIjoidGVzdCJ9.i_QVYHeQ0z52hgD2tdNjxBU-FnCIC5kJE6U97Ozvi2g"};
  });

  this.post('/error', () => {
    return {};
  });
  this.passthrough('/write-coverage');
  // make this `api`, for example, if your API is namespaced
  this.namespace = 'api';

  this.get('/categories');
  this.get('/units');
  this.get('/users/:id');
  this.get('/tables');
  this.get('/areas');
  this.get('/units');
  this.get('/settings');
  this.get('/orders');
  this.get('/items');
}
