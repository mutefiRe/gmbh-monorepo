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
    },
    updateCategory(category) {
      category.save().then(() => {
        this.send('toggleEditable');

        // notify user (success)
        this.get('notifications').success(this.get('i18n').t('notifications.category.update.success'));
      }).catch(() => {
        // notify user (failure)
        this.get('notifications').error(this.get('i18n').t('notifications.category.update.error'));
      });
    },
    destroyCategory(category) {
      category.destroyRecord().then(() => {
        // notify user (warning)
        this.get('notifications').warning(this.get('i18n').t('notifications.category.destroy.success'));
      }).catch(() => {
        // notify user (failure)
        this.get('notifications').error(this.get('i18n').t('notifications.category.destroy.error'));
      });
    }
  }
});
