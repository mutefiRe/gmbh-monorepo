import { expect } from 'chai';
import { describeModel, it } from 'ember-mocha';

describeModel(
  'area',
  'Unit | Model | area',
  {
    // Specify the other units that are required for this test.
      needs: ['model:table', 'model:user']
  },
  function() {
    // Replace this with your real tests.
    it('exists', function() {
      let model = this.subject();
      // var store = this.store();
      expect(model).to.be.ok;
    });
  }
);
