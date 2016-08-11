import Ember from 'ember';

function tryParse(input) {
  if (isNaN(input)) return input;

  return parseInt(input);
}

export default Ember.Component.extend({
  classNames: ['table-select'],
  sortedTables: Ember.computed.sort('tables', function(a, b) {
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
  }),
  filter: '',
  actions: {
    setTable(table) {
      this.set('order.table', table);
      this.get('showModal')('table-select');
    }
  }
});

