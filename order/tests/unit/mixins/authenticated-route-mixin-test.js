/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import Ember from 'ember';
import AuthenticatedRouteMixinMixin from 'gmbh/mixins/authenticated-route-mixin';

describe('AuthenticatedRouteMixinMixin', function() {
  // Replace this with your real tests.
  it('works', function() {
    let AuthenticatedRouteMixinObject = Ember.Object.extend(AuthenticatedRouteMixinMixin);
    let subject = AuthenticatedRouteMixinObject.create();
    expect(subject).to.be.ok;
  });
});
