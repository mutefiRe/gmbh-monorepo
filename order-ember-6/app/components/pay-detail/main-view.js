import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { storageFor } from 'ember-local-storage';

export default class PayDetailMainViewComponent extends Component {
  @service modal;
  @service pageTransitions;
  @service connection;
  @service i18n;
  @service notificationMessages;
  payStorage = storageFor('pay');
  forFree = false;

  get paidOrderitems() {
    return (this.args.overallOrderitems || []).filter(orderitem => orderitem.countPaid > 0);
  }

  get markedOrderitems() {
    return (this.args.overallOrderitems || []).filter(orderitem => orderitem.countMarked > 0);
  }

  get orderitems() {
    return (this.args.overallOrderitems || []).filter(orderitem => orderitem.countPaid < orderitem.count);
  }

  get markedAmount() {
    return this.markedOrderitems.reduce((sum, orderitem) => sum + orderitem.price * orderitem.countMarked, 0);
  }

  get openAmount() {
    return this.args.order?.openAmount;
  }

  get open() {
    return this.openAmount > 0;
  }

  @action
  swipeRight() {
    this.goToPayMain();
  }

  @action
  goToOrderMain() {
    this.pageTransitions.toScreen({ screen: 'order-main', from: 'right' });
  }

  @action
  goToPayMain() {
    this.pageTransitions.toScreen({ screen: 'pay-main', from: 'left' });
  }

  @action
  setActualOrder(table) {
    this.args.setOrder?.(table);
  }

  @action
  paySelected() {
    this.modal.showModal({ activeType: 'loading-box' });
    this.payMarkedOrderitems();
    const orders = this.args.order?.type === 'table' ? this.args.order.orders : [this.args.order];
    if (this.connection.status) {
      this.saveOrdersAPI(orders);
    } else {
      this.saveOrdersOffline(orders);
    }
  }

  @action
  payAll() {
    this.modal.showModal({ activeType: 'loading-box' });
    this.payAllOrderitems();
    const orders = this.args.order?.type === 'table' ? this.args.order.orders : [this.args.order];
    if (this.connection.status) {
      this.saveOrdersAPI(orders);
    } else {
      this.saveOrdersOffline(orders);
    }
  }

  @action
  toggleMarkAll() {
    if (this.markedOrderitems.length !== this.orderitems.length) {
      this.orderitems.forEach(orderitem => {
        orderitem.countMarked = orderitem.count - orderitem.countPaid;
      });
    } else {
      this.orderitems.forEach(orderitem => {
        orderitem.countMarked = 0;
      });
    }
  }

  @action
  printBill() {
    this.args.printBill?.(this.args.order?.id);
  }

  payAllOrderitems() {
    this.args.order?.orderitems?.forEach(orderitem => {
      orderitem.countPaid = orderitem.count;
      if (this.forFree) orderitem.countFree = orderitem.count;
      orderitem.countMarked = 0;
    });
  }

  payMarkedOrderitems() {
    this.markedOrderitems.forEach(orderitem => {
      orderitem.countPaid += orderitem.countMarked;
      if (this.forFree) orderitem.countFree += orderitem.countMarked;
      orderitem.countMarked = 0;
    });
  }

  orderPromises(orders) {
    return orders.map(order => {
      order.isPaid = true;
      order.totalAmount = 0;
      return order.save();
    });
  }

  saveOrdersOffline(orders) {
    orders.forEach(order => {
      order.totalAmount = order.openAmount;
      const serializedOrder = order.serialize();
      serializedOrder.id = order.id;
      this.payStorage.addObject(serializedOrder);
      this.forFree = false;
      this.modal.closeModal();
      this.notifications.info(this.i18n.t('notification.payment.offline'), { autoClear: true });
    });
  }

  saveOrdersAPI(orders) {
    Promise.all(this.orderPromises(orders)).then(() => {
      this.forFree = false;
      this.modal.closeModal();
      this.notifications.success(this.i18n.t('notification.payment.success'), { autoClear: true });
    }).catch(() => {
      this.notifications.error(this.i18n.t('notification.payment.error'), { autoClear: true });
    });
  }
}
