/* jshint expr:true */
import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration: OrderOverviewItemComponent', function() {
  setupComponentTest('order-overview-item', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#order-overview-item}}
    //     template content
    //   {{/order-overview-item}}
    // `);

    this.render(hbs`{{order-overview-item}}`);
    expect(this.$()).to.have.length(1);
  });
});
