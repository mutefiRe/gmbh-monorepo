import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    discardOrder() {
      this.get('discardOrder')();
      this.triggerAction({
        action: 'close',
        target: this
      });
    },
    close() {
      this.get('showModal')('table-select');
    }
  }
});
