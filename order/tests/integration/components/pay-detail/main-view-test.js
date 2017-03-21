import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | pay detail/main view', function() {
  setupComponentTest('pay-detail/main-view', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#pay-detail/main-view}}
    //     template content
    //   {{/pay-detail/main-view}}
    // `);

    this.render(hbs`{{pay-detail/main-view}}`);
    expect(this.$()).to.have.length(1);
  });
});
