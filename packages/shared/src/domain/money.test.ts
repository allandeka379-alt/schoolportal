import { describe, expect, it } from 'vitest';

import { DecimalAmountSchema, formatMoney, fromMinorUnits, toMinorUnits } from './money';

describe('DecimalAmountSchema', () => {
  it('accepts valid decimals', () => {
    expect(DecimalAmountSchema.parse('1650.50')).toBe('1650.50');
    expect(DecimalAmountSchema.parse('0')).toBe('0');
    expect(DecimalAmountSchema.parse('1650')).toBe('1650');
  });

  it('rejects negative and non-numeric', () => {
    expect(() => DecimalAmountSchema.parse('-1')).toThrow();
    expect(() => DecimalAmountSchema.parse('1,650')).toThrow();
    expect(() => DecimalAmountSchema.parse('1.234')).toThrow();
  });
});

describe('toMinorUnits / fromMinorUnits', () => {
  it('roundtrips whole amounts', () => {
    expect(toMinorUnits('1650')).toBe(165000n);
    expect(fromMinorUnits(165000n)).toBe('1650.00');
  });

  it('roundtrips fractional amounts', () => {
    expect(toMinorUnits('1650.50')).toBe(165050n);
    expect(fromMinorUnits(165050n)).toBe('1650.50');
  });

  it('pads single-digit cents', () => {
    expect(toMinorUnits('1650.5')).toBe(165050n);
    expect(fromMinorUnits(5n)).toBe('0.05');
  });
});

describe('formatMoney', () => {
  it('renders USD with the currency code first', () => {
    expect(formatMoney({ currency: 'USD', amount: '1650.50' })).toBe('USD 1,650.50');
  });

  it('renders ZWG (non-ISO) without Intl crashing', () => {
    expect(formatMoney({ currency: 'ZWG', amount: '250000' })).toBe('ZWG 250,000.00');
  });
});
