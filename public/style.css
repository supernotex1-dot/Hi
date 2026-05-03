/* ===== Root Variables ===== */
:root {
  --bg: #06050a;
  --bg-card: rgba(12, 8, 18, 0.92);
  --bg-card-hover: rgba(22, 12, 28, 0.95);
  --red: #8b0000;
  --red-bright: #cc0000;
  --red-glow: rgba(139, 0, 0, 0.35);
  --amber: #c8720a;
  --amber-glow: rgba(200, 114, 10, 0.4);
  --text: #e8ddd0;
  --text-muted: #907a6a;
  --text-dim: #504040;
  --border: rgba(139, 0, 0, 0.25);
  --border-hover: rgba(180, 30, 30, 0.6);
  --border-selected: rgba(204, 0, 0, 0.9);
  --candle-flame: #ffcc44;
  --candle-core: #fff8e0;
  --radius: 10px;
  --transition: 0.25s ease;
}

/* ===== Reset & Base ===== */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Sarabun', sans-serif;
  font-size: 16px;
  line-height: 1.7;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Subtle background texture */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 20%, rgba(80, 0, 0, 0.08) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 80%, rgba(40, 0, 60, 0.1) 0%, transparent 60%);
  pointer-events: none;
  z-index: 0;
}

/* ===== Pages ===== */
.page { display: none; min-height: 100vh; position: relative; z-index: 1; }
.page.active { display: flex; flex-direction: column; align-items: center; }

/* ===== Candle ===== */
.candle {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  margin: 0 12px;
}

.candle-body {
  width: 16px;
  height: 60px;
  background: linear-gradient(to bottom, #d4c8a0, #b8a870, #9a8c5a);
  border-radius: 3px 3px 1px 1px;
  box-shadow: 0 0 8px rgba(180, 130, 20, 0.3);
}

.candle.big .candle-body { width: 22px; height: 80px; }

.flame {
  width: 14px;
  height: 22px;
  background: radial-gradient(ellipse at 50% 80%, var(--candle-core) 0%, var(--candle-flame) 40%, rgba(200, 80, 0, 0.6) 80%, transparent 100%);
  border-radius: 50% 50% 40% 40%;
  animation: flicker 1.5s ease-in-out infinite alternate;
  filter: blur(0.5px);
  transform-origin: bottom center;
}

.candle.big .flame { width: 18px; height: 28px; }

@keyframes flicker {
  0%   { transform: scaleX(1) scaleY(1) rotate(-1deg); opacity: 1; }
  25%  { transform: scaleX(0.9) scaleY(1.05) rotate(1deg); opacity: 0.95; }
  50%  { transform: scaleX(1.05) scaleY(0.95) rotate(-0.5deg); opacity: 1; }
  75%  { transform: scaleX(0.95) scaleY(1.08) rotate(1.5deg); opacity: 0.92; }
  100% { transform: scaleX(1) scaleY(1) rotate(-1deg); opacity: 1; }
}

/* ===== Landing ===== */
#page-landing {
  justify-content: center;
  padding: 60px 24px 80px;
  text-align: center;
  gap: 0;
}

.candles-row {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-bottom: 32px;
}

.landing-content { max-width: 560px; }

.channel-label {
  font-size: 13px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--amber);
  margin-bottom: 14px;
  font-weight: 600;
}

.landing-title {
  font-family: 'Prompt', sans-serif;
  font-size: clamp(2.2rem, 7vw, 3.8rem);
  font-weight: 700;
  color: #fff;
  text-shadow:
    0 0 40px rgba(200, 0, 0, 0.5),
    0 0 80px rgba(200, 0, 0, 0.2);
  letter-spacing: 2px;
  margin-bottom: 14px;
  line-height: 1.2;
}

.landing-sub {
  font-size: 1.1rem;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.landing-sub strong { color: var(--text); }

.landing-desc {
  font-size: 0.95rem;
  color: var(--text-dim);
  line-height: 1.8;
  margin-bottom: 40px;
}

.btn-start {
  display: inline-block;
  padding: 16px 48px;
  background: linear-gradient(135deg, var(--red) 0%, #6b0000 100%);
  color: #fff;
  border: 1px solid rgba(200, 0, 0, 0.5);
  border-radius: 50px;
  font-family: 'Sarabun', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: 0 4px 30px rgba(140, 0, 0, 0.4), 0 0 60px rgba(140, 0, 0, 0.1);
  letter-spacing: 1px;
}

.btn-start:hover {
  background: linear-gradient(135deg, var(--red-bright) 0%, var(--red) 100%);
  box-shadow: 0 6px 40px rgba(200, 0, 0, 0.6), 0 0 80px rgba(200, 0, 0, 0.15);
  transform: translateY(-2px);
}

.fog {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(to top, rgba(30, 0, 40, 0.6) 0%, transparent 100%);
  pointer-events: none;
}

/* ===== Questionnaire ===== */
#page-quiz { padding: 0; justify-content: flex-start; }

.quiz-header {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: 20px 24px 0;
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-back-landing {
  background: none;
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: 6px 14px;
  border-radius: 6px;
  font-family: 'Sarabun', sans-serif;
  font-size: 0.85rem;
  cursor: pointer;
  transition: var(--transition);
  white-space: nowrap;
}

.btn-back-landing:hover { border-color: var(--border-hover); color: var(--text); }

.progress-wrap { flex: 1; }

.progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 6px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(to right, var(--red), var(--red-bright));
  border-radius: 4px;
  transition: width 0.4s ease;
  box-shadow: 0 0 10px var(--red-glow);
}

.step-label {
  font-size: 0.8rem;
  color: var(--text-dim);
}

.quiz-body {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: 24px 24px 100px;
  flex: 1;
}

/* ===== Steps ===== */
.step { animation: fadeUp 0.3s ease; }

.step.hidden { display: none; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.step-title {
  font-family: 'Prompt', sans-serif;
  font-size: clamp(1.3rem, 4vw, 1.8rem);
  font-weight: 600;
  color: #fff;
  margin-bottom: 6px;
}

.step-sub {
  color: var(--text-muted);
  margin-bottom: 24px;
  font-size: 0.95rem;
}

/* ===== Card Grid ===== */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}

.card-grid-3 { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
.card-grid-4 { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
.card-grid-2 { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }

/* ===== Option Card ===== */
.option-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 18px 14px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);
  user-select: none;
}

.option-card:hover {
  border-color: var(--border-hover);
  background: var(--bg-card-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px var(--red-glow);
}

.option-card.selected {
  border-color: var(--border-selected);
  background: rgba(100, 0, 0, 0.25);
  box-shadow: 0 0 24px var(--red-glow), inset 0 0 16px rgba(100, 0, 0, 0.15);
}

.card-icon { font-size: 1.8rem; margin-bottom: 8px; }
.card-label { font-weight: 600; font-size: 0.95rem; color: #fff; margin-bottom: 4px; }
.card-desc { font-size: 0.78rem; color: var(--text-muted); line-height: 1.4; }
.card-words { font-size: 0.78rem; color: var(--amber); margin-top: 6px; font-weight: 600; }

.length-card { padding: 20px 16px; }

/* ===== Form ===== */
.form-group { margin-bottom: 20px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-label { display: block; font-size: 0.9rem; color: var(--text-muted); margin-bottom: 8px; font-weight: 600; }

.form-input, .form-select, .form-textarea {
  width: 100%;
  background: rgba(10, 6, 16, 0.8);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  font-family: 'Sarabun', sans-serif;
  font-size: 0.95rem;
  padding: 10px 14px;
  outline: none;
  transition: var(--transition);
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: rgba(200, 100, 0, 0.6);
  box-shadow: 0 0 12px rgba(180, 80, 0, 0.2);
}

.form-select option { background: #0f0a14; color: var(--text); }

.form-textarea { resize: vertical; min-height: 120px; line-height: 1.7; }

.mt-8 { margin-top: 8px; }
.hidden { display: none !important; }

/* Name row */
.name-row { display: flex; gap: 12px; align-items: center; }
.name-row .form-input { flex: 1; }

.ai-name-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  white-space: nowrap;
  font-size: 0.85rem;
  color: var(--text-muted);
  user-select: none;
}

.toggle-track {
  width: 36px;
  height: 20px;
  background: rgba(255,255,255,0.1);
  border-radius: 10px;
  position: relative;
  transition: var(--transition);
  flex-shrink: 0;
}

.toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 14px;
  height: 14px;
  background: var(--text-dim);
  border-radius: 50%;
  transition: var(--transition);
}

.ai-name-toggle input:checked ~ .toggle-track { background: var(--red); }
.ai-name-toggle input:checked ~ .toggle-track .toggle-thumb {
  left: 19px;
  background: #fff;
}

/* Radio pills */
.radio-row { display: flex; gap: 8px; flex-wrap: wrap; }

.radio-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 50px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: var(--transition);
  user-select: none;
}

.radio-pill:hover { border-color: var(--border-hover); }
.radio-pill input:checked + span,
.radio-pill.selected { color: var(--red-bright); }
.radio-pill:has(input:checked) {
  border-color: var(--border-selected);
  background: rgba(100, 0, 0, 0.2);
}

/* ===== Summary Box ===== */
.summary-box {
  background: rgba(100, 0, 0, 0.1);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 20px;
  margin-bottom: 20px;
  font-size: 0.88rem;
  color: var(--text-muted);
  line-height: 2;
}

.summary-box strong { color: var(--text); }

/* ===== Navigation ===== */
.quiz-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: linear-gradient(to top, rgba(6,5,10,0.98) 70%, transparent);
  z-index: 10;
}

.btn-nav {
  padding: 12px 28px;
  border-radius: 8px;
  font-family: 'Sarabun', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.btn-prev {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
}

.btn-prev:hover { border-color: var(--border-hover); color: var(--text); }

.btn-next {
  background: linear-gradient(135deg, var(--red) 0%, #6b0000 100%);
  border: 1px solid rgba(200,0,0,0.4);
  color: #fff;
  box-shadow: 0 2px 20px var(--red-glow);
}

.btn-next:hover {
  background: linear-gradient(135deg, var(--red-bright) 0%, var(--red) 100%);
  box-shadow: 0 4px 30px rgba(200,0,0,0.5);
  transform: translateY(-1px);
}

.btn-next:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Generate button (step 6) */
.btn-generate {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, var(--red) 0%, #500000 100%);
  border: 1px solid rgba(200,0,0,0.5);
  border-radius: 10px;
  color: #fff;
  font-family: 'Sarabun', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: 0 4px 30px var(--red-glow);
  letter-spacing: 1px;
}

.btn-generate:hover {
  background: linear-gradient(135deg, var(--red-bright) 0%, var(--red) 100%);
  box-shadow: 0 6px 40px rgba(200,0,0,0.6);
  transform: translateY(-2px);
}

/* ===== Generating Page ===== */
#page-generating {
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 16px;
}

.gen-candles {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 20px;
  margin-bottom: 8px;
}

.gen-title {
  font-family: 'Prompt', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
}

.gen-sub { color: var(--text-muted); font-size: 0.95rem; }

.gen-dots {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 8px;
}

.gen-dots span {
  width: 8px;
  height: 8px;
  background: var(--red);
  border-radius: 50%;
  animation: dot-pulse 1.2s ease-in-out infinite;
}

.gen-dots span:nth-child(2) { animation-delay: 0.2s; }
.gen-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes dot-pulse {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50%       { opacity: 1; transform: scale(1.2); }
}

/* ===== Story Page ===== */
#page-story {
  align-items: center;
  padding: 40px 24px 80px;
}

.story-header {
  width: 100%;
  max-width: 680px;
  text-align: center;
  margin-bottom: 8px;
}
.story-title-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
  line-height: 1.4;
}
.desc-section { margin-top: 8px; text-align: left; width: 100%; max-width: 680px; }
.desc-body {
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 16px;
  font-family: inherit;
  font-size: 0.88rem;
  color: var(--text-dim);
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.7;
  margin-bottom: 12px;
}
.btn-desc-copy { margin-top: 4px; }
.form-hint { font-size: 0.78rem; color: var(--text-dim); margin: -4px 0 8px; }

.story-meta {
  font-size: 0.82rem;
  color: var(--text-dim);
  margin-bottom: 12px;
  letter-spacing: 1px;
}

.story-divider {
  color: var(--text-dim);
  font-size: 0.8rem;
  letter-spacing: 2px;
  margin: 12px 0;
}

.story-body {
  width: 100%;
  max-width: 680px;
  font-size: 1.05rem;
  line-height: 2.0;
  color: var(--text);
  white-space: pre-wrap;
  word-break: break-word;
}

.story-body p { margin-bottom: 1.4em; }

.cursor {
  display: inline-block;
  width: 2px;
  height: 1.1em;
  background: var(--amber);
  vertical-align: text-bottom;
  animation: blink 0.8s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.story-footer { width: 100%; max-width: 680px; margin-top: 16px; text-align: center; }

.story-actions { display: flex; gap: 12px; justify-content: center; margin-top: 16px; flex-wrap: wrap; }

.btn-action {
  padding: 12px 28px;
  border-radius: 8px;
  font-family: 'Sarabun', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
}

.btn-action:hover { border-color: var(--border-hover); color: var(--text); }

.btn-action.btn-primary {
  background: linear-gradient(135deg, var(--red) 0%, #6b0000 100%);
  border-color: rgba(200,0,0,0.5);
  color: #fff;
  box-shadow: 0 2px 20px var(--red-glow);
}

.btn-action.btn-primary:hover {
  background: linear-gradient(135deg, var(--red-bright) 0%, var(--red) 100%);
  box-shadow: 0 4px 30px rgba(200,0,0,0.5);
  transform: translateY(-1px);
}

.btn-action.btn-sequel {
  background: linear-gradient(135deg, #3a006b 0%, #1a0035 100%);
  border-color: rgba(150,0,255,0.4);
  color: #d4a0ff;
  box-shadow: 0 2px 20px rgba(120,0,200,0.3);
}
.btn-action.btn-sequel:hover {
  background: linear-gradient(135deg, #5500aa 0%, #3a006b 100%);
  box-shadow: 0 4px 30px rgba(150,0,255,0.5);
  transform: translateY(-1px);
}

/* ===== Responsive ===== */
@media (max-width: 480px) {
  .form-row { grid-template-columns: 1fr; }
  .name-row { flex-direction: column; align-items: stretch; }
  .card-grid, .card-grid-3, .card-grid-4 { grid-template-columns: repeat(2, 1fr); }
  .card-grid-2 { grid-template-columns: 1fr 1fr; }
  .quiz-nav { padding: 12px 16px; }
  .btn-nav { padding: 10px 20px; font-size: 0.88rem; }
}

@media (max-width: 360px) {
  .card-grid, .card-grid-3, .card-grid-4 { grid-template-columns: 1fr; }
}
