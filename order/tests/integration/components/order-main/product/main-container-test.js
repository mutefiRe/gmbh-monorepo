import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration: ProductComponent', function() {
  setupComponentTest('order-main/product/main-container', {
    integration: true
  });

  it('renders', function() {
    this.render(hbs`{{order-main/product/main-container}}`);
    expect(this.$()).to.have.length(1);
  });
});
