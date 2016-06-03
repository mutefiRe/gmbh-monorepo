import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['table-select'],
  actions: {
    setTable(table) {
      this.set('order.table', table);
      this.get('showModal')('table-select');
    }
  }
});
