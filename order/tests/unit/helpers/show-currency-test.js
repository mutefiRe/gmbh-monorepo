import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import {
  showCurrency
} from 'gmbh/helpers/show-currency';

describe('ShowCurrencyHelper', function() {
  // Replace this with your real tests.
  it('works', function() {
    const result = showCurrency([42]);
    expect(result).to.eq('42,00');
  });

  it('returns 2 decimal digits', function() {
    const result = showCurrency([4.23]);
    expect(result).to.eq('4,23');
  });

  it('returns 2 decimal digits', function() {
    const result = showCurrency([0.23]);
    expect(result).to.eq('0,23');
  });

  it('returns 2 decimal digits', function() {
    const result = showCurrency([0.1]);
    expect(result).to.eq('0,10');
  });

  it('returns 2 decimal digits', function() {
    const result = showCurrency([0]);
    expect(result).to.eq('0,00');
  });
});
