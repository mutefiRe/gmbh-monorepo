import DS from 'ember-data';

export default DS.Model.extend({
  order: DS.attr('string'),
  isBill: DS.attr('boolean')
});
