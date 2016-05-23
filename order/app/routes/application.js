import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

function updateData(io, token, store) {
  const socket = io.createSocket(window.EmberENV.host, {
    query: `token=${token}`
  });

  socket.on('update', function (payload) {
    store.pushPayload(JSON.parse(payload));
  });

  return socket;
}

export default Ember.Route.extend(ApplicationRouteMixin, {
  socketService: Ember.inject.service('socket-io'),
  socketRef: null,
  session: Ember.inject.service('session'),
  store: this.store,
  init() {
    const session = this.get('session');
    const io = this.get('socketService');
    const store = this.get('store');
    const self = this;

    session.on('authenticationSucceeded', function () {
      const token = this.get('session.content').authenticated.token;

      self.set('socketRef', updateData(io, token, store));
    });

    session.on('invalidationSucceeded', function () {
      const socket = self.get('socketRef');

      socket.close();
    });

  },
  afterModel() {
    const io = this.get('socketService');
    const content = this.get('session.session.content');

    if (this.get('session.isAuthenticated')) {
      updateData(io, content.authenticated.token, this.store);
    }
  }
});
