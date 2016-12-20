import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  x: DS.attr('number'),
  y: DS.attr('number'),
  custom: DS.attr('boolean', {defaultValue: false}),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
  area: DS.belongsTo('area')
});
