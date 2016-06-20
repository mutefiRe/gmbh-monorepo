import Ember from 'ember';
import getOwner from 'ember-getowner-polyfill';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

function updateData(io, token, store) {
  const socket = io.createSocket(window.EmberENV.host, {
    query: `token=${token}`
  });

  socket.on('update', function (payload) {
    setTimeout(function(){store.pushPayload(payload)},500);
  });

  return socket;
}

export default Ember.Route.extend(ApplicationRouteMixin, {
  socketService: Ember.inject.service('socket-io'),
  socketRef: null,
  session: Ember.inject.service('session'),
  store: this.store,
  afterModel() {
    const io = this.get('socketService');
    const content = this.get('session.session.content');

    if (this.get('session.isAuthenticated')) {
      this.set('socketRef', updateData(io, content.authenticated.token, this.store));
    }
  },
  sessionAuthenticated() {
    const session = this.get('session.session.content');
    const io = this.get('socketService');
    const token = session.authenticated.token;
    const authenticator = getOwner(this).lookup('authenticator:jwt');
    const userPermission = authenticator.getTokenData(session.authenticated.token).permission;
    const socket = updateData(io, token, this.store);

    this.set('socketRef', socket);

    switch (userPermission) {
      case 0:
      this.transitionTo('/dashboard');
      break;
      case 1:
      this.transitionTo('/order');
      break;
      default:
      this.transitionTo('/login');
      break;
    }
  },
  sessionInvalidated() {
    const socket = this.get('socketRef');

    socket.close();
  }
});
