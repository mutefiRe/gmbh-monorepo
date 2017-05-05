import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | gmbh single product', function() {
  setupComponentTest('gmbh-single-product', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#gmbh-single-product}}
    //     template content
    //   {{/gmbh-single-product}}
    // `);

    this.render(hbs`{{gmbh-single-product}}`);
    expect(this.$()).to.have.length(1);
  });
});
