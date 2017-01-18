/* jshint expr:true */
import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration: ErrorScreenComponent', function() {
  setupComponentTest('error-screen', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#error-screen}}
    //     template content
    //   {{/error-screen}}
    // `);

    this.render(hbs`{{error-screen}}`);
    expect(this.$()).to.have.length(1);
  });
});
