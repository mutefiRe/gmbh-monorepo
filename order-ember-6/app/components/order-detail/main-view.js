import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class OrderDetailMainViewComponent extends Component {
  @service modal;
  @service pageTransitions;

  get tableButtonStyle() {
    const table = this.args.order?.table;
    if (!table) return '';
    return `background-color: ${table.area.color}; color: ${table.area.textcolor};`;
  }

  get openAmount() {
    let total = 0;
    this.args.order?.orderitems?.forEach(orderitem => {
      total += orderitem.price * (orderitem.count - orderitem.countPaid);
    });
    return total;
  }

  @action
  swipeRight() {
    this.goToOrderMain();
  }

  @action
  goToOrderMain() {
    this.pageTransitions.toScreen({ screen: 'order-main', from: 'left' });
  }

  @action
  goToPayDetail() {
    this.pageTransitions.toScreen({ screen: 'pay-detail', from: 'right' });
  }

  @action
  returnButton() {
    this.goToOrderMain();
  }

  @action
  deleteOrderItem(index) {
    this.args.deleteOrderItem?.(index);
  }

  @action
  showModal() {
    this.modal.showModal({ activeType: 'table-select', buttons: true });
  }

  @action
  showModal2() {
    this.modal.showModal({ activeType: 'discard-order' });
  }

  @action
  saveOrder() {
    this.args.saveOrder?.(() => {
      if (this.args.settings?.firstObject?.instantPay || this.args.user?.isCashier) {
        this.goToPayDetail();
      } else {
        this.goToOrderMain();
      }
    });
  }

  @action
  removeItemFromOrder(orderitem) {
    this.args.removeItemFromOrder?.(orderitem);
  }
}
