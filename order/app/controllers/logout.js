import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),

  init() {
    if(!this.get('session.isAuthenticated')){
      this.send('transitionToLogin');
    }
  },
  actions: {
    logout() {
      this.get('session')
        .invalidate()
        .then(() => {
          this.get('notifications').info(this.get('i18n').t('notification.logout.success'), { autoClear: true });
          this.send('transitionToLogin');
        });
    }
  }
});
