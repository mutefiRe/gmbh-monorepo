import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | single event', function() {
  setupComponentTest('single-event', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#single-event}}
    //     template content
    //   {{/single-event}}
    // `);

    this.render(hbs`{{single-event}}`);
    expect(this.$()).to.have.length(1);
  });
});
