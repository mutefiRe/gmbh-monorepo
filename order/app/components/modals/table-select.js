import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export default Ember.Component.extend({
  store: Ember.inject.service('store'),
  connection: Ember.inject.service('connection'),
  tableStorage: storageFor('table'),
  modal: Ember.inject.service(),
  classNames: ['table-select'],
  activeTab: 'tables',
  userAreas: Ember.computed.filter('areas', function(area){
    return area.get('user.id') === this.get('currentUser').id;
  }).property('areas'),
  otherAreas: Ember.computed.filter('areas', function(area){
    return area.get('user.id') !== this.get('currentUser').id;
  }).property('areas'),
  unassignedTables: Ember.computed.filter('tables', function(table){
    return table.get('custom') === false && !table.get('area.id');
  }).property('tables'),
  customTables: Ember.computed.filter('tables', function(table){
    return !table.get('custom') ? false : table.get('orderitems').every(filterCustomTable);
  }).property('tables.@each.custom', 'tables.@each.order'),
  actions: {
    setTable(table) {
      this.set('order.table', table);
      this.get('modal').closeModal();
    },
    changeTab(tab) {
      this.set('activeTab', tab);
    },
    createTable(){
      const table = this.get('store').createRecord('table', { name: this.get('name'), custom: true });
      this.get('connection.status') ? this.saveTableAPI(table) : this.saveTableOffline(table);
      this.set('name', "");
      this.set('tab', 'tables');
    }
  },
  saveTableAPI(table){
    table.save().then(persistedTable => this.send('setTable', persistedTable));
  },
  saveTableOffline(table){
    const serializedTable = table.serialize();
    serializedTable.id = table.id;
    this.get('tableStorage').addObject(serializedTable);
    this.send('setTable', table);
  }
});

function filterCustomTable(orderitem){
  return !orderitem.get('count') === 0 || orderitem.get('count') !== orderitem.get('countPaid');
}
