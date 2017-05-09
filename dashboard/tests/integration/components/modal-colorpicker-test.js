import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | modal colorpicker', function() {
  setupComponentTest('modal-colorpicker', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#modal-colorpicker}}
    //     template content
    //   {{/modal-colorpicker}}
    // `);

    this.render(hbs`{{modal-colorpicker}}`);
    expect(this.$()).to.have.length(1);
  });
});
