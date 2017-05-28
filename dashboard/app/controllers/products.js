import Ember from 'ember';

export default Ember.Controller.extend({
  sortDefinition: ['category.name', 'group:asc', 'enabled', 'name', 'price:asc'],
  filteredProducts: Ember.computed.filter('model.products', product => product.get('createdAt')).property('model.products.@each.createdAt'),
  sortedProducts: Ember.computed.sort('filteredProducts', 'sortDefinition').property('model.products.@each.{enabled,name,price}'),
  newRecord: null,
  currentSelectedRecord: null,
  actions: {
    createRecord() {
      if (!this.get('newRecord')) {
        Ember.$('body').addClass('noscroll');
        this.set('newRecord', this.get('store').createRecord('item'));
        this.set('currentSelectedRecord', {
          component: this,
          record: this.get('newRecord'),
          type:'controller'
        });
      }
    }
  }
});
