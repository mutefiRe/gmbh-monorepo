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
      const currentRecord = this.get('currentSelectedRecord');
      currentRecord.record.save().then(() => {
        this.set('isOpen', false);
        this.get('notifications').success(this.get('i18n').t('notifications.record.save.success'));
      }).catch(() => {
        this.get('notifications').error(this.get('i18n').t('notifications.record.save.error'));
      });
    },
    saveNewRecord() {
      const newRecord = this.get('newRecord');
      newRecord.record.save().then(() => {
        newRecord.component.get('close')();
        this.get('notifications').success(this.get('i18n').t('notifications.record.save.success'));
      }).catch(() => {
        this.get('notifications').error(this.get('i18n').t('notifications.record.save.error'));
      });
    }
  }
});
