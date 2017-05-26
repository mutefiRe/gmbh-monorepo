import Ember from 'ember';

export default Ember.Component.extend({
  notifications: Ember.inject.service('notification-messages'),
  editable:      Ember.inject.service(),
  i18n:          Ember.inject.service(),
  tagName:       'li',
  actions: {
    updateUser(user) {
      user.save().then(() => {
        this.send('toggleEditable');

        // notify user (success)
        this.get('notifications').success(this.get('i18n').t('notifications.user.update.success'));
      }).catch(() => {
        // notify user (failure)
        this.get('notifications').error(this.get('i18n').t('notifications.user.update.error'));
      });
    },
    toggleEditable() {
      this.get('editable').toggle({ component: this, record: this.get('user') });
    }
  }
});
