import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe.skip('Integration: OrderListComponent', function () {
  setupComponentTest('order-detail/main-view', {
    integration: true
  });

  it('renders', function () {
    this.render(hbs`{{order-detail/main-view}}`);
    expect(this.$()).to.have.length(1);
  });
});
