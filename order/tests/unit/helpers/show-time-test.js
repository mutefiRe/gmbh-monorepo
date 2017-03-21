import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import {
  showTime
} from 'gmbh/helpers/show-time';

describe.only('ShowTimeHelper', function() {
  // Replace this with your real tests.
  it('works', function() {
    const result = showTime([42]);
    expect(result).to.be.ok;
  });

  it('show time format', function() {
    const result = showTime(["Tue Mar 21 2017 11:49:09 GMT+0100 (CET)"]);
    expect(result).to.eq('11:49:09 AM GMT+01:00');
  });
});
