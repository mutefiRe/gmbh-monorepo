import DS from 'ember-data';

export default DS.Model.extend({
  createdAt:   DS.attr('date'),
  updatedAt:   DS.attr('date'),
  extras:      DS.attr('string'),
  count:       DS.attr('number', {defaultValue: 1}),
  countPaid:   DS.attr('number', {defaultValue: 0}),
  countFree:   DS.attr('number', {defaultValue: 0}),
  countMarked: DS.attr('number', {defaultValue: 0}),
  price:       DS.attr('number'),
  order:       DS.belongsTo('order'),
  item:        DS.belongsTo('item')
});
