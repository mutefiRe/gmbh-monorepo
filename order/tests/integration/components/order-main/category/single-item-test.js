import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration: CategorySingleItemComponent', function() {
  setupComponentTest('order-main/category/single-item', {
    integration: true
  });

  it('renders', function() {
    this.render(hbs`{{order-main/category/single-item}}`);
    expect(this.$()).to.have.length(1);
  });
});
