import { expect } from 'chai';
import { describeModule, it } from 'ember-mocha';
//import { currentSession } from 'admin/tests/helpers/ember-simple-auth';

describeModule('controller:login', 'Unit | Controller | login',
  {
    // Specify the other units that are required for this test.
    // needs: ['controller:login']
  },
  function() {
    // Replace this with your real tests.
    it('has no error message @ init', function() {
      let controller = this.subject();
      expect(controller.get('errorMessage')).to.equal(undefined);
    });
  }
);
