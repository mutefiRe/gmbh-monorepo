import Ember from 'ember';

export default Ember.Component.extend({

  socketIOService: Ember.inject.service('socket-io'),

  init: function() {
    this._super.apply(this, arguments);

    const socket = this.get('socketIOService').socketFor('http://localhost:8080/')
    socket.on('connect', function() {
      socket.on('authenticationResponse', function(data){console.log(data)})
    })
  },

  actions: {
    login: function(data){
      const socket = this.get('socketIOService').socketFor('http://localhost:8080/')
      socket.emit('authenticationRequest', data);
      console.log(data)
    }
  }
});
