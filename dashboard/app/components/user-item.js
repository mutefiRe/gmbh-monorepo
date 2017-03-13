import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    selectPrinter(printerId){
      const printer = !printerId ? null : this.get('printers').store.peekRecord("printer", printerId);
      this.set('user.printer', printer);
    }
  }
});
