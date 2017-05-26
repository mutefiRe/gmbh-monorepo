import Ember from 'ember';

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  router: Ember.inject.service('-routing'),
  session: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),

  headline: Ember.computed('router.currentRouteName', function() {
    const routeName = this.get('router.currentRouteName');
    const translation = this.get('i18n').t(`headlines.${routeName}`) || routeName;

    return translation;
  }),
  isIndex: Ember.computed('router.currentRouteName', function() {
    const routeName = this.get('router.currentRouteName');
    return routeName === 'index';
  }),
  init() {
    // notification message global config
    this.get('notifications').clearAll();
    this.get('notifications').setDefaultClearDuration(2000);
    this.get('notifications').setDefaultAutoClear(true);
  }
});
