// ----- Fragen definieren (37 Stück) -----
const QUESTIONS = [
  "1. Werden nur notwendige Berechtigungen verwendet?",
  "2. Wird die Einwilligung der Nutzer abgefragt?",
  "3. Ist Registrierung erlaubt (sicher umgesetzt)?",
  "4. Wird ein komplexes Passwort erzwungen?",
  "5. Werden Geräte-IDs genutzt nur wenn nötig?",
  "6. Sind lokale Zugangsdaten geschützt?",
  "7. Sind lokale Zugangsdaten verschlüsselt?",
  "8. Sind Server-Zugangsdaten verschlüsselt gespeichert?",
  "9. Gibt es einen Session-Timeout?",
  "10. Werden Passwörter bei Eingabe maskiert?",
  "11. Passwort-Reset-Link sicher gestaltet?",
  "12. Erfolgt verschlüsselte Übertragung (HTTPS)?",
  "13. Wird Perfect Forward Secrecy genutzt?",
  "14. Mind. TLS 1.2 im Einsatz?",
  "15. SSLv2/v3 deaktiviert?",
  "16. Asym. Schlüssellängen ausreichend?",
  "17. Keine sensiblen Daten in HTTP GET?",
  "18. Vertrauenswürdige Zertifikate genutzt?",
  "19. SSL/TLS-Pinning vorhanden?",
  "20. Token-basierte Session verwendet?",
  "21. Speicherung nur so lange wie nötig?",
  "22. SD-Karten-Speicherung vermieden?",
  "23. SD-Daten bei Deinstallation gelöscht?",
  "24. Cloud-Backup (falls aktiv) eingeschränkt?",
  "25. Logging-Variante sicher gewählt?",
  "26. Keine personenbezogenen Daten im Log?",
  "27. Tracking grundsätzlich verwendet?",
  "28. IP-Adressen anonymisiert?",
  "29. Datenschutzerklärung informiert?",
  "30. Opt-out vorhanden?",
  "31. Auftragsverarbeitung geregelt (DPA)?",
  "32. Werden eindeutige Geräte-IDs vermieden?",
  "33. Standortzugriff notwendig und begrenzt?",
  "34. Grobe Lokalisierung statt präziser, wo möglich?",
  "35. Lokale Verarbeitung von Standortdaten?",
  "36. Speicherung von Standortdaten vermieden?",
  "37. Lokalisierung (Tracking) kann deaktiviert werden?"
];

const formEl = document.getElementById('auditForm');
const questionsWrap = document.getElementById('questions');
const resultSection = document.getElementById('resultSection');

const scoreValueEl = document.getElementById('scoreValue');
const correctMetaEl = document.getElementById('correctMeta');
const gradeBadgeEl = document.getElementById('gradeBadge');
const progressBarEl = document.getElementById('progressBar');
const progressTextEl = document.getElementById('progressText');

const rAppName = document.getElementById('rAppName');
const rVersion = document.getElementById('rVersion');
const rCategory = document.getElementById('rCategory');
const shortFindings = document.getElementById('shortFindings');

const restartBtn = document.getElementById('restartBtn');

// Fragen ins Formular rendern
function renderQuestions() {
  questionsWrap.innerHTML = '';
  QUESTIONS.forEach((label, idx) => {
    const row = document.createElement('div');
    row.className = 'question';
    row.innerHTML = `
      <span class="inline-label">${label}</span>
      <span class="inline-field">
        <select name="q${idx+1}" required>
          <option value="" disabled selected>-- bitte auswählen --</option>
          <option value="YES">Ja</option>
          <option value="NO">Nein</option>
          <option value="UNKNOWN">Unbekannt</option>
        </select>
      </span>
    `;
    questionsWrap.appendChild(row);
  });
}
renderQuestions();

// Bewertung berechnen (E ab 50%, <50% = F)
function gradeFromScore(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  if (score >= 50) return 'E';
  return 'F';
}

// Klasse für Farbbadges/-balken setzen
function setGradeClass(el, grade) {
  el.classList.remove('grade-A','grade-B','grade-C','grade-D','grade-E','grade-F');
  el.classList.add(`grade-${grade}`);
}

// „Kurzbefunde“ (Beispiele)
function buildShortFindings(answersMap) {
  const yes = (n) => answersMap[`q${n}`] === 'YES';
  const rows = [];
  if (yes(2)) rows.push('Einwilligung der Nutzer wird eingeholt.');
  if (yes(12)) rows.push('Übertragung ist verschlüsselt (HTTPS).');
  if (!yes(27)) rows.push('Kein Tracking aktiviert.');
  if (yes(31)) rows.push('Auftragsverarbeitung vertraglich geregelt.');
  if (rows.length === 0) rows.push('Keine besonderen Positivbefunde.');
  return rows.map(t => `<div>• ${t}</div>`).join('');
}

// Submit
formEl.addEventListener('submit', (e) => {
  e.preventDefault();

  // Antworten einsammeln
  const formData = new FormData(formEl);
  const answers = {};
  let correct = 0;
  QUESTIONS.forEach((_, i) => {
    const key = `q${i+1}`;
    const val = formData.get(key) || '';
    answers[key] = val;
    if (val === 'YES') correct += 1; // nur Ja zählt
  });

  const total = QUESTIONS.length;
  const score = Math.round((correct * 100) / total);
  const grade = gradeFromScore(score);

  // Ergebnis UI füllen
  scoreValueEl.textContent = `${score}%`;
  correctMetaEl.textContent = `${correct} von ${total} richtigen Antworten`;
  gradeBadgeEl.textContent = grade;
  setGradeClass(gradeBadgeEl, grade);

  progressBarEl.style.width = `${score}%`;
  progressTextEl.textContent = `${correct}/${total}`;
  setGradeClass(progressBarEl, grade);

  rAppName.textContent = (formData.get('appName') || '–').trim() || '–';
  rVersion.textContent = (formData.get('version') || '–').trim() || '–';
  rCategory.textContent = (formData.get('category') || '–').trim() || '–';

  shortFindings.innerHTML = buildShortFindings(answers);

  // Persistenz-Hook → index.html speichert via Supabase
  document.dispatchEvent(new CustomEvent('eazy:result', {
    detail: {
      answers,                // z.B. { q1: "YES", q2: "NO", ... }
      score,                  // Prozent (0..100)
      grade,                  // "A".."F"
      meta: {
        appName: (formData.get('appName') || '').trim(),
        version: (formData.get('version') || '').trim(),
        category: (formData.get('category') || '').trim()
      }
    }
  }));

  // Umschalten: Formular aus, Ergebnis an
  formEl.classList.add('hidden');
  resultSection.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Neu bewerten
restartBtn.addEventListener('click', () => {
  formEl.reset();
  renderQuestions();
  resultSection.classList.add('hidden');
  formEl.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
