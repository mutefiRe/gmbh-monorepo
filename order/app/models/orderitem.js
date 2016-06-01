import DS from 'ember-data';

export default DS.Model.extend({
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
  extras: DS.attr('string'),
  isPaid: DS.attr('boolean'),
  order: DS.belongsTo('order'),
  item: DS.belongsTo('item')
});
