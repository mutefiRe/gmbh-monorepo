import Ember from 'ember';

export default Ember.Service.extend({
  session: Ember.inject.service(),
  getId(){
    const authenticator = Ember.getOwner(this).lookup('authenticator:jwt');
    const authenticated = this.get('session.isAuthenticated');
    if (authenticated) {
      const token = this.get('session.session.content.authenticated.token');
      const tokenData = authenticator.getTokenData(token);

      return tokenData.id;
    }
  },
  getRole() {
    const authenticator = Ember.getOwner(this).lookup('authenticator:jwt');
    const token = this.get('session.session.content.authenticated.token');
    const tokenData = authenticator.getTokenData(token);
    return tokenData.role;
  },
  getToken() {
    return this.get('session.session.content.authenticated.token');
  }
});
