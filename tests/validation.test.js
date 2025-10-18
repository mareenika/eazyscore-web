import { isTriState, hasAllAnswers, requireNonEmpty, clampScore } from '../js/lib/validation.js';

describe('isTriState', () => {
  test('akzeptiert YES/NO/UNKNOWN', () => {
    expect(isTriState('YES')).toBe(true);
    expect(isTriState('NO')).toBe(true);
    expect(isTriState('UNKNOWN')).toBe(true);
  });
  test('lehnt anderes ab', () => {
    expect(isTriState('')).toBe(false);
    expect(isTriState('MAYBE')).toBe(false);
    expect(isTriState(null)).toBe(false);
  });
});

describe('hasAllAnswers', () => {
  test('true bei 3/3 gültigen Antworten', () => {
    const a = { q1:'YES', q2:'NO', q3:'UNKNOWN' };
    expect(hasAllAnswers(a, 3)).toBe(true);
  });
  test('false bei fehlenden Antworten', () => {
    const a = { q1:'YES', q2:'NO' };
    expect(hasAllAnswers(a, 3)).toBe(false);
  });
  test('false bei ungültigem Wert', () => {
    const a = { q1:'YES', q2:'NO', q3:'MAYBE' };
    expect(hasAllAnswers(a, 3)).toBe(false);
  });
});

describe('requireNonEmpty', () => {
  test('akzeptiert nicht-leere Strings', () => {
    expect(requireNonEmpty('WhatsApp')).toBe(true);
  });
  test('lehnt leere/Whitespace ab', () => {
    expect(requireNonEmpty('')).toBe(false);
    expect(requireNonEmpty('   ')).toBe(false);
    expect(requireNonEmpty(null)).toBe(false);
  });
});

describe('clampScore', () => {
  test('clamped und gerundet', () => {
    expect(clampScore(101.2)).toBe(100);
    expect(clampScore(-2)).toBe(0);
    expect(clampScore(59.6)).toBe(60);
  });
  test('nicht-finit → 0', () => {
    expect(clampScore(NaN)).toBe(0);
  });
});

