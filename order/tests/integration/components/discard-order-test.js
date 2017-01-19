/* jshint expr:true */
import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration: DiscardOrderComponent', function() {
  setupComponentTest('discard-order', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#discard-order}}
    //     template content
    //   {{/discard-order}}
    // `);

    this.render(hbs`{{discard-order}}`);
    expect(this.$()).to.have.length(1);
  });
});
