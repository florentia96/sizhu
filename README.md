# ปาจื้อ · 八字 — ดูดวงสี่เสา (BaZi / Four Pillars)

เว็บแอปดูดวงจีน "ปาจื้อ" แปลงวัน-เวลาเกิดเป็นผังสี่เสา แล้ววิเคราะห์เป็นธาตุประจำตัว, สมดุลห้าธาตุ, สิบเทพ, ก้านซ่อน, 納音, สิบสองช่วงชีวิต (長生), ช่องว่าง (空亡), ดาวสัญลักษณ์ (神煞), ปฏิสัมพันธ์ระหว่างเสา (冲合刑害 และ 三合/三會/五合), ของมงคล/อาชีพ และดวงรอบ 10 ปี (ต้าอวิ้น)

**คำนวณในเครื่องผู้ใช้ 100% — ไม่มี backend ไม่ส่งข้อมูลวันเกิดออกนอกเครื่อง** (ฟอนต์โหลดจาก Google Fonts หากออฟไลน์จะใช้ฟอนต์ระบบแทน)

🔮 **Live:** https://florentia96.github.io/sizhu/

## Stack

Vite · React · TypeScript · zod · Vitest

## โครงสร้าง (แยกชั้น engine → content → reading → UI)

| โฟลเดอร์ | หน้าที่ |
|---|---|
| `src/engine/` | เครื่องคำนวณบริสุทธิ์ — `constants.ts` (กฎคงที่), `policy.ts` (นโยบายปรับได้), `astro.ts`, `bazi.ts` |
| `src/content/` | ถ้อยคำไทย (`th.json`) + zod schema คุมความครบ |
| `src/lib/` | `reading.ts` (ประกอบคำอ่าน), `validate.ts` (guard input) |
| `src/tokens/` | design tokens (สี/ฟอนต์) |
| `src/components/`, `src/screens/` | UI |
| `test/` | ชุดทดสอบ |

## คำสั่ง

```bash
npm install
npm run dev        # dev server
npm run build      # production build → dist/
npm test           # รันเทสต์ทั้งหมด
npm run typecheck  # ตรวจชนิดข้อมูล
npm run lint       # eslint
```

## ความถูกต้อง

- สี่เสาตรงกับไลบรารีดาราศาสตร์ **sxtwl ครบ 12/12 เคส** (`test/pillars.test.ts`)
- ส่วนเวลาสุริยคติตรวจแยกอิสระจาก sxtwl: LMT ถูกโดยนิยาม + EoT เทียบค่า NOAA (`test/solar.test.ts`)
- `buildReading` ผ่าน sweep 2,000 ดวง ไม่มี field หาย (`test/reading.test.ts`)
- master data (藏干 / 神煞 / 納音 / 長生 / 三合 ฯลฯ) ล็อกด้วยเทสต์เทียบตำรา (`test/masterdata.test.ts`)

## ข้อจำกัด (heuristic — ใช้เป็นกรอบ ไม่ใช่คำตัดสิน)

- `strength` / 用神 / `startAge` เป็นค่าประมาณ
- เฮ่ง (刑) ครบชุด (子卯 互刑 + 寅巳申 + 丑戌未 三刑 + 自刑)
- ยังไม่รวม 流年 (ดวงรายปี) และ 格局 (โครงสร้างดวง — ต้องตีความเชิงลึก ไม่ใช่ deterministic)
- สำนักเวลาจื่อ ดีฟอลต์ late-zi (晚子時) · รองรับ early-zi (早子時 เลื่อนเสาวันช่วง 23:00–24:00) ปรับที่ `ZI_SCHOOL` ใน `src/engine/policy.ts` หรือส่ง `zi` ใน `ComputeInput`
- `useSolar` ปรับเวลาสุริยคติเฉพาะการ "เลือกยาม" — ปี/เดือนใช้ลองจิจูดดวงอาทิตย์จริง เสาวันยึดวันที่ปฏิทิน คนเกิดใกล้เที่ยงคืน ~±20 นาที (เท่า solarShift กรุงเทพ) ยามอาจขยับแต่เสาวันไม่ขยับ
- ปาจื้อเป็นกรอบอ้างอิงเชิงสัญลักษณ์ เรื่องสุขภาพเป็นคติโบราณ ไม่ใช่คำวินิจฉัยทางการแพทย์

## License

MIT — ดู [LICENSE](./LICENSE)
