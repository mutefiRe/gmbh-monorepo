import Ember from 'ember';

export default Ember.Service.extend({
  status: true,
  setStatus(status) {
    this.set('status', status);
  }
});
