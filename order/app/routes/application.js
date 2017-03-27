import Ember from 'ember';

export default Ember.Route.extend({
  socketService: Ember.inject.service('socket-io'),
  socketRef: null,
  session: Ember.inject.service('session'),
  store: this.store,
  afterModel() {
    const io = this.get('socketService');
    const content = this.get('session.session.content');

    if (this.get('session.isAuthenticated')) {
      this.set('socketRef', this.updateData(io, content.authenticated.token, this.store));
    }
  },
  sessionAuthenticated() {
    const session = this.get('session.session.content');
    const io = this.get('socketService');
    const token = session.authenticated.token;
    const socket = this.updateData(io, token, this.store);

    this.set('socketRef', socket);
  },
  sessionInvalidated() {
    const socket = this.get('socketRef');

    socket.close();
  },
  updateData(io, token, store) {
    const that = this;
    const socket = io.createSocket(window.EmberENV.host, {
      query: `token=${token}`
    });

    socket.on('update', function (payload) {
      setTimeout(function () {
        store.pushPayload(payload);
      },500);
    });

    socket.on('delete', function (payload) {
      setTimeout(function () {
        const record = store.peekRecord(payload.type, payload.id);
        if (record) record.unloadRecord();
      }, 500);
    });

    socket.on('disconnect', function () {
      that.controllerFor('order').send('socketDisconnected');
    });

    socket.on('reconnect', function () {
      that.controllerFor('order').send('socketReconnected');
    });

    return socket;
  },
  actions: {
    transitionToLogin() {
      this.transitionTo('login');
    },
    transitionToLogout() {
      this.transitionTo('logout');
    },
    transitionToOrder() {
      this.transitionTo('index');
    }
  }
});


