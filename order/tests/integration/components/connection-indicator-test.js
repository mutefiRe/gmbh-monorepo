import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | connection indicator', function() {
  setupComponentTest('connection-indicator', {
    integration: true
  });

  it('renders', function() {
    this.render(hbs`{{connection-indicator}}`);
    expect(this.$()).to.have.length(1);
  });
});
