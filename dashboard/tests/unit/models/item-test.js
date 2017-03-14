import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupModelTest } from 'ember-mocha';

describe('Unit | Model | item', function() {
  setupModelTest('item', {
    // Specify the other units that are required for this test.
    needs: ['model:unit', 'model:category']
  });

  // Replace this with your real tests.
  it('exists', function() {
    const model = this.subject();
    expect(model).to.be.ok;
  });
});
