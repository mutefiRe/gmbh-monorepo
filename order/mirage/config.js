export default function() {

  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  this.urlPrefix = 'http://localhost:8080';    // make this `http://localhost:8080`, for example, if your API is on a different server
  this.timing = 400;      // delay for each request, automatically set to 0 during testing

  /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    http://www.ember-cli-mirage.com/docs/v0.2.x/shorthands/
  */
  this.post('/authenticate', () => {
    return {token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3RuYW1lIjoiMTIzNDU2Nzg5MCIsImxhc3RuYW1lIjoiSm9obiBEb2UiLCJ1c2VybmFtZSI6IndhaXRlcl8xIiwicGFzc3dvcmQiOiJhYmMiLCJwZXJtaXNzaW9uIjoxLCJwcmludGVyIjoidGVzdCJ9.i_QVYHeQ0z52hgD2tdNjxBU-FnCIC5kJE6U97Ozvi2g"};
  });

  this.namespace = '/api';    // make this `api`, for example, if your API is namespaced

  this.get('/categories', ({categories}, request) => {
    return categories.all();
  });

  this.get('/units', ({units}, request) => {
    return units.all();
  });

  this.get('/tables', 'tables');
  this.get('/areas', 'areas');
  this.get('/units', 'units');
  this.get('/settings', 'settings');
  this.get('/orders', 'settings');

  this.get('users/:id', ({ users }, request) => {
    return users.find(request.params.id);
  });

  this.get('items', 'items');
}
