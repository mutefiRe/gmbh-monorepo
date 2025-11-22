import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | pay detail/main view', function() {
  setupComponentTest('pay-detail/main-view', {
    integration: true
  });

  it('renders', function() {
    this.render(hbs`{{pay-detail/main-view}}`);
    expect(this.$()).to.have.length(1);
  });
});
