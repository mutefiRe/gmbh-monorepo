import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class OrderDetailSingleItemComponent extends Component {
  @tracked isTabbed = false;

  @action
  click() {
    this.isTabbed = true;
  }

  @action
  deleteOrderItem() {
    this.args.deleteOrderItem?.(this.args.index);
  }

  @action
  closeTabbed() {
    this.isTabbed = false;
  }

  @action
  removeItemFromOrder() {
    this.args.removeItemFromOrder?.(this.args.orderitem);
  }

  @action
  reduceOrderitemCount() {
    const count = this.args.orderitem?.count;
    if (count > 1) {
      this.args.orderitem.count--;
    } else {
      this.removeItemFromOrder();
    }
  }
}
