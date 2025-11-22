import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import {
  showTime
} from 'gmbh/helpers/show-time';

describe('ShowTimeHelper', function() {
  it('works', function() {
    const result = showTime([42]);
    expect(result).to.be.ok;
  });
});
