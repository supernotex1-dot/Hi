require('dotenv').config();
const express = require('express');
const Groq = require('groq-sdk');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.GROQ_API_KEY) {
  console.error('ERROR: GROQ_API_KEY is not set.');
  process.exit(1);
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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
const WORD_COUNT_MAP = { '10': 1000, '15': 1500, '20': 2000, '30': 3000 };

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

app.post('/api/generate-story', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();
  const send = (d) => { res.write(`data: ${JSON.stringify(d)}\n\n`); };

  try {
    const stream = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildPrompt(req.body) },
      ],
      stream: true,
      max_tokens: 8000,
    });

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || '';
      if (text) send({ text });
    }

    send({ done: true });
    res.end();
  } catch (err) {
    send({ error: err.message });
    res.end();
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Teenoihub running on port ${PORT}`);
});
