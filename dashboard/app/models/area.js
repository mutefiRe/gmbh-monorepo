import DS from 'ember-data';

export default DS.Model.extend({
  name:      DS.attr('string'),
  updatedAt: DS.attr('date'),
  createdAt: DS.attr('date'),
  tables:    DS.hasMany('table'),
  users:     DS.hasMany('user'),
  short:     DS.attr('string'),
  sortDefinition: ['name'],
  sortedTables: Ember.computed.sort('tables', naturalStringCompare).property('tables.@each.name'),
  persistedTables: Ember.computed.filter('sortedTables', table => table.createdAt).property('tables.@each.createdAt')
});

function naturalStringCompare(a, b){
  const rx = /\d+|\D+/g;
  if (!a.get('name') || !b.get('name')) return - 1;
  // Phrase is eiter a combination of letters or numbers
  const aPhrases = a.get('name').toString().match(rx);
  const bPhrases = b.get('name').toString().match(rx);

  // If String is the same, fall back to id
  if (aPhrases === bPhrases) {
    if (a.get('id') < b.get('id')) return 1;
    return - 1;
  }


  // Go through Phrases: e.g. Terasse20 => Phrase 1: Terasse, Phrase 2: 20
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
