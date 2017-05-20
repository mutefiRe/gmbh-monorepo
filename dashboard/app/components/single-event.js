import Ember from 'ember';

export default Ember.Component.extend({
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
      const result = !value;
      Ember.set(this.event, prop, result);
    },
    updateEvent(event) {
      event.save();
    }
  }
});
