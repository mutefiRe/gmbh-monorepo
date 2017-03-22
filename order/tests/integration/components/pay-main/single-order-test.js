import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration: OrderOverviewItemComponent', function() {
  setupComponentTest('pay-main/single-order', {
    integration: true
  });

  it('renders', function() {
    this.render(hbs`{{pay-main/single-order}}`);
    expect(this.$()).to.have.length(1);
  });
});
