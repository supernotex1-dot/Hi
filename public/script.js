'use strict';

// ===== State =====
const state = {
  currentStep: 1,
  totalSteps: 6,
  data: {
    storyType: null,
    ghostType: null,
    generateCharacter: null,
    characterName: '',
    generateName: false,
    characterAge: '',
    characterGender: null,
    characterJob: '',
    setting: null,
    storyLength: null,
    additionalDetails: '',
    epNumber: '',
    prevEpLinks: '',
  },
};

// ===== DOM Refs =====
const pages = {
  landing: document.getElementById('page-landing'),
  quiz: document.getElementById('page-quiz'),
  generating: document.getElementById('page-generating'),
  story: document.getElementById('page-story'),
};

const els = {
  btnStart: document.getElementById('btnStart'),
  btnBackLanding: document.getElementById('btnBackLanding'),
  btnPrev: document.getElementById('btnPrev'),
  btnNext: document.getElementById('btnNext'),
  btnGenerate: document.getElementById('btnGenerate'),
  progressFill: document.getElementById('progressFill'),
  stepLabel: document.getElementById('stepLabel'),
  storySummary: document.getElementById('storySummary'),
  storyBody: document.getElementById('storyBody'),
  storyMeta: document.getElementById('storyMeta'),
  storyFooter: document.getElementById('storyFooter'),
  btnCopy: document.getElementById('btnCopy'),
  btnSequel: document.getElementById('btnSequel'),
  btnRestart: document.getElementById('btnRestart'),
  btnCopyDesc: document.getElementById('btnCopyDesc'),
  epNumber: document.getElementById('epNumber'),
  prevEpLinks: document.getElementById('prevEpLinks'),
  storyTitleDisplay: document.getElementById('storyTitleDisplay'),
  storyTitleText: document.getElementById('storyTitleText'),
  descSection: document.getElementById('descSection'),
  descBody: document.getElementById('descBody'),
  characterName: document.getElementById('characterName'),
  generateName: document.getElementById('generateName'),
  characterAge: document.getElementById('characterAge'),
  characterJob: document.getElementById('characterJob'),
  characterJobCustom: document.getElementById('characterJobCustom'),
  additionalDetails: document.getElementById('additionalDetails'),
  quizNav: document.getElementById('quizNav'),
};

// ===== Page Navigation =====
function showPage(name) {
  Object.values(pages).forEach(p => p.classList.remove('active'));
  pages[name].classList.add('active');
  window.scrollTo(0, 0);
}

// ===== Step Navigation =====
function showStep(n) {
  for (let i = 1; i <= state.totalSteps; i++) {
    const el = document.getElementById(`step-${i}`);
    if (el) el.classList.toggle('hidden', i !== n);
  }
  state.currentStep = n;
  updateProgress();
  updateNavButtons();
  if (n === 6) buildSummary();
}

function updateProgress() {
  const pct = ((state.currentStep - 1) / state.totalSteps) * 100;
  els.progressFill.style.width = `${pct}%`;
  els.stepLabel.textContent = `ขั้นที่ ${state.currentStep} / ${state.totalSteps}`;
}

function updateNavButtons() {
  els.btnPrev.style.visibility = state.currentStep === 1 ? 'hidden' : 'visible';

  // Hide next on last step (has its own generate button)
  if (state.currentStep === 6) {
    els.quizNav.style.display = 'none';
  } else {
    els.quizNav.style.display = 'flex';
    els.btnNext.disabled = !isCurrentStepValid();
  }
}

function isCurrentStepValid() {
  switch (state.currentStep) {
    case 1: return !!state.data.storyType;
    case 2: return !!state.data.ghostType;
    case 3: {
      if (!state.data.generateCharacter) return false;
      if (state.data.generateCharacter === 'true') return true;
      return (
        (state.data.generateName || state.data.characterName.trim()) &&
        state.data.characterAge &&
        state.data.characterGender &&
        state.data.characterJob.trim()
      );
    }
    case 4: return !!state.data.setting;
    case 5: return !!state.data.storyLength;
    case 6: return true;
    default: return false;
  }
}

// ===== Option Cards =====
document.querySelectorAll('.option-card').forEach(card => {
  card.addEventListener('click', () => {
    const field = card.dataset.field;
    const value = card.dataset.value;

    // Deselect siblings
    document.querySelectorAll(`.option-card[data-field="${field}"]`).forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');

    state.data[field] = value;
    const radio = card.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;

    if (field === 'generateCharacter') {
      const form = document.getElementById('characterForm');
      if (form) form.classList.toggle('hidden', value === 'true');
    }

    updateNavButtons();
  });
});

// ===== Character Form =====
els.characterName.addEventListener('input', () => {
  state.data.characterName = els.characterName.value;
  updateNavButtons();
});

els.generateName.addEventListener('change', () => {
  state.data.generateName = els.generateName.checked;
  els.characterName.disabled = els.generateName.checked;
  if (els.generateName.checked) els.characterName.value = '';
  updateNavButtons();
});

els.characterAge.addEventListener('input', () => {
  state.data.characterAge = els.characterAge.value;
  updateNavButtons();
});

document.querySelectorAll('input[name="characterGender"]').forEach(radio => {
  radio.addEventListener('change', () => {
    state.data.characterGender = radio.value;
    updateNavButtons();
  });
});

els.characterJob.addEventListener('change', () => {
  if (els.characterJob.value === 'custom') {
    els.characterJobCustom.classList.remove('hidden');
    state.data.characterJob = '';
    els.characterJobCustom.focus();
  } else {
    els.characterJobCustom.classList.add('hidden');
    state.data.characterJob = els.characterJob.value;
  }
  updateNavButtons();
});

els.characterJobCustom.addEventListener('input', () => {
  state.data.characterJob = els.characterJobCustom.value;
  updateNavButtons();
});

els.additionalDetails.addEventListener('input', () => {
  state.data.additionalDetails = els.additionalDetails.value;
});

els.epNumber.addEventListener('input', () => {
  state.data.epNumber = els.epNumber.value;
});

els.prevEpLinks.addEventListener('input', () => {
  state.data.prevEpLinks = els.prevEpLinks.value;
});

els.btnCopyDesc.addEventListener('click', () => {
  navigator.clipboard.writeText(els.descBody.textContent).then(() => {
    els.btnCopyDesc.textContent = '✅ คัดลอกแล้ว!';
    setTimeout(() => { els.btnCopyDesc.textContent = '📋 คัดลอกคำอธิบาย'; }, 2000);
  });
});

// ===== Summary (Step 6) =====
const LABELS = {
  storyType: { 'rule-of-horror': 'Rule of Horror', 'thai-legend': 'ตำนานผีไทย', 'folk-ghost': 'ผีชาวบ้าน', 'modern-ghost': 'ผีสมัยใหม่', 'mixed': 'ผสมผสาน' },
  ghostType: { 'ai-choose': 'ให้ AI เลือก', 'mae-nak': 'แม่นาค', 'krasue': 'กระสือ', 'phi-pop': 'ผีปอบ', 'nang-tani': 'นางตานี', 'nang-takian': 'นางตะเคียน', 'phi-tai-hong': 'ผีตายโหง', 'phi-dek': 'ผีเด็ก', 'vengeful': 'วิญญาณแก้แค้น' },
  setting: { 'rural-village': 'หมู่บ้านชนบท', 'city': 'ในเมือง', 'forest': 'ป่า/ภูเขา', 'river': 'ริมน้ำ', 'temple': 'วัดร้าง', 'abandoned-house': 'บ้านร้าง', 'hospital': 'โรงพยาบาล', 'school': 'โรงเรียน' },
  gender: { 'male': 'ชาย', 'female': 'หญิง', 'other': 'ไม่ระบุ' },
};

function buildSummary() {
  const d = state.data;
  els.storySummary.innerHTML = `
    <strong>ประเภทเรื่อง:</strong> ${LABELS.storyType[d.storyType] || d.storyType} &nbsp;|&nbsp;
    <strong>ผี:</strong> ${LABELS.ghostType[d.ghostType] || d.ghostType}<br/>
    <strong>ตัวละคร:</strong> ${d.generateCharacter === 'true' ? '(AI สร้างตัวละครทั้งหมด)' : `${d.generateName ? '(AI คิดชื่อให้)' : d.characterName} อายุ ${d.characterAge} ปี เพศ${LABELS.gender[d.characterGender]} อาชีพ${d.characterJob}`}<br/>
    <strong>ฉาก:</strong> ${LABELS.setting[d.setting] || d.setting} &nbsp;|&nbsp;
    <strong>ความยาว:</strong> ${d.storyLength} นาที
  `;
}

// ===== Button Handlers =====
els.btnStart.addEventListener('click', () => {
  showPage('quiz');
  showStep(1);
});

els.btnBackLanding.addEventListener('click', () => showPage('landing'));

els.btnPrev.addEventListener('click', () => {
  if (state.currentStep > 1) showStep(state.currentStep - 1);
});

els.btnNext.addEventListener('click', () => {
  if (isCurrentStepValid() && state.currentStep < state.totalSteps) {
    showStep(state.currentStep + 1);
  }
});

els.btnGenerate.addEventListener('click', generateStory);

els.btnRestart.addEventListener('click', () => {
  resetState();
  showPage('landing');
});

els.btnSequel.addEventListener('click', continueStory);

els.btnCopy.addEventListener('click', () => {
  const text = els.storyBody.innerText;
  navigator.clipboard.writeText(text).then(() => {
    els.btnCopy.textContent = '✅ คัดลอกแล้ว!';
    setTimeout(() => { els.btnCopy.textContent = '📋 คัดลอกเรื่อง'; }, 2000);
  });
});

// ===== Reset =====
function resetState() {
  state.currentStep = 1;
  sequelCount = 0;
  state.data = { storyType: null, ghostType: null, generateCharacter: null, characterName: '', generateName: false, characterAge: '', characterGender: null, characterJob: '', setting: null, storyLength: null, additionalDetails: '' };
  const charForm = document.getElementById('characterForm');
  if (charForm) charForm.classList.add('hidden');
  document.querySelectorAll('.option-card.selected').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
  els.characterName.value = '';
  els.characterName.disabled = false;
  els.generateName.checked = false;
  els.characterAge.value = '';
  els.characterJob.value = '';
  els.characterJobCustom.value = '';
  els.characterJobCustom.classList.add('hidden');
  els.additionalDetails.value = '';
  els.epNumber.value = '';
  els.prevEpLinks.value = '';
  els.storyTitleDisplay.style.display = 'none';
  els.storyTitleText.textContent = '';
  els.descSection.style.display = 'none';
  els.descBody.textContent = '';
  els.storyBody.textContent = '';
  els.storyFooter.style.display = 'none';
}

// ===== Story Generation =====
let fullStoryText = '';
let sequelCount = 0;

async function continueStory() {
  const previousStory = fullStoryText;
  showPage('generating');
  els.storyFooter.style.display = 'none';

  try {
    const res = await fetch('/api/continue-story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ previousStory, data: state.data }),
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error);

    sequelCount++;
    fullStoryText = data.text || '';
    showPage('story');
    const part = sequelCount > 1 ? `ภาค ${sequelCount}` : 'ภาคต่อ';
    els.storyMeta.textContent = els.storyMeta.textContent.replace(/ · ภาค.*$/, '') + ` · ${part}`;
    renderStory(fullStoryText);
    finishStory();
  } catch (err) {
    showPage('story');
    els.storyBody.innerHTML = `<p style="color:#cc4444;">เกิดข้อผิดพลาด: ${err.message}</p>`;
    els.storyFooter.style.display = 'block';
  }
}

async function generateStory() {
  showPage('generating');
  fullStoryText = '';

  try {
    const res = await fetch('/api/generate-story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state.data),
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error);

    fullStoryText = data.text || '';
    showPage('story');
    buildStoryMeta();
    if (data.title) {
      els.storyTitleText.textContent = data.title;
      els.storyTitleDisplay.style.display = 'block';
    }
    renderStory(fullStoryText);
    finishStory(data.description);
  } catch (err) {
    showPage('story');
    els.storyBody.innerHTML = `<p style="color:#cc4444;">เกิดข้อผิดพลาด: ${err.message}</p>`;
    els.storyFooter.style.display = 'block';
  }
}

function renderStory(text) {
  // Convert double-newlines to paragraphs; keep single newlines as <br>
  const paragraphs = text.split(/\n\n+/);
  const html = paragraphs
    .map(p => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
    .join('');
  els.storyBody.innerHTML = html + '<span class="cursor"></span>';
  // Auto-scroll to bottom during streaming
  window.scrollTo(0, document.body.scrollHeight);
}

function finishStory(description) {
  if (els.storyFooter.style.display === 'block') return;
  renderStory(fullStoryText);
  const cursor = els.storyBody.querySelector('.cursor');
  if (cursor) cursor.remove();
  els.storyFooter.style.display = 'block';
  if (description) {
    els.descBody.textContent = description;
    els.descSection.style.display = 'block';
  }
  window.scrollTo(0, document.body.scrollHeight);
}

function buildStoryMeta() {
  const d = state.data;
  const name = d.generateName ? 'ตัวละคร AI' : d.characterName;
  els.storyMeta.textContent = `${LABELS.storyType[d.storyType] || d.storyType} · ${LABELS.setting[d.setting] || d.setting} · ${d.storyLength} นาที · โดย ตี๋น้อย Teenoihub`;
}

// ===== Init =====
showPage('landing');
