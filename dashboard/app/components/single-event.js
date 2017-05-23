import Ember from 'ember';

export default Ember.Component.extend({
  enable: Ember.inject.service(),
  tagName: 'li',
  todaysDate: new Date(),
  init: function() {
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
    toggleButton(prop, value) {
      this.get('enable').toggleBtn(this.event, prop, value);
    },
    updateEvent(event) {
      event.save();
    }
  }
});
