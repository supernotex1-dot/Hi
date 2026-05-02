require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('ERROR: ANTHROPIC_API_KEY is not set. Copy .env.example to .env and add your key.');
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const SYSTEM_PROMPT = `คุณคือ "ตี๋น้อย" เจ้าของช่อง YouTube "Teenoihub" ผู้เชี่ยวชาญเรื่องเล่าผีไทยและนักเขียนสยองขวัญมือฉมัง

บุคลิกตี๋น้อย:
- เป็นกันเอง อบอุ่น มีเสน่ห์ในการเล่าเรื่อง
- รักและภูมิใจในวัฒนธรรมตำนานผีไทย
- เชี่ยวชาญ Rule of Horror อย่างแท้จริง
- น้ำเสียงในการเล่า: ดึงดูด ลึกลับ สร้างบรรยากาศ

รูปแบบเรื่องเล่าของตี๋น้อย (ต้องมีครบ):

1. INTRO ทักทาย:
เริ่มด้วย "สวัสดีครับ ผมตี๋น้อย จาก Teenoihub" จากนั้น warm-up สั้นๆ ประมาณ 2-3 ย่อหน้า เกริ่นถึงเรื่องที่จะเล่า สร้างบรรยากาศก่อนเข้าเรื่อง ทำให้คนฟังรู้สึกสบายใจแต่ก็เริ่มตื่นเต้นแล้ว

2. เนื้อเรื่องหลัก:
เล่าเรื่องด้วยภาษาไทยกลาง อ่านง่าย มีชีวิตชีวา สร้าง atmosphere อย่างจริงจัง

3. OUTRO กล่าวลา:
จบเรื่องด้วยข้อคิดหรือบทเรียนสั้นๆ แล้วกล่าวลาอบอุ่น เช่น "สวัสดีครับ อย่าลืม subscribe Teenoihub นะครับ แล้วพบกันใหม่..."

Rule of Horror ที่ต้องใช้เสมอ:
- Less is more: ไม่อธิบายผีให้ครบ ปล่อยให้จินตนาการเติม
- Build tension อย่างช้าๆ ก่อน payoff
- ใช้รายละเอียดธรรมดาที่กลายเป็นน่ากลัว (เสียงก้าวเท้า กลิ่นดอกไม้ตอนกลางคืน ประตูที่เปิดเอง)
- Sound design: เสียงเงียบ เสียงกิ่งไม้ เสียงก้าวเท้า มีพลังมากกว่า jump scare
- ตัวละครต้องมีชีวิต รู้สึกได้ว่าเป็นคนจริงๆ
- อย่าอธิบาย twist โดยตรง ให้ค้างคาใจ

ห้าม:
- ใช้ภาษาอังกฤษในเนื้อเรื่อง (ยกเว้น proper noun ที่จำเป็น)
- เล่าแบบแห้งๆ ขาด atmosphere
- ใส่ asterisk **bold** หรือ markdown formatting ใดๆ ในเนื้อเรื่อง
- เขียน heading หรือ section title ในเรื่อง`;

const GHOST_TYPE_MAP = {
  'ai-choose': 'ให้เลือกผีที่เหมาะสมกับเรื่องเองตามดุลพินิจ',
  'mae-nak': 'แม่นาคพระโขนง (วิญญาณภรรยาผู้ซื่อสัตย์)',
  'krasue': 'กระสือ (หัวลอยพร้อมเครื่องในกลางคืน)',
  'phi-pop': 'ผีปอบ (ผีที่สิงร่างและกินเครื่องใน)',
  'nang-tani': 'นางตานี (ผีนางในต้นกล้วย)',
  'nang-takian': 'นางตะเคียน (วิญญาณในต้นตะเคียน)',
  'phi-tai-hong': 'ผีตายโหง (ผีที่ตายอย่างน่าสยดสยอง)',
  'phi-dek': 'ผีเด็ก (วิญญาณเด็กที่ยังเร่ร่อน)',
  'vengeful': 'วิญญาณแก้แค้น (มาเพื่อแก้แค้นผู้ทำร้าย)',
};

const STORY_TYPE_MAP = {
  'rule-of-horror': 'Rule of Horror (สยองขวัญจิตวิทยา สร้าง tension ช้าๆ ใช้ความไม่รู้เป็นอาวุธ)',
  'thai-legend': 'ตำนานผีไทย (อิงตำนานและความเชื่อดั้งเดิมของไทยอย่างเคร่งครัด)',
  'folk-ghost': 'ผีชาวบ้าน (เรื่องเล่าพื้นบ้าน บรรยากาศชนบท เรียบง่ายแต่น่ากลัว)',
  'modern-ghost': 'ผีสมัยใหม่ (ผีในยุคปัจจุบัน เมือง อาคาร ห้องพัก)',
  'mixed': 'ผสมผสาน (รวมหลายสไตล์อย่างกลมกลืน)',
};

const SETTING_MAP = {
  'rural-village': 'หมู่บ้านชนบท (ทุ่งนา บ้านเก่า ป่าไผ่ ความเงียบสงัด)',
  'city': 'ในเมือง/กรุงเทพ (ตึกสูง ห้องพัก คอนโด ความโดดเดี่ยวท่ามกลางผู้คน)',
  'forest': 'ป่า/ภูเขา (ป่าลึก ถ้ำ ทางเดินเขา ห่างไกลผู้คน)',
  'river': 'ริมน้ำ/แม่น้ำ (ริมคลอง แม่น้ำ เรือ ความมืดของน้ำ)',
  'temple': 'วัดร้าง (วัดโบราณ สุสาน ศาลเพียงตา บรรยากาศขมุกขมัว)',
  'abandoned-house': 'บ้านร้าง (บ้านเก่า คฤหาสน์รกร้าง กลิ่นอับ ความเงียบ)',
  'hospital': 'โรงพยาบาล (โรงพยาบาลเก่า ห้องผ่าตัด ห้องดับจิต)',
  'school': 'โรงเรียน/มหาวิทยาลัย (ตึกเก่า ห้องน้ำ ห้องเรียนหลังเลิกเรียน)',
};

const GENDER_MAP = { male: 'ชาย', female: 'หญิง', other: 'ไม่ระบุเพศ' };
const WORD_COUNT_MAP = { '10': 1000, '15': 1500, '20': 2000, '30': 3000 };

function buildPrompt(params) {
  const { storyType, ghostType, characterName, generateName, characterAge, characterGender, characterJob, setting, storyLength, additionalDetails } = params;
  const wordCount = WORD_COUNT_MAP[storyLength] || 1500;

  return `เขียนเรื่องเล่าผีไทยในสไตล์ตี๋น้อย Teenoihub ด้วยข้อมูลต่อไปนี้:

ประเภทเรื่อง: ${STORY_TYPE_MAP[storyType] || storyType}
ประเภทผี: ${GHOST_TYPE_MAP[ghostType] || ghostType}
ตัวละครหลัก:
  - ชื่อ: ${generateName ? 'คิดชื่อภาษาไทยที่เหมาะสมเองตามอัธยาศัย' : characterName}
  - อายุ: ${characterAge} ปี
  - เพศ: ${GENDER_MAP[characterGender] || characterGender}
  - อาชีพ: ${characterJob}
ฉากหลัง: ${SETTING_MAP[setting] || setting}
ความยาว: ประมาณ ${wordCount} คำ (เหมาะสำหรับอ่าน/เล่า ${storyLength} นาที)
${additionalDetails ? `รายละเอียดพิเศษ: ${additionalDetails}` : ''}

เขียนให้ครบ: intro ทักทาย → warm-up สร้างบรรยากาศ → เนื้อเรื่องสยองขวัญ → outro กล่าวลา
ใช้ Rule of Horror อย่างเต็มที่ และเขียนเป็นภาษาไทยล้วนๆ ห้ามใช้ markdown formatting`;
}

app.post('/api/generate-story', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);

  try {
    const prompt = buildPrompt(req.body);

    const stream = anthropic.messages.stream({
      model: 'claude-opus-4-7',
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    stream.on('text', (text) => sendEvent({ text }));
    stream.on('finalMessage', () => {
      sendEvent({ done: true });
      res.end();
    });
    stream.on('error', (err) => {
      sendEvent({ error: err.message });
      res.end();
    });
  } catch (err) {
    sendEvent({ error: err.message });
    res.end();
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Teenoihub Ghost Stories running at http://localhost:${PORT}`);
  console.log(`เข้าจาก IP อื่นได้ที่ http://<your-ip>:${PORT}`);
});
