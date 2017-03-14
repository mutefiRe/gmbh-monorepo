import DS from 'ember-data';

export default DS.Model.extend({
  name:         DS.attr('string'),
  enabled:      DS.attr('boolean'),
  description:  DS.attr('string'),
  createdAt:    DS.attr('date'),
  updatedAt:    DS.attr('date'),
  showAmount:   DS.attr('boolean'),
  icon:         DS.attr('string'),
  printer:      DS.attr('string'),
  category:     DS.belongsTo('category'),
  items:        DS.hasMany('item'),
  itemsSorting: ['sortId', 'name'],
  sortedItems:  Ember.computed.sort('items', 'itemsSorting')
});
