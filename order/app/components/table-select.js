import Ember from 'ember';

function tryParse(input) {
  if (isNaN(input)) return input;

  return parseInt(input);
}

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
    console.log(table.get('area.id'))
    return table.get('custom') == false && !table.get('area.id');
  }).property('tables'),
  customTables: Ember.computed.filter('tables', function(table){
    return table.get('custom') == true;
  }).property('tables.@each.custom'),
  filter: '',
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

/*
function sortFunction(a, b){
  const userAreas = this.get('currentUser').get('areas').toArray().map((x)=> x.id);
  const rx = /\d+|\D+/g;
  const aMatches = a.get('name').toString().match(rx);
  const bMatches = b.get('name').toString().match(rx);

  if (userAreas.indexOf(a.get('area').get('id').toString()) != -1){
    if (a.get('area').get('name') > b.get('area').get('name')) return 1;
    else if (a.get('area').get('name') == b.get('area').get('name')){
      if (aMatches == bMatches) return 0;
      for (let i = 0; i < aMatches.length && i < bMatches.length; i++)
      {
        if (aMatches[i] == bMatches[i]) continue;
        if (tryParse(aMatches[i]) > tryParse(bMatches[i])) return 1;
        return -1;
      }
    } else return -1;
  }
  if (a.get('area').get('name') > b.get('area').get('name')) return 1
  else if (a.get('area').get('name') == b.get('area').get('name')){
    if (aMatches == bMatches) return 0
    for (let i = 0; i < aMatches.length && i < bMatches.length; i++)
    {
      if (aMatches[i] == bMatches[i])
      {
        continue;
      }
      if (tryParse(aMatches[i]) > tryParse(bMatches[i])) return 1
      return -1;
    }
  } else return -1;
  return -1;
}
*/