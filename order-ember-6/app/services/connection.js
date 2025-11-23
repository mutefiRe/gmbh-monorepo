import Service from '@ember/service';

export default class ConnectionService extends Service {
  status = true;

  setStatus(status) {
    this.status = status;
  }
}
