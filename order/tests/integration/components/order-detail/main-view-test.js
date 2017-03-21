import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration: OrderListComponent', function() {
  setupComponentTest('order-list', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#order-list}}
    //     template content
    //   {{/order-list}}
    // `);

    this.render(hbs`{{order-list}}`);
    expect(this.$()).to.have.length(1);
  });
});
