import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | pay main/single table', function() {
  setupComponentTest('pay-main/single-table', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#pay-main/single-table}}
    //     template content
    //   {{/pay-main/single-table}}
    // `);

    this.render(hbs`{{pay-main/single-table}}`);
    expect(this.$()).to.have.length(1);
  });
});
