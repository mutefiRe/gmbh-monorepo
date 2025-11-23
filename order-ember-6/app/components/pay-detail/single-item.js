import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class PayDetailSingleItemComponent extends Component {
  get style() {
    return `border-left: ${this.args.orderitem?.item?.category?.color} 5px solid`;
  }

  get computedCount() {
    const orderitem = this.args.orderitem;
    switch (this.args.type) {
      case 'paid':
        return orderitem?.countPaid;
      case 'marked':
        return orderitem?.countMarked;
      case 'open':
        return orderitem?.count - orderitem?.countMarked - orderitem?.countPaid;
      default:
        return orderitem?.count - orderitem?.countMarked - orderitem?.countPaid;
    }
  }

  get sumTotal() {
    return this.computedCount * this.args.orderitem?.price;
  }

  get sumMarked() {
    return this.args.orderitem?.countMarked * this.args.orderitem?.price;
  }

  @action
  incrementMarked() {
    const orderitem = this.args.orderitem;
    if (this.args.type === 'open' && orderitem.countMarked < orderitem.count - orderitem.countPaid) {
      orderitem.countMarked++;
    }
  }

  @action
  decrementMarked() {
    const orderitem = this.args.orderitem;
    if (orderitem.countMarked > 0) {
      orderitem.countMarked--;
    }
  }
}
