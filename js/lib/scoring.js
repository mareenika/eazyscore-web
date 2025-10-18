// PURE Logik – keine DOM/Browser-Abhängigkeiten

/** @param {Record<string,'YES'|'NO'|'UNKNOWN'>} answers */
export function computeScore(answers) {
  const keys = Object.keys(answers || {});
  if (keys.length === 0) return 0;
  const yes = keys.filter(k => answers[k] === 'YES').length;
  return Math.round((yes * 100) / keys.length);
}

export function gradeFromScore(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  if (score >= 50) return 'E';
  return 'F';
}

