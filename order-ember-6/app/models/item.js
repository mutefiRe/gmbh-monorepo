import Model, { attr, belongsTo } from '@ember-data/model';

export default class ItemModel extends Model {
  @attr name;
  @attr('number') amount;
  @attr('number') price;
  @attr('number') tax;
  @attr('number') group;
  @belongsTo('unit', { async: true, inverse: null }) unit;
  @belongsTo('category', { async: true, inverse: null }) category;
  @attr('boolean') enabled;
}
