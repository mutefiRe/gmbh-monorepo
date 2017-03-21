import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration: OrderDetailViewItemComponent', function() {
  setupComponentTest('order-detail-view-item', {
    integration: true
  });

  beforeEach(function() {
    const item = Ember.Object.create({
      countPaid: 5,
      countMarked: 2,
      count: 100
    });
    this.set('item', item);
    this.set('type', 'paid');
  });
  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#order-detail-view-item}}
    //     template content
    //   {{/order-detail-view-item}}
    // `);

    this.render(hbs`{{order-detail-view-item orderitem=item}}`);
    expect(this.$()).to.have.length(1);
  });
});
