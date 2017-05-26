import Ember from 'ember';

export default Ember.Component.extend({
  notifications: Ember.inject.service('notification-messages'),
  store: Ember.inject.service(),
  i18n: Ember.inject.service(),
  classNameBindings: ['isOpen:open'],
  isOpen: false,
  tagName: 'li',
  init() {
    this._super();
    const category = this.get('store').peekRecord('category', this.get('product.category.id'));
    this.get('product').set('category', category);
  },
  actions: {
    toggleEditable() {
      this.toggleProperty('isOpen');
      if (this.get('isOpen')) {
        Ember.$('body').addClass('noscroll');
        this.set('currentSelectedProduct', { toggleable: this.get('isOpen'), record: this.get('product') });
      } else {
        Ember.$('body').removeClass('noscroll');
        this.set('currentSelectedProduct', null);
      }
    },
    changeRelation(product, event) {
      const category = this.get('store').peekRecord('category', event.target.value);
      product.set('category', category);
    },
    updateProduct(product) {
      product.save().then(() => {
        this.send('toggleEditable');
        this.get('notifications').success(this.get('i18n').t('notifications.product.update.success'));
      }).catch(() => {
        this.get('notifications').error(this.get('i18n').t('notifications.product.update.error'));
      });
    },
    destroyProduct(product) {
      product.destroyRecord().then(() => {
        this.get('notifications').warning(this.get('i18n').t('notifications.product.destroy.success'));
      }).catch(() => {
        this.get('notifications').error(this.get('i18n').t('notifications.product.destroy.error'));
      });
    }
  }
});
