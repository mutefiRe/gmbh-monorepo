export default function() {
  this.namespace = '/api';
  this.urlPrefix = 'http://localhost:8080';
  this.get('/users');
  this.get('/users/:id', 'user')

  this.post('http://localhost:8080/authenticate', function() {
    return {
      //payload: {id: 1}
      token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiaWF0IjoxNDYyODIxODM2LCJleHAiOjE0NjI5MDgyMzZ9.QTVEuD2rlKRHREQhViVSf32pF0aAO7X9b5Zx1EwkN-g"
    }
  })
}
