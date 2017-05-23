import Ember from 'ember';

export default Ember.Component.extend({
  editable: Ember.inject.service(),
  store: Ember.inject.service(),
  tagName: 'li',
  actions: {
    toggleEditable() {
      this.get('editable').toggle({ component: this, record: this.get('product') });
    },
    changeRelation(product, event) {
      const category = this.get('store').peekRecord('category', event.target.value)
      product.set('category', category);
    },
    updateProduct(product) {
      product.save();
    },
    destroyProduct(product) {
      product.destroyRecord();
    }
  }
});
