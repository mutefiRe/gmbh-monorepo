import Ember from 'ember';
import getOwner from 'ember-getowner-polyfill';

export default Ember.Controller.extend({
  session: Ember.inject.service("session"),
  currentUser: Ember.computed('session.session.content', function() {
    const authenticator = getOwner(this).lookup('authenticator:jwt'),
        session = this.get('session.session.content'),
	token = session.authenticated.token;
    let tokenData = {}; 
	if(token) {
		tokenData = authenticator.getTokenData(token);
		return this.store.findRecord('user', tokenData.id);
	} else {
		return false;
	}
  }),
  actions: {
    logout() {
      this.get("session").invalidate();
    }
  }
});

