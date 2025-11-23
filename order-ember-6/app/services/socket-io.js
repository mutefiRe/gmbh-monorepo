import Service from '@ember/service';

export default class SocketIoService extends Service {
  createSocket(url, options) {
    // Assumes socket.io-client is installed
    if (window.io) {
      return window.io(url, options);
    } else {
      throw new Error('socket.io-client is not loaded');
    }
  }
}
