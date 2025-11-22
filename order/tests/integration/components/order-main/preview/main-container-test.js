import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration: PreviewComponent', function() {
  setupComponentTest('order-main/preview/main-container', {
    integration: true
  });

  it('renders', function() {
    this.render(hbs`{{order-main/preview/main-container}}`);
    expect(this.$()).to.have.length(1);
  });
});
