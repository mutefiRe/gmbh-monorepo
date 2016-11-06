import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  errorMessage: null,
  actions: {
    setErrorMessage(errorMessage) {
      this.set('errorMessage', errorMessage);
    }
  }
});
