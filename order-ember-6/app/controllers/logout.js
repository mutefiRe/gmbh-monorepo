import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class LogoutController extends Controller {
  @service session;
  @service notificationMessages;
  @service i18n;
  @service router;

  errorMessage = null;

  async logout() {
    try {
      await this.session.invalidate();
      this.notifications.info(this.i18n.t('notification.logout.success'), { autoClear: true });
      this.router.transitionTo('login');
    } catch (error) {
      this.errorMessage = error?.message || this.i18n.t('notification.logout.error');
    }
  }
}
