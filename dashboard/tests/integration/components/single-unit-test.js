import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | single unit', function() {
  setupComponentTest('single-unit', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#single-unit}}
    //     template content
    //   {{/single-unit}}
    // `);

    this.render(hbs`{{single-unit}}`);
    expect(this.$()).to.have.length(1);
  });
});
