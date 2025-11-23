import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class OrderModel extends Model {
  @attr('date') createdAt;
  @attr('date') updatedAt;
  @attr('number') number;
  @belongsTo('user', { async: true, inverse: null }) user;
  @belongsTo('table', { async: true, inverse: null }) table;
  @hasMany('orderitem', { async: true }) orderitems;

  get showNumber() {
    return this.number || 'Noch nicht abgesendet!';
  }

  get openAmount() {
    const orderitems = (this.orderitems || []);
    let sum = 0;
    for (const orderitem of orderitems) {
      sum += orderitem.price * (orderitem.count - orderitem.countPaid);
    }
    return sum;
  }

  type = 'order';
}
