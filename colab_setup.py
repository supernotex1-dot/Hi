"""
====================================================
  Teenoihub Ghost Stories — Colab Setup Script
  วิธีใช้: copy ทั้งไฟล์นี้ไปใส่ใน Colab cell เดียว
====================================================
"""

import subprocess, sys, os, time

# ── 1. ติดตั้ง pyngrok ──────────────────────────────
print("📦 กำลังติดตั้ง pyngrok...")
subprocess.run([sys.executable, "-m", "pip", "install", "pyngrok", "-q"])
from pyngrok import ngrok

# ── 2. เช็คว่าอยู่ในโฟลเดอร์ Hi หรือเปล่า ──────────
cwd = os.getcwd()
if not cwd.endswith('/Hi'):
    print("❌ ยังไม่ได้เข้าโฟลเดอร์ Hi")
    print("   รัน: !git clone https://github.com/supernotex1-dot/Hi.git")
    print("   แล้ว: %cd Hi")
    sys.exit(1)

print(f"✅ อยู่ที่: {cwd}")

# ── 3. ขอ Gemini API Key ────────────────────────────
print("\n" + "="*50)
print("🔑 ขอ Gemini API Key ฟรีได้ที่: aistudio.google.com")
print("   1. เข้า aistudio.google.com")
print("   2. กด 'Get API Key' มุมบนขวา")
print("   3. กด 'Create API key'")
print("   4. Copy key มาวางด้านล่าง")
print("="*50)
GEMINI_KEY = input("\n📋 วาง Gemini API Key ที่นี่: ").strip()

if not GEMINI_KEY or len(GEMINI_KEY) < 20:
    print("❌ API Key ดูไม่ถูกต้อง ลองใหม่อีกครั้ง")
    sys.exit(1)

# ── 4. สร้างไฟล์ .env ───────────────────────────────
with open('.env', 'w') as f:
    f.write(f'GEMINI_API_KEY={GEMINI_KEY}\n')
    f.write('PORT=3000\n')
print("✅ สร้างไฟล์ .env แล้ว")

# ── 5. ติดตั้ง Node.js dependencies ────────────────
print("\n📦 กำลัง npm install...")
result = subprocess.run(["npm", "install"], capture_output=True, text=True)
if result.returncode != 0:
    print("❌ npm install ล้มเหลว:", result.stderr)
    sys.exit(1)
print("✅ npm install สำเร็จ")

# ── 6. ขอ ngrok Auth Token (ถ้ามี) ─────────────────
print("\n" + "="*50)
print("🔑 ngrok Auth Token (สมัครฟรีที่ dashboard.ngrok.com)")
print("   ถ้าไม่มีกด Enter ข้ามได้ (อาจมีปัญหา session หมดเวลา)")
print("="*50)
NGROK_TOKEN = input("\n📋 วาง ngrok token (หรือกด Enter ข้าม): ").strip()

if NGROK_TOKEN:
    ngrok.set_auth_token(NGROK_TOKEN)
    print("✅ ตั้ง ngrok token แล้ว")

# ── 7. หยุด server เก่า ──────────────────────────────
subprocess.run(["pkill", "-f", "node"], capture_output=True)
time.sleep(1)

# ── 8. รัน server ────────────────────────────────────
print("\n🚀 กำลังรัน server...")
proc = subprocess.Popen(
    ["node", "server.js"],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE
)
time.sleep(3)

# เช็คว่า crash หรือเปล่า
if proc.poll() is not None:
    err = proc.stderr.read().decode()
    print("❌ Server หยุดทำงาน:")
    print(err)
    sys.exit(1)

print("✅ Server รันอยู่แล้ว")

# ── 9. เปิด ngrok tunnel ─────────────────────────────
try:
    url = ngrok.connect(3000)
    print("\n" + "="*50)
    print(f"🎉 เปิดเว็บได้ที่: {url}")
    print("="*50)
except Exception as e:
    print(f"❌ ngrok ล้มเหลว: {e}")
    print("   ลองสมัคร ngrok free account แล้วใส่ token ด้านบน")
