import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  name: DS.attr('string'),
  amount: DS.attr('number'),
  price: DS.attr('number'),
  tax: DS.attr('number'),
  sortId: DS.attr('number'),
  unit: DS.belongsTo('unit'),
  category: DS.belongsTo('category')
});
