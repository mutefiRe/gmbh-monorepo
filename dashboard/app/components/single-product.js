import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  editable: Ember.inject.service(),
  store: Ember.inject.service(),
  i18n:          Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),
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
      const category = this.get('store').peekRecord('category', event.target.value);
      product.set('category', category);
    },
    updateProduct(product) {
      product.save().then(() => {
        this.send('toggleEditable');

        // notify user (success)
        this.get('notifications').success(this.get('i18n').t('notifications.product.update.success'));
      }).catch(() => {
        // notify user (failure)
        this.get('notifications').error(this.get('i18n').t('notifications.product.update.error'));
      });
    },
    destroyProduct(product) {
      product.destroyRecord().then(() => {
        // notify user (warning)
        this.get('notifications').warning(this.get('i18n').t('notifications.product.destroy.success'));
      }).catch(() => {
        // notify user (failure)
        this.get('notifications').error(this.get('i18n').t('notifications.product.destroy.error'));
      });
    }
  }
});
