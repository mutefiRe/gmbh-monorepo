import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  todaysDate: new Date(),
  notifications: Ember.inject.service('notification-messages'),
  i18n:          Ember.inject.service(),
  init() {
    const singleEvent = this.get('events.firstObject');
    if (singleEvent === undefined) {
      this.set('event', {
        name: 'Neues Event',
        beginDate: this.todaysDate,
        endDate: this.todaysDate,
        expiresTime: 72,
        eventName: 'Neues Event'
      });
    } else {
      this.set('event', singleEvent);
    }
    this._super();
  },
  actions: {
    toggleButton(prop) {
      this.get('event').toggleProperty(prop);
    },
    updateEvent(event) {
      event.save().then(() => {
        // notify user (success)
        this.get('notifications').success(this.get('i18n').t('notifications.event.update.success'));
      }).catch(() => {
        // notify user (failure)
        this.get('notifications').error(this.get('i18n').t('notifications.event.update.error'));
      });
    }
  }
});
