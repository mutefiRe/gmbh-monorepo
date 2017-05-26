import Ember from 'ember';

export default Ember.Component.extend({
  notifications: Ember.inject.service('notification-messages'),
  i18n: Ember.inject.service(),
  tagName: 'div',
  classNames: ['addentrybar'],
  actions: {
    createRecord() {
      this.get('setRecord')();
    },
    saveRecord() {
      this.get('currentSelectedRecord.record').save().then(() => {
        this.set('currentSelectedRecord.component.isOpen', false);
        this.get('notifications').success(this.get('i18n').t('notifications.record.save.success'));
      }).catch(() => {
        this.get('notifications').error(this.get('i18n').t('notifications.record.save.error'));
      });
    }
  }
});
