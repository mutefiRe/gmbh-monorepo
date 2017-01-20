import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Unit | Transform | permissions', function() {
  setupTest('transform:permissions', {
    // Specify the other units that are required for this test.
    // needs: ['transform:foo']
  });

  // Replace this with your real tests.
  it('exists', function() {
    let transform = this.subject();
    expect(transform).to.be.ok;
  });
});
