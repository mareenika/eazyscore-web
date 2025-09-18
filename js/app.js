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

// === DOM-Refs ===
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

// === Fragen ins Formular rendern (mit zugänglichen Labels) ===
function renderQuestions() {
  questionsWrap.innerHTML = '';
  QUESTIONS.forEach((label, idx) => {
    const qId = `q${idx+1}`;
    const row = document.createElement('div');
    row.className = 'question';
    row.innerHTML = `
      <label class="inline-label" for="${qId}">${label}</label>
      <span class="inline-field">
        <select id="${qId}" name="${qId}" required>
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

// === Scoring / Noten ===
function gradeFromScore(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  if (score >= 50) return 'E';
  return 'F';
}

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

// Antworten einsammeln (auch für Live-Vorschau)
function collectAnswers() {
  const answers = {};
  let yesCount = 0;
  QUESTIONS.forEach((_, i) => {
    const key = `q${i+1}`;
    const el = formEl.elements[key];
    const val = el ? (el.value || '') : '';
    answers[key] = val;
    if (val === 'YES') yesCount += 1;
  });
  return { answers, yesCount };
}

// Live-Vorschau von Score/Note/Fortschritt
function paintLivePreview() {
  const total = QUESTIONS.length;
  const { answers, yesCount } = collectAnswers();
  const score = Math.round((yesCount * 100) / total);
  const grade = gradeFromScore(score);

  scoreValueEl.textContent = `${score}%`;
  correctMetaEl.textContent = `${yesCount} von ${total} richtigen Antworten`;
  gradeBadgeEl.textContent = grade;
  setGradeClass(gradeBadgeEl, grade);

  progressBarEl.style.width = `${score}%`;
  progressTextEl.textContent = `${yesCount}/${total}`;
  setGradeClass(progressBarEl, grade);

  // Live-Kurzbefunde schon beim Ausfüllen
  shortFindings.innerHTML = buildShortFindings(answers);
}

// Bei jeder Änderung im Fragenbereich: Vorschau aktualisieren
questionsWrap.addEventListener('change', paintLivePreview);

// === Submit ===
formEl.addEventListener('submit', (e) => {
  e.preventDefault();

  // Validierung App-Name (muss vorhanden sein)
  const appNameRaw = (formEl.elements['appName']?.value || '').trim();
  if (!appNameRaw) {
    alert('Bitte einen App-Namen angeben.');
    formEl.elements['appName']?.focus();
    return;
  }

  // Validierung: Alle Fragen beantwortet?
  for (let i = 0; i < QUESTIONS.length; i++) {
    const key = `q${i+1}`;
    const el = formEl.elements[key];
    if (!el || !el.value) {
      alert(`Bitte Frage ${i+1} beantworten.`);
      el?.focus();
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
  }

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
      answers,                // { q1:"YES", q2:"NO", ... }
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

// === „Neu bewerten“ (alles sauber zurücksetzen) ===
function resetAll() {
  formEl.reset();
  renderQuestions();              // neue <select>s mit required & Defaults
  // Fortschritt/Ergebnis-UI zurücksetzen
  const total = QUESTIONS.length;
  scoreValueEl.textContent = `0%`;
  correctMetaEl.textContent = `0 von ${total} richtigen Antworten`;
  gradeBadgeEl.textContent = 'F';
  setGradeClass(gradeBadgeEl, 'F');
  progressBarEl.style.width = '0%';
  progressTextEl.textContent = `0/${total}`;
  setGradeClass(progressBarEl, 'F');
  rAppName.textContent = '–';
  rVersion.textContent = '–';
  rCategory.textContent = '–';
  shortFindings.innerHTML = '';
}

restartBtn.addEventListener('click', () => {
  resetAll();
  resultSection.classList.add('hidden');
  formEl.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Initial einmal eine „0%-Vorschau“ zeigen
paintLivePreview();
