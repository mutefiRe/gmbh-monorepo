import Model, { attr, belongsTo } from '@ember-data/model';

export default class OrderitemModel extends Model {
  @attr('date') createdAt;
  @attr('date') updatedAt;
  @attr extras;
  @attr('number', { defaultValue: 1 }) count;
  @attr('number', { defaultValue: 0 }) countPaid;
  @attr('number', { defaultValue: 0 }) countFree;
  @attr('number', { defaultValue: 0 }) countMarked;
  @attr('number') price;
  @belongsTo('order', { async: true, inverse: null }) order;
  @belongsTo('item', { async: true, inverse: null }) item;

  get orderIsPaid() {
    return (this.order?.openAmount ?? 0) <= 0;
  }
}
