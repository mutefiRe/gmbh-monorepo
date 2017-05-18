import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  todaysDate: new Date(),
  init: function() {
    var singleEvent = this.events.get('firstObject');
    this.set('event', singleEvent);
    this._super();
  },
  actions: {
    toggleButton(prop, value) {
      const result = !value;
      Ember.set(this.event, prop, result);
    }
  }
});
