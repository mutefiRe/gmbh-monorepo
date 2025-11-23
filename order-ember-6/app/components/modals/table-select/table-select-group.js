import Component from '@glimmer/component';
import { action } from '@ember/object';

function naturalStringCompare(a, b) {
  const rx = /\d+|\D+/g;
  const aPhrases = a.name?.toString().match(rx);
  const bPhrases = b.name?.toString().match(rx);

  if (aPhrases === bPhrases) {
    return a.id < b.id ? 1 : -1;
  }

  for (let i = 0; i < aPhrases.length && i < bPhrases.length; i++) {
    if (aPhrases[i] === bPhrases[i]) continue;
    if (tryParseCompare(aPhrases[i], bPhrases[i])) return 1;
    return -1;
  }
}

function tryParseCompare(a, b) {
  if (isNaN(a) || isNaN(b)) return a > b;
  return parseInt(a) > parseInt(b);
}

export default class ModalsTableSelectTableSelectGroupComponent extends Component {
  get enabledTables() {
    return (this.args.tables || []).filter(table => table.enabled);
  }

  get sortedTables() {
    return this.enabledTables.sort(naturalStringCompare);
  }

  @action
  setTable(table) {
    this.args.setTable?.(table);
  }
}
