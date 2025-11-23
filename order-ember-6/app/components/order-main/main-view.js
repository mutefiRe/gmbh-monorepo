import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class OrderMainMainViewComponent extends Component {
  @service modal;
  @service pageTransitions;

  @action
  goToOrderDetail() {
    this.pageTransitions.toScreen({ screen: 'order-detail', from: 'right' });
  }

  @action
  goToPayMain() {
    this.pageTransitions.toScreen({ screen: 'pay-main', from: 'left' });
  }

  @action
  changeCategory(category) {
    this.args.changeCategory?.(category);
  }

  @action
  addItemToOrder(item) {
    this.args.addItemToOrder?.(item);
  }

  @action
  showModal(modalType, buttons, item) {
    this.modal.showModal({ modalType, buttons, item });
  }

  @action
  goToOrderDetailAction() {
    this.goToOrderDetail();
  }

  @action
  goToPayMainAction() {
    this.goToPayMain();
  }
}
