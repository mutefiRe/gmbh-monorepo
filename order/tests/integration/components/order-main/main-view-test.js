import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration: OrderMainComponent', function() {
  setupComponentTest('order-main/main-view', {
    integration: true
  });

  it('renders', function() {
    this.render(hbs`{{order-main/main-view}}`);
    expect(this.$()).to.have.length(1);
  });
});
