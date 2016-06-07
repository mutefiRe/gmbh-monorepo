import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    resetOrder() {
      this.get('resetOrder')();
      this.triggerAction({
        action: 'close',
        target: this
      });
      this.get('swipeOrderList')();
    },
    close() {
      this.get('showModal')('table-select');
    }
  }
});
