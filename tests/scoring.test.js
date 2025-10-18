// tests/scoring.test.js
import { computeScore, gradeFromScore } from '../js/lib/scoring.js';

describe('computeScore', () => {
  test('100 % bei allen YES', () => {
    const answers = { q1: 'YES', q2: 'YES', q3: 'YES' };
    expect(computeScore(answers)).toBe(100);
  });

  test('0 % bei allen NO', () => {
    const answers = { q1: 'NO', q2: 'NO' };
    expect(computeScore(answers)).toBe(0);
  });

  test('UNKNOWN trägt 0 Punkte bei; Nenner bleibt Gesamtzahl der Fragen', () => {
    // 2 YES von 4 Antworten → 50 %
    const answers = { q1: 'YES', q2: 'UNKNOWN', q3: 'NO', q4: 'YES' };
    expect(computeScore(answers)).toBe(50);
  });

  test('leeres Objekt ergibt 0', () => {
    expect(computeScore({})).toBe(0);
  });

  test('robust gegenüber ungültigen Eingaben (null/undefined)', () => {
    expect(computeScore(null)).toBe(0);
    expect(computeScore(undefined)).toBe(0);
  });
});

describe('gradeFromScore', () => {
  test('Grenzwerte korrekt zugeordnet', () => {
    expect(gradeFromScore(90)).toBe('A');
    expect(gradeFromScore(89)).toBe('B');
    expect(gradeFromScore(80)).toBe('B');
    expect(gradeFromScore(79)).toBe('C');
    expect(gradeFromScore(70)).toBe('C');
    expect(gradeFromScore(69)).toBe('D');
    expect(gradeFromScore(60)).toBe('D');
    expect(gradeFromScore(59)).toBe('E');
    expect(gradeFromScore(50)).toBe('E');
    expect(gradeFromScore(49)).toBe('F');
    expect(gradeFromScore(0)).toBe('F');
  });
});
