import Ember from 'ember';

export default Ember.Component.extend({
  notifications: Ember.inject.service('notification-messages'),
  i18n: Ember.inject.service(),
  tagName: 'li',
  classNameBindings: ['isOpen:open'],
  isOpen: false,
  actions: {
    toggleEditable() {
      this.toggleProperty('isOpen');
    },
    updateArea(area) {
      area.save().then(() => {
        this.send('toggleEditable');

        // notify user (success)
        this.get('notifications').success(this.get('i18n').t('notifications.area.update.success'));
      }).catch(() => {
        // notify user (failure)
        this.get('notifications').error(this.get('i18n').t('notifications.area.update.error'));
      });
    },
    destroyArea(area) {
      area.destroyRecord().then(() => {
        // notify user (warning)
        this.get('notifications').warning(this.get('i18n').t('notifications.area.destroy.success'));
      }).catch(() => {
        // notify user (failure)
        this.get('notifications').error(this.get('i18n').t('notifications.area.destroy.error'));
      });
    }
  }
});
