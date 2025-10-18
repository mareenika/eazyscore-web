export function hasAllAnswers(answers, total) {
  const keys = Object.keys(answers || {});
  return keys.length === total && keys.every(k => ['YES','NO','UNKNOWN'].includes(answers[k]));
}

