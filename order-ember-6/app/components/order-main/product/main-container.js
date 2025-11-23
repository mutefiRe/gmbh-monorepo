import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class OrderMainProductMainContainerComponent extends Component {
  @action
  swipeLeft() {
    this.args.goToOrderDetail?.();
  }

  @action
  swipeRight() {
    this.args.goToPayMain?.();
  }

  @action
  addItemToOrder(item) {
    this.args.addItemToOrder?.(item);
  }

  @action
  showModal(modalType, buttons, item) {
    this.args.showModal?.(modalType, buttons, item);
  }

  @action
  goToOrderDetail() {
    this.args.goToOrderDetail?.();
  }

  @action
  goToPayMain() {
    this.args.goToPayMain?.();
  }
}
