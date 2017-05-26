import Ember from 'ember';

export default Ember.Controller.extend({
  sortDefinition: ['category.id', 'group:asc', 'name', 'price:asc'],
  sortedProducts: Ember.computed.sort('model.products', 'sortDefinition')
});
