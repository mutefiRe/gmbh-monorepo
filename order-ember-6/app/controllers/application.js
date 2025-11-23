import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';

export default class ApplicationController extends Controller {
  @service session;
  @service store;

  get currentUser() {
    const authenticator = getOwner(this).lookup('authenticator:jwt');
    const session = this.session.session.content;
    if (session && session.authenticated.token) {
      const tokenData = authenticator.getTokenData(session.authenticated.token);
      if (tokenData.id) {
        return this.store.findRecord('user', tokenData.id);
      }
    }
    return false;
  }
}
