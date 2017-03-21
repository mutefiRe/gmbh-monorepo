import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration: ShowLoadingModalComponent', function() {
  setupComponentTest('loading-box', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#show-loading-modal}}
    //     template content
    //   {{/show-loading-modal}}
    // `);

    this.render(hbs`{{loading-box}}`);
    expect(this.$()).to.have.length(1);
  });
});
