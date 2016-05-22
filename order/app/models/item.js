import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  amount: DS.attr('number'),
  price: DS.attr('number'),
  tax: DS.attr('number'),
  unit: DS.belongsTo('unit', { inverse: null }),
  category: DS.belongsTo('category')
});
