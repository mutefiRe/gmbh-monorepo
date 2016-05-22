import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  enabled: DS.attr('boolean'),
  description: DS.attr('string'),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
  category: DS.belongsTo('category'),
  items: DS.hasMany('item')
});
