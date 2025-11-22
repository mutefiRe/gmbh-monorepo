import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | pay main/single table', function() {
  setupComponentTest('pay-main/single-table', {
    integration: true
  });

  it('renders', function() {
    this.render(hbs`{{pay-main/single-table}}`);
    expect(this.$()).to.have.length(1);
  });
});
