import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  sortedTables: Ember.computed.sort('tables', naturalStringCompare),
  actions: {
    setTable(table) {
      this.get('setTable')(table);
    }
  }
});

function naturalStringCompare(a, b){
  const rx = /\d+|\D+/g;
  // Phrase is eiter a combination of letters or numbers
  const aPhrases = a.get('name').toString().match(rx);
  const bPhrases = b.get('name').toString().match(rx);

  // If String is the same, fall back to id
  if (aPhrases === bPhrases) {
    if (a.get('id') < b.get('id')) return 1;
    return - 1;
  }

  // Go through Prases: e.g. Terasse20 => Phrase 1: Terasse, Phrase 2: 20
  for (let i = 0; i < aPhrases.length && i < bPhrases.length; i++)
  {
    if (aPhrases[i] === bPhrases[i]) continue;
    if (tryParseCompare(aPhrases[i], bPhrases[i])) return 1;
    return - 1;
  }
}

function tryParseCompare(a, b) {
  if (isNaN(a) || isNaN(b)) return a > b;
  return parseInt(a) > parseInt(b);
}
