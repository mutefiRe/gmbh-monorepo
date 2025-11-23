import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class TableModel extends Model {
  @attr name;
  @attr('number') x;
  @attr('number') y;
  @attr('boolean', { defaultValue: true }) custom;
  @attr('date') createdAt;
  @attr('date') updatedAt;
  @attr('boolean', { defaultValue: true }) enabled;
  @belongsTo('area', { async: true, inverse: null }) area;
  @hasMany('order', { async: true }) orders;

  get shortname() {
    const name = this.name || '';
    return name.length > 12 ? name.substring(0, 12) + '\u2026' : name;
  }

  get orderitems() {
    const final = [];
    const orders = this.orders || [];
    orders.forEach(order => {
      (order.orderitems || []).forEach(orderitem => {
        final.push(orderitem);
      });
    });
    return final;
  }

  get openAmount() {
    const orderitems = this.orderitems || [];
    let sum = 0;
    for (const orderitem of orderitems) {
      sum += orderitem.price * (orderitem.count - orderitem.countPaid);
    }
    return sum;
  }

  type = 'table';
}
