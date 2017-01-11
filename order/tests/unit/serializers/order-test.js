import { expect } from 'chai';
import { describeModel, it } from 'ember-mocha';

describeModel(
  'order',
  'Unit | Serializer | order',
  {
    // Specify the other units that are required for this test.
    needs: ['model:user', 'model:table', 'model:orderitem']
  },
  function() {
    // Replace this with your real tests.
    it('serializes records', function() {
      let record = this.subject();

      let serializedRecord = record.serialize();

      expect(serializedRecord).to.be.ok;
    });
  }
);
