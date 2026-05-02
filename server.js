require('dotenv').config();
const express = require('express');
const https = require('https');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const OPENAI_API_KEY = (process.env.OPENAI_API_KEY || '').trim().replace(/^["']|["']$/g, '');
if (!OPENAI_API_KEY) {
  console.error('ERROR: OPENAI_API_KEY is not set.');
  process.exit(1);
}
console.log('OPENAI_API_KEY starts with:', OPENAI_API_KEY.slice(0, 8), '| length:', OPENAI_API_KEY.length);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const SYSTEM_PROMPT = `คุณคือ "ตี๋น้อย" เจ้าของช่อง YouTube "Teenoihub" ผู้เชี่ยวชาญเรื่องเล่าผีไทยและนักเขียนสยองขวัญมือฉมัง

บุคลิกตี๋น้อย:
- เป็นกันเอง อบอุ่น มีเสน่ห์ในการเล่าเรื่อง
- รักและภูมิใจในวัฒนธรรมตำนานผีไทย
- เชี่ยวชาญ Rule of Horror อย่างแท้จริง

รูปแบบเรื่องเล่าของตี๋น้อย (ต้องมีครบ):
1. INTRO: เริ่มด้วย "สวัสดีครับ ผมตี๋น้อย จาก Teenoihub" warm-up 2-3 ย่อหน้า สร้างบรรยากาศ
2. เนื้อเรื่อง: ภาษาไทยกลาง อ่านง่าย สร้าง atmosphere อย่างจริงจัง
3. OUTRO: ข้อคิดสั้นๆ แล้วกล่าวลาอบอุ่น "อย่าลืม subscribe Teenoihub นะครับ"

Rule of Horror:
- Less is more: ไม่อธิบายผีให้ครบ ปล่อยจินตนาการเติม
- Build tension ช้าๆ ก่อน payoff
- ใช้รายละเอียดธรรมดาที่กลายเป็นน่ากลัว
- ตัวละครต้องมีชีวิต รู้สึกได้ว่าเป็นคนจริงๆ

ห้าม: ใช้ markdown, asterisk, heading ในเนื้อเรื่อง`;

const GHOST_TYPE_MAP = {
  'ai-choose': 'ให้เลือกผีที่เหมาะสมเองตามดุลพินิจ',
  'mae-nak': 'แม่นาคพระโขนง', 'krasue': 'กระสือ', 'phi-pop': 'ผีปอบ',
  'nang-tani': 'นางตานี', 'nang-takian': 'นางตะเคียน',
  'phi-tai-hong': 'ผีตายโหง', 'phi-dek': 'ผีเด็ก', 'vengeful': 'วิญญาณแก้แค้น',
};
const STORY_TYPE_MAP = {
  'rule-of-horror': 'Rule of Horror (สยองขวัญจิตวิทยา)',
  'thai-legend': 'ตำนานผีไทย', 'folk-ghost': 'ผีชาวบ้าน',
  'modern-ghost': 'ผีสมัยใหม่', 'mixed': 'ผสมผสาน',
};
const SETTING_MAP = {
  'rural-village': 'หมู่บ้านชนบท', 'city': 'ในเมือง/กรุงเทพ',
  'forest': 'ป่า/ภูเขา', 'river': 'ริมน้ำ/แม่น้ำ',
  'temple': 'วัดร้าง', 'abandoned-house': 'บ้านร้าง',
  'hospital': 'โรงพยาบาล', 'school': 'โรงเรียน',
};
const GENDER_MAP = { male: 'ชาย', female: 'หญิง', other: 'ไม่ระบุเพศ' };
const WORD_COUNT_MAP = { '10': 1000, '15': 1500, '20': 2000, '30': 3000, '60': 6000 };

function buildPrompt(p) {
  const wordCount = WORD_COUNT_MAP[p.storyLength] || 1500;
  return `เขียนเรื่องเล่าผีไทยในสไตล์ตี๋น้อย Teenoihub:

ประเภทเรื่อง: ${STORY_TYPE_MAP[p.storyType] || p.storyType}
ประเภทผี: ${GHOST_TYPE_MAP[p.ghostType] || p.ghostType}
ตัวละครหลัก:
  - ชื่อ: ${p.generateName ? 'คิดชื่อภาษาไทยที่เหมาะสมเอง' : p.characterName}
  - อายุ: ${p.characterAge} ปี
  - เพศ: ${GENDER_MAP[p.characterGender] || p.characterGender}
  - อาชีพ: ${p.characterJob}
ฉากหลัง: ${SETTING_MAP[p.setting] || p.setting}
ความยาว: ประมาณ ${wordCount} คำ (${p.storyLength} นาที)
${p.additionalDetails ? `รายละเอียดพิเศษ: ${p.additionalDetails}` : ''}

เขียนให้ครบ: intro ทักทาย → warm-up → เนื้อเรื่อง → outro กล่าวลา`;
}

function openaiRequest(messages, maxTokens) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: maxTokens,
      temperature: 0.9,
    });

    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 400) {
            reject(new Error(parsed.error?.message || `HTTP ${res.statusCode}`));
          } else {
            resolve(parsed.choices[0]?.message?.content || '');
          }
        } catch (e) {
          reject(new Error(`Parse error: ${data.slice(0, 200)}`));
        }
      });
    });

    req.on('error', (e) => reject(new Error(`HTTPS error: ${e.message}`)));
    req.setTimeout(120000, () => { req.destroy(); reject(new Error('Request timeout')); });
    req.write(body);
    req.end();
  });
}

app.get('/api/health', async (req, res) => {
  try {
    const text = await openaiRequest([{ role: 'user', content: 'say ok' }], 5);
    res.json({ status: 'ok', openai: 'connected', reply: text });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/api/generate-story', async (req, res) => {
  try {
    const wordCount = WORD_COUNT_MAP[req.body.storyLength] || 1500;
    const maxTokens = Math.min(wordCount * 3, 16000);
    const text = await openaiRequest(
      [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildPrompt(req.body) },
      ],
      maxTokens
    );
    res.json({ text });
  } catch (err) {
    console.error('OpenAI error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Teenoihub running on port ${PORT}`);
});
