export function buildShortFindings(answers) {
  const yes = n => answers[`q${n}`] === 'YES';
  const rows = [];
  if (yes(2))  rows.push('Einwilligung der Nutzer wird eingeholt.');
  if (yes(12)) rows.push('Übertragung ist verschlüsselt (HTTPS).');
  if (!yes(27)) rows.push('Kein Tracking aktiviert.');
  if (yes(31)) rows.push('Auftragsverarbeitung vertraglich geregelt.');
  return (rows.length ? rows : ['Keine besonderen Positivbefunde.']);
}
