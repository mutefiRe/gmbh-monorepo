import Ember from 'ember';

export default Ember.Component.extend({
  notifications: Ember.inject.service('notification-messages'),
  i18n: Ember.inject.service(),
  tagName: 'div',
  classNames: ['addentrybar'],
  actions: {
    saveRecord() {
      this.get('record').save().then(() => {
        this.set('toggleable', false);
        this.get('notifications').success(this.get('i18n').t('notifications.record.save.success'));
      }).catch(() => {
        this.get('notifications').error(this.get('i18n').t('notifications.record.save.error'));
      });
    }
  }

});
