import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ModalsItemSettingsComponent extends Component {
  @service modal;
  @service notificationMessages;
  @service i18n;
  @tracked amount = 1;

  @action
  add() {
    this.amount++;
  }

  @action
  sub() {
    if (this.amount > 1) {
      this.amount--;
    }
  }

  @action
  addItemsToOrder() {
    if (this.amount < 1) {
      this.notifications.warning(this.i18n.t('notification.orderitem.amount'), { autoClear: true });
      return;
    }
    this.args.addItemToOrder?.(this.args.modalItem, this.args.extra, this.amount);
    this.amount = 1;
    this.modal.closeModal();
  }

  @action
  close() {
    this.modal.closeModal();
    this.amount = 1;
  }
}
