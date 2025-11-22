import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupModelTest } from 'ember-mocha';

describe('Unit | Model | user', function () {
  setupModelTest('user', {
    // Specify the other units that are required for this test.
    needs: ['model:area', 'model:printer']
  });

  // Replace this with your real tests.
  it('exists', function () {
    const model = this.subject();
    expect(model).to.be.ok;
  });
});
