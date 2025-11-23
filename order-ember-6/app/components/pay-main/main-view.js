import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

function unpaidItem(orderitem) {
  return orderitem.countPaid >= orderitem.count;
}

export default class PayMainMainViewComponent extends Component {
  @service pageTransitions;

  get filteredOrders() {
    return (this.args.orders || []).filter(order => order.id !== this.args.order?.id);
  }

  get sortedOrders() {
    return this.filteredOrders.sort((a, b) => b.createdAt - a.createdAt);
  }

  get paidOrders() {
    return this.sortedOrders.filter(order => !order.orderitems.every(unpaidItem));
  }

  get openOrders() {
    return this.sortedOrders.filter(order => order.orderitems.every(unpaidItem));
  }

  @action
  swipeLeft() {
    this.goToOrderMain();
  }

  @action
  goToOrderMain() {
    this.pageTransitions.toScreen({ screen: 'order-main', from: 'right' });
  }

  @action
  goToPayMain() {
    this.pageTransitions.toScreen({ screen: 'pay-detail', from: 'right' });
  }

  @action
  filterButtonOrder() {
    this.args.setFilter?.('orders');
  }

  @action
  filterButtonTables() {
    this.args.setFilter?.('tables');
  }

  @action
  backButton() {
    this.goToOrderMain();
  }

  @action
  orderClick() {
    this.goToPayMain();
  }
}
