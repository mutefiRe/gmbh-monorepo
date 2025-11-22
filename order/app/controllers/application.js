import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  currentUser: Ember.computed('session.session.content', function () {
    const authenticator = Ember.getOwner(this).lookup('authenticator:jwt');
    const session = this.get('session.session.content');

    if (session && session.authenticated.token) {
      const tokenData = authenticator.getTokenData(session.authenticated.token);

      if (tokenData.id) {
        return this.store.findRecord('user', tokenData.id);
      }
    }

    return false;
  })
});

