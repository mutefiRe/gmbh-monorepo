import {expect} from 'chai';
import {describeModule, it} from 'ember-mocha';
import {authenticateSession} from 'gmbh/tests/helpers/ember-simple-auth';

describeModule(
  'controller:application',
  'ApplicationController',
  {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
    //  needs: ['application']
  },
  function () {
    it('exists', function () {
      let controller = this.subject();
      expect(controller).to.be.ok;
    });

    it('no session is set', function () {
      let controller = this.subject();
      expect(controller.get('currentUser')).to.be.false;
    });
  }
);
