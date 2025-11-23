import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service('socket-io') socketService;
  @service session;
  @service store;
  socketRef = null;

  async afterModel() {
    const io = this.socketService;
    const content = this.session.session.content;
    if (this.session.isAuthenticated) {
      this.socketRef = this.updateData(io, content.authenticated.token, this.store);
    }
  }

  sessionAuthenticated() {
    const session = this.session.session.content;
    const io = this.socketService;
    const token = session.authenticated.token;
    const socket = this.updateData(io, token, this.store);
    this.socketRef = socket;
  }

  sessionInvalidated() {
    const socket = this.socketRef;
    if (socket) socket.close();
  }

  updateData(io, token, store) {
    const that = this;
    const socket = io.createSocket(window.EmberENV.host, {
      query: `token=${token}`
    });
    socket.on('update', function (payload) {
      setTimeout(function () {
        store.pushPayload(payload);
      }, 500);
    });
    socket.on('delete', function (payload) {
      setTimeout(function () {
        const record = store.peekRecord(payload.type, payload.id);
        if (record) record.unloadRecord();
      }, 500);
    });
    socket.on('disconnect', function () {
      that.controllerFor('index').send('socketDisconnected');
    });
    socket.on('reconnect', function () {
      that.controllerFor('index').send('socketReconnected');
    });
    return socket;
  }

  @service router;

  transitionToLogin() {
    this.router.transitionTo('login');
  }
  transitionToLogout() {
    this.router.transitionTo('logout');
  }
  transitionToOrder() {
    this.router.transitionTo('index');
  }
}
