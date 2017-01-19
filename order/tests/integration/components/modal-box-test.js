/* jshint expr:true */
import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration: ModalBoxComponent', function() {
  setupComponentTest('modal-box', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#modal-box}}
    //     template content
    //   {{/modal-box}}
    // `);

    this.render(hbs`{{modal-box}}`);
    expect(this.$()).to.have.length(1);
  });
});
