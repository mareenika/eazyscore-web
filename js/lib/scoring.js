/**
 * scoring.js
 * -----------------------------------------
 * Enthält die reine Bewertungslogik von EAZY Score.
 * Keine DOM- oder Framework-Abhängigkeiten!
 * Diese Funktionen sind leicht testbar und können
 * direkt in Jest-Unit-Tests geprüft werden.
 * -----------------------------------------
 */

/**
 * Berechnet den Gesamtscore in Prozent.
 * @param {Record<string,'YES'|'NO'|'UNKNOWN'>} answers - Map der Antworten
 * @returns {number} Score zwischen 0 und 100
 */
export function computeScore(answers) {
  if (!answers || typeof answers !== 'object') return 0;
  const keys = Object.keys(answers);
  if (keys.length === 0) return 0;
  const yesCount = keys.filter(k => answers[k] === 'YES').length;
  const score = Math.round((yesCount * 100) / keys.length);
  return clampScore(score);
}

/**
 * Weist dem Score eine Schulnote (A–F) zu.
 * @param {number} score - Prozentwert (0–100)
 * @returns {'A'|'B'|'C'|'D'|'E'|'F'}
 */
export function gradeFromScore(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  if (score >= 50) return 'E';
  return 'F';
}

/**
 * Clamped einen numerischen Score auf 0–100.
 * @param {number} n - zu prüfender Wert
 * @returns {number} auf 0–100 begrenzter, gerundeter Score
 */
export function clampScore(n) {
  const x = Number.isFinite(n) ? n : 0;
  return Math.min(100, Math.max(0, Math.round(x)));
}

/**
 * Kombinierte Bewertungsfunktion:
 * Nimmt Antwort-Map entgegen und liefert vollständiges Ergebnis.
 * @param {Record<string,'YES'|'NO'|'UNKNOWN'>} answers
 * @returns {{score:number, grade:string, yes:number, total:number}}
 */
export function evaluate(answers) {
  const keys = Object.keys(answers || {});
  const yes = keys.filter(k => answers[k] === 'YES').length;
  const score = computeScore(answers);
  const grade = gradeFromScore(score);
  return { score, grade, yes, total: keys.length };
}

/**
 * Berechnet eine textuelle Kurzbeschreibung zur Bewertung.
 * @param {number} score - Prozentwert
 * @param {string} grade - Note (A–F)
 * @returns {string}
 */
export function getSummaryText(score, grade) {
  if (grade === 'A') return `Sehr gute Sicherheit (${score} %)`;
  if (grade === 'B') return `Gute Sicherheit (${score} %)`;
  if (grade === 'C') return `Solide Sicherheit (${score} %)`;
  if (grade === 'D') return `Eingeschränkt ausreichend (${score} %)`;
  if (grade === 'E') return `Schwache Sicherheit (${score} %)`;
  return `Unzureichende Sicherheit (${score} %)`;
}

// Default-Export für einfache Imports
export default {
  computeScore,
  gradeFromScore,
  clampScore,
  evaluate,
  getSummaryText
};
