# MooDee · มูดีย์ — ดูดวงครบ จบในที่เดียว

เว็บแอปรวม **22 บริการพยากรณ์ที่คำนวณได้จริง** ใน 5 หมวด — เลขศาสตร์ นามศาสตร์ โหราศาสตร์ ศาสตร์จีน (ปาจื้อ) และความเชื่อไทย — ภายใต้ดีไซน์ "ฟ้าอรุณ" (Dawn Aurora) ชุดเดียว สลับโหมดสว่าง/มืดได้

**คำนวณในเครื่องผู้ใช้ 100% — ไม่มี backend ไม่ส่งข้อมูลวันเกิดออกนอกเครื่อง** (ฟอนต์โหลดจาก Google Fonts หากออฟไลน์จะใช้ฟอนต์ระบบแทน)

🔮 **Live:** https://florentia96.github.io/sizhu/

## Stack

Vite 5 · React 18 · TypeScript · zod · Vitest
`astronomy-engine` (ตำแหน่งดาวจริง offline) · `lunar-javascript` (oracle เทียบสี่เสาตอนเทสต์)

## 22 บริการ (5 หมวด)

| หมวด | services |
|---|---|
| **數 ตัวเลขมงคล** (`numbers`) | เบอร์โทร · ทะเบียนรถ · เลขบัตร/บ้าน/บัญชี · ค้นหาเลขมงคล · ตรวจเกรดเลข |
| **名 ชื่อมงคล** (`names`) | วิเคราะห์ชื่อ · ตั้งชื่อ · อักษรกาลกิณี (ทักษา) |
| **星 โหราศาสตร์** (`astro`) | ดวงกำเนิด · ลัคนา & ราศีจันทร์ · เลข 7 ตัว 9 ฐาน · กราฟชีวิต · ดวงสมพงษ์ · ฤกษ์ยาม |
| **緣 ศาสตร์จีน** (`chinese`) | ปาจื้อสี่เสา · ปีนักษัตร & ธาตุ · เลขกัว & ทิศมงคล · คู่นักษัตร |
| **卦 ดวงประจำวัน & ไทย** (`daily`) | ดวงประจำวันเกิด · ราศีเกิด · สีมงคล · ทำนายฝัน |

ทุกบริการ deterministic (input เดิม → output เดิม) บริการที่อิง "ปีนี้/วันนี้" (personal year, ดาวจร, ฤกษ์ยาม) รับเวลาอ้างอิงเป็น input เพื่อให้เทสต์ตรึงผลได้

## โครงสร้าง

```
src/
  app/          router shell · usePathRoute · routes.ts · feature.ts (ชนิดกลาง) · registry.ts (auto-discover)
  features/<id>/ meta.ts · fields.ts · engine.ts (build(vals)→Section[]) · content.ts · index.ts (FeatureDef)
  shared/
    sections/   Section union (สัญญากลาง) + zod schema + SectionRenderer + การ์ด 9 ชนิด
    forms/      FieldRenderer · CityField · useFormRefs (อ่านค่าแบบ uncontrolled)
    layout/     FeatureFlow (หน้า detail ของทุกฟีเจอร์)
    theme/      tokens.css — design tokens ฟ้าอรุณ light/dark จุดเดียวทั้งเว็บ
  astro/        ephemeris · cities · houses (Placidus + ลัคนา) · aspects — ใช้โดยหมวด astro
  hub/          HubScreen · 5 หมวด · search · การ์ดโปรไฟล์/ดวงวันนี้
  engine/ lib/ content/ components/ screens/   BaZi เดิม (frozen — ดู §ความถูกต้อง)
```

หัวใจคือ **Section contract** (`src/shared/sections/types.ts`): engine ทุกตัวคืน `Section[]` (kind = `verdict` `rows` `blocks` `grid` `cards` `swatches` `prose` `compat` `note`) แล้ว `SectionRenderer` map เป็นการ์ด — UI กับ engine จึงแยกขาดกัน เพิ่มฟีเจอร์ใหม่ = drop โฟลเดอร์ใน `src/features/` แล้ว registry เก็บอัตโนมัติ

## คำสั่ง

```bash
npm install
npm run dev        # dev server
npm run build      # tsc -b && vite build → dist/ (+ prerender SEO ราย feature)
npm test           # รันเทสต์ทั้งหมด (vitest)
npm run typecheck  # tsc -b --noEmit
npm run lint       # eslint
npm run gen:vectors  # สร้าง/ตรวจ test vectors สี่เสาจาก oracle อิสระ
```

## Routing & SEO

- path-based router (`src/app/routes.ts`) บน base `/sizhu/` — `/` (hub) · `/f/<id>` (detail) · `/bazi` (ปาจื้อเต็มจอ) · `/ds`
- deploy static (GitHub Pages): `vite-seo-plugin.ts` prerender หน้า `.html` ราย feature + `sitemap.xml` + `robots.txt` + `404.html` (SPA fallback) จาก `meta.ts` เป็น source of truth เดียว
- `index.html` มี anti-flash script คืนธีมก่อน paint แรก (localStorage `moodee-theme` > ค่าระบบ > light)

## ความถูกต้อง

- ปาจื้อ (`bazi`) เป็น engine ที่ลึกสุดและถูก **frozen** — สี่เสาตรงกับไลบรารีดาราศาสตร์ **sxtwl ครบ 12/12 เคส** (`test/pillars.test.ts`) ห้ามแก้ logic/ค่าคาลิเบรตเสาวัน
- ส่วนเวลาสุริยคติตรวจแยกอิสระ: LMT ถูกโดยนิยาม + EoT เทียบ NOAA (`test/solar.test.ts`)
- master data สี่เสา (藏干 / 神煞 / 納音 / 長生 / 三合 ฯลฯ) ล็อกด้วยเทสต์เทียบตำรา (`test/masterdata.test.ts`)
- ทุก feature engine ต้องผ่าน `ReportSchema.parse(build(vals))` (zod) — output ผิดรูป = เทสต์แดง
- astro เทียบดวงอ้างอิงตาม tolerance (ลัคนา/ตำแหน่งดาว)
- CI (`.github/workflows/ci.yml`): typecheck → lint → test → build แล้ว deploy เฉพาะ `main` ที่เขียวทั้งหมด

## ข้อจำกัด (heuristic — ใช้เป็นกรอบ ไม่ใช่คำตัดสิน)

- ผลพยากรณ์เป็นกรอบอ้างอิงเชิงสัญลักษณ์ตามตำรา ไม่ใช่คำพยากรณ์ตายตัว · `dream`/`findlucky` เพื่อความบันเทิง โปรดเล่นอย่างมีสติ
- เรื่องสุขภาพในปาจื้อเป็นคติโบราณ ไม่ใช่คำวินิจฉัยทางการแพทย์
- ปาจื้อ: `strength` / 用神 / `startAge` เป็นค่าประมาณ · ยังไม่รวม 流年 (ดวงรายปี) และ 格局 · ดีฟอลต์ late-zi (晚子時) ปรับที่ `ZI_SCHOOL` ใน `src/engine/policy.ts`
- astro: timezone ใช้ standard offset ของเมือง (ไทย +7) — ไม่ครอบคลุม DST/historical-tz · เมืองนอก dataset กรอก lat/lon เองได้

## License

MIT — ดู [LICENSE](./LICENSE)
