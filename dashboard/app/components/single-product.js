import Ember from 'ember';

export default Ember.Component.extend({
  editable: Ember.inject.service(),
  enable: Ember.inject.service(),
  store: Ember.inject.service(),
  tagName: 'li',
  isEnabled: Ember.computed('product.enabled', 'product.category.enabled', function() {
    return this.get('product.enabled') && this.get('product.category.enabled');
  }),
  actions: {
    toggleEditable() {
      this.get('editable').toggle({ component: this, record: this.get('product') });
    },
    toggleButton(prop) {
      this.get('product').toggleProperty(prop);
    },
    changeRelation(product, event) {
      const category = this.get('store').peekRecord('category', event.target.value)
      product.set('category', category);
    },
    updateProduct(product) {
      product.save().then(() => {
        this.send('toggleEditable');
      }).catch(() => {
        console.log('Error');
      });
    },
    destroyProduct(product) {
      product.destroyRecord();
    }
  }
});
