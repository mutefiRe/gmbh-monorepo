import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration: CategoryMainContainerComponent', function () {
  setupComponentTest('order-main/category/main-container', {
    integration: true
  });

  it('renders', function () {
    this.render(hbs`{{order-main/category/main-container}}`);
    expect(this.$()).to.have.length(1);
  });
});
