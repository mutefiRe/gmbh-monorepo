import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service(),

  actions: {
    authenticate: function() {
      var credentials = this.getProperties('identification', 'password'),
        authenticator = 'authenticator:jwt';

      this.get('session').authenticate(authenticator, credentials)
      .then(()=>{
        console.log('foo')
      })
      .catch(reason=> {
        if (reason) {
          this.set('errorMessage', reason.error || reason);
        } else {
          this.set('errorMessage', 'Server nicht erreichbar.');
        }
      });;
    }
  }
});
