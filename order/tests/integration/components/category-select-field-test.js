/* jshint expr:true */
import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration: CategorySelectFieldComponent', function() {
  setupComponentTest('category-select-field', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#item-container}}
    //     template content
    //   {{/item-container}}
    // `);

    this.render(hbs`{{category-select-field}}`);
    expect(this.$()).to.have.length(1);
  });
});
