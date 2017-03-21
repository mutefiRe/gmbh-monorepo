import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration: OrderlistItemComponent', function() {
  setupComponentTest('orderlist-item', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#orderlist-item}}
    //     template content
    //   {{/orderlist-item}}
    // `);

    this.render(hbs`{{orderlist-item}}`);
    expect(this.$()).to.have.length(1);
  });
});
