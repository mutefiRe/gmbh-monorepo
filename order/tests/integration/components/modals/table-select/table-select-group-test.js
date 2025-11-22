import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | table select group', function() {
  setupComponentTest('table-select-group', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#table-select-group}}
    //     template content
    //   {{/table-select-group}}
    // `);

    this.render(hbs`{{table-select-group}}`);
    expect(this.$()).to.have.length(1);
  });
});
