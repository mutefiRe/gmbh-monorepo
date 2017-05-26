import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export default Ember.Component.extend({
  store: Ember.inject.service('store'),
  connection: Ember.inject.service('connection'),
  i18n: Ember.inject.service('i18n'),
  notifications: Ember.inject.service('notification-messages'),
  tableStorage: storageFor('table'),
  modal: Ember.inject.service(),
  classNames: ['table-select'],
  activeTab: 'tables',
  userAreas: Ember.computed.filter('areas', function(area){
    return area.get('user.id') === this.get('currentUser').id && area.get('enabled');
  }).property('areas.@each.enabled'),
  otherAreas: Ember.computed.filter('areas', function(area){
    return area.get('user.id') !== this.get('currentUser').id && area.get('enabled');
  }).property('areas.@each.enabled'),
  unassignedTables: Ember.computed.filter('tables', function(table){
    return table.get('custom') === false && !table.get('area.id');
  }).property('tables.@each.enabled'),
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
      this.set('activeTab', 'tables');
    }
  },
  saveTableAPI(table){
    table.save().then(persistedTable => this.send('setTable', persistedTable));
    this.get('notifications').success(this.get('i18n').t('notification.table.success'), {autoClear: true});
  },
  saveTableOffline(table){
    const serializedTable = table.serialize();
    serializedTable.id = table.id;
    this.get('tableStorage').addObject(serializedTable);
    this.send('setTable', table);
    this.get('notifications').success(this.get('i18n').t('notification.table.offline'), {autoClear: true});
  }
});

function filterCustomTable(orderitem){
  return !orderitem.get('count') === 0 || orderitem.get('count') !== orderitem.get('countPaid');
}
