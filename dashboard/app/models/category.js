import DS from 'ember-data';

export default DS.Model.extend({
  name:         DS.attr('string'),
  enabled:      DS.attr('boolean', {defaultValue: true}),
  description:  DS.attr('string'),
  createdAt:    DS.attr('date'),
  updatedAt:    DS.attr('date'),
  showAmount:   DS.attr('boolean'),
  icon:         DS.attr('string'),
  items:        DS.hasMany('item'),
  itemsSorting: ['sortId', 'name'],
  sortedItems:  Ember.computed.sort('items', 'itemsSorting'),
  color:        DS.attr("string", {defaultValue: '#aabbcc'}),
  printer:      DS.belongsTo('printer')
});
