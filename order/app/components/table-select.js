import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service('store'),
  classNames: ['table-select'],
  showTables: true,
  showGuests: false,
  showNew: false,
  userAreas: Ember.computed.filter('areas', function(area){
    return area.get('user.id') == this.get('currentUser').id
  }).property('areas'),
  otherAreas: Ember.computed.filter('areas', function(area){
    return area.get('user.id') != this.get('currentUser').id
  }).property('areas'),
  unassignedTables: Ember.computed.filter('tables', function(table){
    return table.get('custom') == false && !table.get('area.id');
  }).property('tables'),
  customTables: Ember.computed.filter('tables', function(table){
    return table.get('custom') == true;
  }).property('tables.@each.custom'),
  actions: {
    setTable(table) {
      this.set('order.table', table);
      this.get('showModal')('table-select');
    },
    changeTab(tab) {
      switch(tab) {
        case "tables":
          this.set('showTables', true);
          this.set('showGuests', false);
          this.set('showNew',    false);
          break;
        case "guests":
          this.set('showTables', false);
          this.set('showGuests', true);
          this.set('showNew',    false);
          break;
        case "new":
          this.set('showTables', false);
          this.set('showGuests', false);
          this.set('showNew',    true);
          break;
      }
    },
    createTable(){
      this.get('store').createRecord('table', {name: this.get('name'), custom: true }).save();
      this.set('showTables', false);
      this.set('showGuests', true);
      this.set('showNew',    false);
    }
  }
});