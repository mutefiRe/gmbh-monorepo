import Model, { attr } from '@ember-data/model';

export default class PrintModel extends Model {
  @attr order;
  @attr('boolean') isBill;
}
