import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class PayMainSingleOrderComponent extends Component {
  get openAmount() {
    let total = 0;
    this.args.order?.orderitems?.forEach(orderitem => {
      total += orderitem.price * (orderitem.count - orderitem.countPaid);
    });
    return total;
  }

  get paid() {
    return this.openAmount === 0 ? 'paid' : 'notpaid';
  }

  @action
  click() {
    if (this.args.setActualOrder) {
      this.args.setActualOrder(this.args.order);
    }
    if (this.args.goToOrderDetail) {
      this.args.goToOrderDetail();
    }
  }
}
