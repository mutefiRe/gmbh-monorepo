import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',
  actions: {
    toggleUpdate(user = null) {
      this.toggleProperty('isShowingUpdate');
      if (user !== null) {
        // console.log('user: ', user.get('username'));
        user.save();
      }
    },
    destroyUser(user = null) {
      this.get('destroyUser')(user);
    }
  }
});
