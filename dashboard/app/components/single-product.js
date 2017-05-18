import Ember from 'ember';

export default Ember.Component.extend({
  editable: Ember.inject.service(),
  tagName: 'li',
  actions: {
    toggleEditable() {
      this.get('editable').toggle(this);
    },
    updateProduct(product) {
      product.save();
    },
    destroyProduct(product) {
      product.destroyRecord();
    }
  }
});
