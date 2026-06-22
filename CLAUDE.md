# CLAUDE.md

MooDee (มูดีย์) — เว็บรวม 22 บริการพยากรณ์ที่คำนวณได้จริง คำนวณในเครื่อง 100% ไม่มี backend
Vite 5 + React 18 + TypeScript + zod + Vitest · deploy เป็น static บน GitHub Pages (`/sizhu/`)

## Commands

```bash
npm run dev          # dev server
npm test             # vitest run (ทั้งหมด)
npm run test:watch   # vitest watch
npm run typecheck    # tsc -b --noEmit
npm run lint         # eslint
npm run build        # tsc -b && vite build → dist/ (+ prerender SEO)
npm run gen:vectors  # regen/ตรวจ test vectors สี่เสาจาก oracle อิสระ (lunar-javascript)
```

รัน npm/git/npx ผ่าน **PowerShell** บนเครื่องนี้ (Bash tool โยน cygwin error)

## สถาปัตยกรรม

แยกขาด **engine (คำนวณบริสุทธิ์) ↔ UI (เรนเดอร์)** ผ่านสัญญากลาง `Section`:

- `src/app/feature.ts` — ชนิดกลาง: `Field`, `FeatureMeta`, `FeatureEngine`, `GroupId`, `FeatureDef`
- `src/app/registry.ts` — auto-discover `features/*/index.ts` ด้วย `import.meta.glob` → `FEATURES` (ไม่ต้องลงทะเบียนมือ)
- `src/shared/sections/types.ts` — **Section union + zod `ReportSchema`** (สัญญากลาง ทุก engine ยึด)
- `src/shared/sections/SectionRenderer.tsx` — switch ตาม `kind` → การ์ด 9 ชนิดใน `cards/`
- `src/shared/forms/` — `FieldRenderer` (render ตาม field type) · `CityField` · `useFormRefs` (อ่านค่าแบบ uncontrolled ตอนกดปุ่ม)
- `src/shared/layout/FeatureFlow.tsx` — หน้า detail ของทุกฟีเจอร์ (ยกเว้น bazi)
- `src/astro/` — `ephemeris` `cities` `houses` (Placidus + ลัคนา) `aspects` — ใช้โดยหมวด `astro` เท่านั้น
- `src/hub/` — HubScreen + 5 หมวด + search
- `src/engine/ lib/ content/ components/ screens/` — **BaZi เดิม (frozen)** route `/bazi` ผ่าน `screens/BaziApp.tsx` ไม่ผ่าน Section

routing เป็น **path-based** (`src/app/routes.ts`, `usePathRoute`) ไม่ใช่ hash — `/` · `/f/<id>` · `/bazi` · `/ds`

## เพิ่มฟีเจอร์ใหม่ (สูตรซ้ำ)

สร้าง `src/features/<id>/` ให้มี:
1. `meta.ts` — `{ id, name, cn, desc, long }` (ค่าเป็น string literal ตรง ๆ — `vite-seo-plugin.ts` regex-parse ไฟล์นี้ตอน build)
2. `fields.ts` — `Field[]` (ลำดับ field = ลำดับ index ของ `vals` ที่เข้า engine)
3. `engine.ts` — `export const engine: FeatureEngine = { build(vals: string[]): Section[] }`
4. `content.ts` — ตารางถ้อยคำ (data only)
5. `index.ts` — `export const def: FeatureDef = { meta, group, fields, engine }`
6. `engine.test.ts` — determinism + `ReportSchema.parse(build(vals))` ผ่าน + reference vectors

registry เก็บให้อัตโนมัติ · `group` ∈ `numbers | names | astro | chinese | daily`

สัญญาที่ `registry.ts` บังคับจริงคือ **`index.ts` export `def: FeatureDef` + มี `meta.id`** เท่านั้น — ชื่อ export อื่น (`meta`/`engine`/`fields`) และการแยก `content.ts` เป็น convention ที่ปรับได้ (`bazi` มีแค่ 3 ไฟล์ `fields:[]` inline + `fullRoute:true`)

## กฎที่ห้ามแหก

- **engine บริสุทธิ์ + deterministic** — ห้ามแตะ DOM/network ห้ามเรียก `Date.now()` ลอย ๆ ในชั้นคำนวณแกน ฟีเจอร์ที่อิงเวลาปัจจุบันรับ "now" ผ่าน `vals`/param ที่ inject ได้ (กันเทสต์ลอย)
- **input ผิด/ไม่ครบ → คืน `[{ kind:"note", text:"..." }]`** ไม่ throw หลุดถึง UI
- **BaZi frozen** — ห้ามแก้ logic `src/engine/bazi.ts` หรือค่าคาลิเบรตเสาวัน (offset 49) · 12/12 sxtwl vectors (`test/pillars.test.ts`) ต้องเขียวเสมอ · reskin = แก้ CSS เท่านั้น
- **theme = tokens อย่างเดียว** — สี/ฟอนต์/เงา/รัศมีอ้าง `var(--...)` จาก `src/shared/theme/tokens.css` ห้าม hardcode hex (จะพังตอนสลับ light/dark)
- **ห้ามเพิ่ม dependency** เว้นจำเป็นจริง — ทุกอย่างคำนวณในเครื่อง offline
- การ์ดผลลัพธ์ห้าม animate แบบเริ่ม `opacity:0` (เคยทำให้ผลไม่โผล่ตอน tab ไม่ focus) — ใช้ IntersectionObserver ถ้าจำเป็น

## ถ้อยคำผู้ใช้ (copy)

- ภาษาไทยที่คนหมู่มากเข้าใจ — เลี่ยงศัพท์เฉพาะกลุ่มแคบ (เช่น ลิ่บชุน) ใช้คำสามัญ + วันที่ชัดเจน
- เสียงระบบ **ไม่มีเพศ** — ห้ามใช้คำลงท้าย ครับ/ค่ะ/คะ/นะคะ
- โครงสร้าง/label เป็นอังกฤษได้ ประโยคเป็นไทย · ใส่วรรณยุกต์/สระให้ครบเสมอ

## เทสต์ & verify ก่อนปิดงาน

ก่อนบอกว่าเสร็จ ต้องรันให้เขียวจริง:
```bash
npm run typecheck && npm run lint && npm test && npm run build
```
- ทุก engine ผ่าน `ReportSchema` (zod)
- BaZi 12/12 เป็น gate — รันก่อน/หลังทุกการแตะที่เกี่ยวข้อง
- ไม่มี Playwright — visual-verify ด้วย Edge headless screenshot dev server (seed localStorage profile เพื่อเข้าหน้า result)
