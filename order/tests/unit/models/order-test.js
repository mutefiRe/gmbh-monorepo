import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupModelTest } from 'ember-mocha';

describe('Unit | Model | order', function() {
  setupModelTest('order', {
    // Specify the other units that are required for this test.
      needs: ['model:user', 'model:table', 'model:orderitem']
  });

  // Replace this with your real tests.
  it('exists', function() {
    let model = this.subject();
    // var store = this.store();
    expect(model).to.be.ok;
  });
});
