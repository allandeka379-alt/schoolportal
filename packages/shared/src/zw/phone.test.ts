import { describe, expect, it } from 'vitest';

import { detectOperator, InvalidPhoneError, toE164 } from './phone';

describe('toE164', () => {
  it('accepts local prefix', () => {
    expect(toE164('0772 123 456')).toBe('+263772123456');
  });

  it('accepts international with +', () => {
    expect(toE164('+263 78 456 7890')).toBe('+263784567890');
  });

  it('accepts international without +', () => {
    expect(toE164('263712345678')).toBe('+263712345678');
  });

  it('accepts NetOne prefix 71', () => {
    expect(toE164('0712 345 678')).toBe('+263712345678');
  });

  it('rejects invalid operator prefix', () => {
    expect(() => toE164('0999 000 000')).toThrow(InvalidPhoneError);
  });

  it('rejects short numbers', () => {
    expect(() => toE164('0772 123')).toThrow(InvalidPhoneError);
  });
});

describe('detectOperator', () => {
  it('recognises Econet', () => {
    expect(detectOperator('+263772123456')).toBe('econet');
  });

  it('recognises NetOne', () => {
    expect(detectOperator('+263712345678')).toBe('netone');
  });

  it('recognises Telecel', () => {
    expect(detectOperator('+263732345678')).toBe('telecel');
  });

  it('returns null for non-Zim numbers', () => {
    expect(detectOperator('+27831234567')).toBeNull();
  });
});
