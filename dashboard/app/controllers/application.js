import Ember from 'ember';

export default Ember.Controller.extend({
  session:  Ember.inject.service(),
  router:   Ember.inject.service('-routing'),
  i18n:     Ember.inject.service(),

  headline: Ember.computed('router.currentRouteName', function() {
    const routeName   =  this.get('router.currentRouteName');
    const translation = this.get('i18n').t(`headlines.${routeName}`) || routeName;

    return translation;
  })
});
