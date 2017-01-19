/* jshint expr:true */
import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration: ItemListComponent', function() {
  setupComponentTest('item-list', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#single-category}}
    //     template content
    //   {{/single-category}}
    // `);

    this.render(hbs`{{item-list}}`);
    expect(this.$()).to.have.length(1);
  });
});
