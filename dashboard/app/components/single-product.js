import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  store: Ember.inject.service(),
  i18n:          Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),
  isEnabled: Ember.computed('product.enabled', 'product.category.enabled', function() {
    return this.get('product.enabled') && this.get('product.category.enabled');
  }),
  classNameBindings: ['isOpen:open'],
  isOpen: false,
  isNew: false,
  init(){
    this._super(...arguments);
    if (Ember.get(this, 'isNew')) {
      this.set('isOpen', true);
      Ember.$('body').addClass('noscroll');
      this.set('currentSelectedRecord', {
        component: this,
        record: this.get('product'),
        type: 'component'
      });
      this.set('product.category', this.get('categories.firstObject'));
    }
  },
  actions: {
    toggleEditable() {
      this.toggleProperty('isOpen');
      if (this.get('isOpen')) {
        Ember.$('body').addClass('noscroll');
        this.set('currentSelectedRecord', {
          component: this,
          record: this.get('product'),
          type: 'component'
        });
      } else {
        Ember.$('body').removeClass('noscroll');
        this.set('currentSelectedRecord', null);
        if (this.get('isNew')) {
          if (this.get('product.hasDirtyAttributes')) this.get('product').deleteRecord();
          this.set('product', null);
        }
      }
    },
    toggleButton(prop) {
      this.get('product').toggleProperty(prop);
    },
    changeRelation(type, event) {
      const relation = this.get('store').peekRecord(type, event.target.value);
      this.get('product').set(type, relation);
      if (!this.get('isNew')) {
        Ember.run.next(this, () => {
          Ember.$('html, body').animate({
            scrollTop: this.$().offset().top
          }, 200);
        });
      }
    },
    updateProduct() {
      this.get('product').save().then(() => {
        this.send('toggleEditable');
        this.get('notifications').success(this.get('i18n').t('notifications.product.update.success'));
        Ember.$('body').removeClass('noscroll');
      }).catch(() => {
        this.get('notifications').error(this.get('i18n').t('notifications.product.update.error'));
      });
    },
    destroyProduct() {
      this.get('product').destroyRecord().then(() => {
        this.get('notifications').warning(this.get('i18n').t('notifications.product.destroy.success'));
        Ember.$('body').removeClass('noscroll');
      }).catch(() => {
        this.get('notifications').error(this.get('i18n').t('notifications.product.destroy.error'));
      });
    }
  }
});
