/* jshint expr:true */
import { expect } from 'chai';
import { describeModel, it } from 'ember-mocha';

describeModel(
  'item',
  'Unit | Model | item',
  {
    // Specify the other units that are required for this test.
      needs: ['model:unit', 'model:category']
  },
  function() {
    // Replace this with your real tests.
    it('exists', function() {
      let model = this.subject();
      expect(model).to.be.ok;
    });
  }
);
