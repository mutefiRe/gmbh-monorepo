import DS from 'ember-data';

export default DS.Model.extend({
  name:           DS.attr('string'),
  beginDate:      DS.attr('date'),
  endDate:        DS.attr('date'),
  instantPay:     DS.attr('boolean'),
  customTables:   DS.attr('boolean'),
  showItemPrice:  DS.attr('boolean'),
  receiptPrinter: DS.belongsTo('printer'),
  expiresTime:    DS.attr('string')
});
