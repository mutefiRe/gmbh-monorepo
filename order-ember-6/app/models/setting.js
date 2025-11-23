import Model, { attr } from '@ember-data/model';

export default class SettingModel extends Model {
  @attr name;
  @attr('date') beginDate;
  @attr('date') endDate;
  @attr('boolean') instantPay;
  @attr('boolean') customTables;
  @attr('boolean') showItemPrice;
}
