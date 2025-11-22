import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration: OrderDetailViewItemComponent', function() {
  setupComponentTest('pay-detail/single-item', {
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
    this.render(hbs`{{pay-detail/single-item orderitem=item}}`);
    expect(this.$()).to.have.length(1);
  });
});
