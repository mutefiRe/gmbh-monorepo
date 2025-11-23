import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class LoginController extends Controller {
  @service session;
  @service payload;
  @service notificationMessages;
  @service i18n;
  @service router;

  @tracked identification = '';
  @tracked password = '';

  async authenticate() {
    const credentials = { identification: this.identification, password: this.password };
    try {
      await this.session.authenticate('authenticator:jwt', credentials);
      this.router.transitionTo('index');
    } catch (reason) {
      if (reason && reason.errors && reason.errors.msg) {
        this.notifications.error(this.i18n.t(reason.errors.msg), { autoClear: true });
      } else {
        this.notifications.error(this.i18n.t('notification.login.error'), { autoClear: true });
      }
    }
  }
}
