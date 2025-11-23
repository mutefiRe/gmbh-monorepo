import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class ErrorController extends Controller {
  @service session;

  async logout() {
    await this.session.invalidate();
    this.notifications.info(this.i18n.t('notification.logout.success'), { autoClear: true });
    this.router.transitionTo('login');
  }
}
