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
        if (this.get('currentSelectedRecord.type') === 'component') {
          this.set('currentSelectedRecord.component.isOpen', false);
        } else {
          this.set('currentSelectedRecord.component.newRecord', null);
        }
        Ember.$('body').removeClass('noscroll');
        this.get('notifications').success(this.get('i18n').t('notifications.record.save.success'));
      }).catch(() => {
        this.get('notifications').error(this.get('i18n').t('notifications.record.save.error'));
      });
    },
    cancel(){
      if (this.get('isNew')) {
        this.get('currentSelectedRecord.component.newRecord').deleteRecord();
        this.set('currentSelectedRecord.component.newRecord', null);
      }
      this.set('currentSelectedRecord.component.isOpen', false);
      Ember.$('body').removeClass('noscroll');
    }
  }
});
