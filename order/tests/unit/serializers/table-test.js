import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupModelTest } from 'ember-mocha';

describe('Unit | Serializer | table', function() {
  setupModelTest('table', {
    // Specify the other units that are required for this test.
    needs: ['model:area', 'model:table', 'model:order']
  });

  // Replace this with your real tests.
  it('serializes records', function() {
    const record = this.subject();

    const serializedRecord = record.serialize();

    expect(serializedRecord).to.be.ok;
  });
});
