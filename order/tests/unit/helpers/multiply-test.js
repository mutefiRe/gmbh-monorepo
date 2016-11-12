/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import {
  multiply
} from 'gmbh/helpers/multiply';

describe('MultiplyHelper', function() {
  // Replace this with your real tests.
  it('works', function() {
    let result = multiply(42);
    expect(result).to.be.ok;
  });
});
