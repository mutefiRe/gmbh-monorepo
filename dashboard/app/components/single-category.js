import Ember from 'ember';

export default Ember.Component.extend(Ember.Evented, {
  notifications: Ember.inject.service('notification-messages'),
  i18n: Ember.inject.service(),
  isShowingIcons: false,
  isShowingColors: false,
  tagName: 'li',
  classNameBindings: ['isOpen:open'],
  isOpen: false,
  actions: {
    toggleEditable() {
      this.toggleProperty('isOpen');
      if (this.get('isOpen')) {
        Ember.$('body').addClass('noscroll');
        this.set('currentSelectedCategory', {
          component: this,
          record: this.get('category'),
          type: 'component'
        });
      } else {
        Ember.$('body').removeClass('noscroll');
        this.set('currentSelectedCategory', null);
      }
    },
    updateCategory(category) {
      category.save().then(() => {
        this.send('toggleEditable');
        this.get('notifications').success(this.get('i18n').t('notifications.category.update.success'));
      }).catch(() => {
        this.get('notifications').error(this.get('i18n').t('notifications.category.update.error'));
      });
    },
    destroyCategory(category) {
      category.destroyRecord().then(() => {
        this.get('notifications').warning(this.get('i18n').t('notifications.category.destroy.success'));
      }).catch(() => {
        this.get('notifications').error(this.get('i18n').t('notifications.category.destroy.error'));
      });
    }
  }
});
