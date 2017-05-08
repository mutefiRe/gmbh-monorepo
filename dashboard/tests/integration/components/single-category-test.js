import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | single category', function() {
  setupComponentTest('single-category', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#gmbh-single-category}}
    //     template content
    //   {{/gmbh-single-category}}
    // `);

    this.render(hbs `{{single-category}}`);
    expect(this.$()).to.have.length(1);
  });
});
