'use strict';
const util = require('../../printer/util');

const chai = require('chai');
const expect = chai.expect;

describe('util test rpad', () => {
  it('should correctly right pad short string', () => {
    const result = util.rpad('short', 10);
    expect(result).to.be.equal('short     ');
  });

  it('should correctly right pad a long string', () => {
    const result = util.rpad('too long to print string' ,10);
    expect(result).to.be.equal('too lon...');
  });

  it('should return if nothing to crop or pad', () => {
    const result = util.rpad('just perfect', 12);
    expect(result).to.be.equal('just perfect');
  });

  it('should throw error if amount is to low', () => {
    expect(() => util.rpad('short', 2)).to.throw();
  });
});

describe('util test lpad', () => {
  it('should correctly left pad short string', () => {
    const result = util.lpad('short', 10);
    expect(result).to.be.equal('     short');
  });

  it('should correctly left pad a long string', () => {
    const result = util.lpad('too long to print string' ,10);
    expect(result).to.be.equal('too lon...');
  });

  it('should return if nothing to crop or pad', () => {
    const result = util.lpad('just perfect', 12);
    expect(result).to.be.equal('just perfect');
  });

  it('should throw error if amount is to low', () => {
    expect(() => util.lpad('short', 2)).to.throw();
  });
});

describe('util test cpad', () => {
  it('should correctly center pad short string uneven', () => {
    const result = util.cpad('short', 10);
    expect(result).to.be.equal('  short   ');
  });

  it('should correctly center pad short string with uneven amount', () => {
    const result = util.cpad('shot', 9);
    expect(result).to.be.equal('  shot   ');
  });

  it('should correctly center pad short string even', () => {
    const result = util.cpad('short', 9);
    expect(result).to.be.equal('  short  ');
  });

  it('should correctly right pad a long string', () => {
    const result = util.cpad('too long to print string' ,10);
    expect(result).to.be.equal('too lon...');
  });

  it('should return if nothing to crop or pad', () => {
    const result = util.cpad('just perfect', 12);
    expect(result).to.be.equal('just perfect');
  });

  it('should throw error if amount is to low', () => {
    expect(() => util.cpad('short', 2)).to.throw();
  });
});

describe('util test formatDate', () => {
  it('should correctly format time with leading zero', () => {
    const result = util.formatDate(new Date(3666 * 1000));
    if (process.env.NODE_ENV === "test") {
      expect(result).to.be.equal('02:01 01.01');
    } else {
      expect(result).to.be.equal('01:01 01.01');
    }
  });

  it('should correctly format time', () => {
    const result = util.formatDate('2017-12-25T22:38:26.229Z');
    if (process.env.NODE_ENV === "test") {
      expect(result).to.be.equal('23:38 25.12');
    } else {
      expect(result).to.be.equal('22:38 25.12');
    }
  });
});
