import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration: ItemSettingsComponent', function() {
  setupComponentTest('item-settings', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#item-settings}}
    //     template content
    //   {{/item-settings}}
    // `);

    this.render(hbs`{{item-settings}}`);
    expect(this.$()).to.have.length(1);
  });
});
