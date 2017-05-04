import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | main-navigation', function() {
  setupComponentTest('main-navigation', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{main-navigation}}
    //     template content
    //   {{/main-navigation}}
    // `);

    this.render(hbs`{{main-navigation}}`);
    expect(this.$()).to.have.length(1);
  });
});
