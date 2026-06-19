# MooDee — เว็บรวมศาสตร์พยากรณ์ (Multi-Fortune Platform) · Design Spec

วันที่: 2026-06-19
สถานะ: approved design → รอ writing-plans
ฐานโค้ด: `sizhu` (Vite + React 18 + TypeScript + zod, client-side, offline 100%)

---

## 1. เป้าหมาย

ขยายเว็บจาก "ดูดวง BaZi อย่างเดียว" → แพลตฟอร์มรวม **22 บริการพยากรณ์ที่คำนวณได้** ใน 5 หมวด ภายใต้
ดีไซน์ "ราตรีมงคล" (MooDee dark mystical) ชุดเดียว โดย:

1. นำ **BaZi engine ที่เสร็จแล้ว** (frozen) มา wire เข้าธีม/แพลตฟอร์มใหม่ — **UI เปลี่ยนได้ UX ห้ามเปลี่ยน**
2. อีก 21 ฟีเจอร์ → คำนวณจริงด้วย **วิธีที่นิยมที่สุดของแต่ละศาสตร์** ผลลัพธ์ละเอียดสุดเท่าที่คำนวณได้
3. ทำพร้อมกันแบบขนาน (subagent / feature) โดยคุม theme/UX ให้เป็นภาษาเดียว แล้วตรวจความถูกต้องทั้งหมด

หลักการคุมคุณภาพงานขนาน: **freeze "สัญญา" (contract) ก่อน fan-out** — Section union + engine interface +
field schema + token model เป็นจุดเดียวที่ทุก subagent ต้องยึด มิฉะนั้นจะได้ 21 การตีความที่ไม่ตรงกัน

---

## 2. ขอบเขต (Scope)

### 2.1 ฟีเจอร์ทั้ง 22 (id → หมวด)

| หมวด (group) | สี accent | features (id) |
|---|---|---|
| `numbers` ตัวเลขมงคล | jade `#6cc18a` | `phone` · `license` · `idcard` · `findlucky` · `grader` |
| `names` ชื่อมงคล | gold `#d8a64a` | `nameanalyze` · `namesuggest` · `kalakini` |
| `astro` โหราศาสตร์ | star `#7da6d8` | `natal` · `ascendant` · `num7` · `lifegraph` · `compat` · `timing` |
| `chinese` ศาสตร์จีน | red `#e0584b` | `bazi` · `zodiacyear` · `kua` · `zodiaccompat` |
| `daily` ดวงประจำวัน/ไทย | amethyst `#c98ad8` | `birthday` · `rasi` · `luckycolor` · `dream` |

### 2.2 อยู่นอกขอบเขต (out of scope)

- backend / API / web search — **ทุกอย่างคำนวณในเครื่อง** (รวม ephemeris = bundle ในเครื่อง)
- บัญชีผู้ใช้ / persistence ฝั่งเซิร์ฟเวอร์ (ใช้ได้แค่ localStorage / query/hash param)
- timezone เชิงประวัติศาสตร์/DST แบบเต็ม (ดู §7.2 — ใช้ offset มาตรฐาน + หมายเหตุ)
- การ refactor / ย้าย BaZi engine (frozen — ดู §5.1)

### 2.3 การตัดสินใจที่ผู้ใช้เลือกแล้ว

> **ความลึกของ natal/ascendant = "เต็มที่สุด (ดาวจริง + เรือนชะตา)"** → bundle ephemeris offline +
> dataset พิกัดเมือง + จัดการ timezone ตอนเกิด → คำนวณตำแหน่งดาวจริง + เรือน + ลัคนา
> (พลอยทำให้ `lifegraph` ใช้ดาวจร (transit) จริงได้ด้วย)

---

## 3. สถาปัตยกรรม

### 3.1 เทคโนโลยี (คงของเดิม)

Vite + React 18 + TypeScript + zod — ไม่เปลี่ยน framework
เพิ่ม dependency เดียว: **`astronomy-engine`** (pure JS, MIT, offline) สำหรับตำแหน่งดาวใน `natal`/`ascendant`/`lifegraph`

### 3.2 Routing — hash router แบบเบา (ไม่เพิ่ม dependency)

`useHashRoute` hook + `routes.ts` (parse/build):

| route | หน้าจอ |
|---|---|
| `#/` | Hub (hero + 5 หมวด + search) |
| `#/f/<featureId>` | Detail 2-คอลัมน์ (ทุกฟีเจอร์ ยกเว้น bazi) |
| `#/bazi` (+ `?bd=YYYY-MM-DD&bt=HH:mm` optional) | BaZi เต็มจอ (form→casting→result) — prefill จาก param |
| `#/ds` | Design System (optional) |

เหตุผลไม่ใช้ react-router: ต้องการ lean/offline + ความซับซ้อนต่ำ · hash route กัน 404 เวลา deploy static (GitHub Pages)

### 3.3 โครงไฟล์

```
src/
  app/
    App.tsx              router shell: Header + Starfield + route switch
    routes.ts            parse/build hash routes
    useHashRoute.ts
  shared/
    theme/tokens.css     MooDee dark tokens (จุดเดียวของทั้งเว็บ)
    sections/
      types.ts           Section union (FROZEN) + SectionSchema (zod)
      SectionRenderer.tsx switch ตาม kind → การ์ด 1 แบบ/ชนิด
      Ring.tsx           SVG ring (verdict/compat)
      cards/             VerdictCard RowsCard BlocksCard GridCard CardsCard
                         SwatchesCard ProseCard CompatCard NoteCard
    forms/
      FieldRenderer.tsx  render field ตาม type — คุม UX picker (date/time)
      CityField.tsx      autocomplete พิกัดเมือง (ฟีเจอร์ astro)
      useFormRefs.ts     ref ต่อ field, อ่านค่าตอนกด (uncontrolled)
    layout/
      DetailLayout.tsx   2-col form(sticky)+result + empty state
    registry.ts          FEATURES: id → { meta, group, fields, engine }
    feature.ts           ชนิดกลาง: Field, FeatureMeta, FeatureEngine, GroupId
  features/
    <id>/
      meta.ts            FeatureMeta (name, cn, desc, long, group)
      fields.ts          Field[]
      engine.ts          build(vals: string[]): Section[]   ← deterministic, pure
      content.ts         ตารางถ้อยคำไทย (data only)
      engine.test.ts     determinism + schema + reference vectors
  astro/
    ephemeris.ts         wrap astronomy-engine → ลองจิจูดสุริยวิถี อาทิตย์/จันทร์/ดาว
    cities.ts            CITY[] → { name, lat, lon, tz }
    houses.ts            ลัคนา/MC จาก sidereal time + obliquity + Placidus cusps + ลัคนาโหราไทย
    aspects.ts           มุมสัมพันธ์ (conjunction/opposition/trine/square/sextile + orb)
  hub/
    HubScreen.tsx        hero + group sections + search results
  engine/  lib/  content/  components/  screens/  hooks/   ← BaZi เดิม (FROZEN)
```

> **BaZi เดิมไม่ย้าย** เพื่อให้ blast radius ต่อ test 12/12 = ศูนย์ (ดู §5.1) · `src/App.tsx` เดิม → กลายเป็น
> `src/screens/BaziApp.tsx` (ย้ายไฟล์เดียว, แก้ import เท่านั้น, ไม่แตะ logic) แล้ว mount เป็น route `#/bazi`

---

## 4. สัญญาที่ freeze (THE FROZEN CONTRACT) — หัวใจของ spec

ทุก subagent ยึดสัญญานี้ห้ามแก้ การแก้สัญญาต้องผ่านการรีวิวกลาง (ไม่ใช่ตัดสินใจใน feature folder)

### 4.1 Section union (`src/shared/sections/types.ts`)

ตรงกับ output ของ `moodee-lib.js` ทุก field → port engine เดิมได้แทบไม่มี friction

```ts
export type Tone = "good" | "warn" | "bad" | "info";

export type Section =
  | { kind: "verdict"; score: number; grade: string; gradeLabel: string;
      summary: string; meta?: string; accent?: string; hideRing?: boolean }
  | { kind: "rows"; title: string; glyph: string;
      items: { n: string; title: string; meaning: string; fg: string }[] }
  | { kind: "blocks"; title: string; glyph: string;
      items: { title: string; tag: string; accent: string; text: string; chips: string[] }[] }
  | { kind: "grid"; title: string; glyph: string; accent?: string;
      cells: { name: string; value: string; note?: string }[] }
  | { kind: "cards"; title: string; glyph: string; subtitle?: string; accent?: string;
      items: { value: string; badge?: string; note?: string }[] }
  | { kind: "swatches"; title: string; glyph: string; tag?: string; accent?: string; text?: string;
      items: { name: string; hex: string }[] }
  | { kind: "prose"; title: string; glyph: string; accent?: string;
      paras: { h?: string; t: string }[] }
  | { kind: "compat"; score: number; label: string; a: string; b: string; accent?: string;
      points: { title: string; meaning: string; fg: string }[] }
  | { kind: "note"; text: string };
```

โทนสี (มาตรฐานเดียวทั้งเว็บ): good `#6cc18a` · warn `#d8a64a` · bad `#e0584b` · info `#7da6d8`

### 4.2 zod SectionSchema (กัน engine drift — รันใน test/dev)

```ts
import { z } from "zod";
export const SectionSchema: z.ZodType<Section> = z.discriminatedUnion("kind", [ /* ...ทุก kind */ ]);
export const ReportSchema = z.array(SectionSchema).min(1);
```

ทุก `engine.test.ts` ต้อง assert ว่า `ReportSchema.parse(engine.build(sampleVals))` ผ่าน → output ผิดรูป = test แดงทันที

### 4.3 Field schema (`src/app/feature.ts`)

```ts
export type Field =
  | { label: string; type: "text" | "tel" | "date" | "time" | "month"; placeholder?: string }
  | { label: string; type: "select"; options: string[] }
  | { label: string; type: "textarea"; placeholder?: string }
  | { label: string; type: "city" };   // ใหม่: birthplace → CityField → resolve เป็นพิกัด
```

ลำดับ `Field[]` = ลำดับ `vals: string[]` ที่ส่งเข้า `engine.build` (ตรง index)

### 4.4 Feature interface + Registry

```ts
export type GroupId = "numbers" | "names" | "astro" | "chinese" | "daily";

export interface FeatureMeta {
  id: string;
  name: string;        // ชื่อไทย
  cn: string;          // อักษรจีนประจำฟีเจอร์ (ไอคอน)
  desc: string;        // คำโปรยสั้น (การ์ด hub)
  long: string;        // คำอธิบายยาว (หัว detail)
}

export interface FeatureEngine {
  /** บริสุทธิ์ · deterministic · ห้ามแตะ DOM/network · ห้ามพึ่งเวลาปัจจุบันในการคำนวณแกน
   *  (ฟีเจอร์ที่อิง "ปีปัจจุบัน" เช่น personal year/transit ต้องรับ now ผ่าน vals หรือ param ที่ inject ได้) */
  build(vals: string[]): Section[];
}

export interface FeatureDef {
  meta: FeatureMeta;
  group: GroupId;
  fields: Field[];
  engine: FeatureEngine;
  /** bazi เท่านั้น = true → การ์ด hub route ไป #/bazi ไม่ใช่ #/f/bazi */
  fullRoute?: boolean;
}

export const FEATURES: Record<string, FeatureDef>;   // registry.ts ประกอบจาก features/*
```

**กฎ determinism:** input เดิม → output เดิมเสมอ ฟีเจอร์ที่ต้องใช้ "วันนี้/ปีนี้" (personal year, transit,
timing เดือนปัจจุบัน) ต้องรับเวลาอ้างอิงเป็น input ที่ inject ได้ เพื่อให้ test ตรึงผลได้ (ไม่เรียก
`Date.now()` ลอย ๆ ในชั้นคำนวณแกน) — UI ฉีดวันจริงตอน runtime

---

## 5. UX ที่ freeze (ห้ามเปลี่ยน) — UI เปลี่ยนได้เท่านั้น

### 5.1 BaZi (ข้อจำกัดแข็ง)

- **engine `src/engine/bazi.ts` + test vectors 12/12 (sxtwl) ต้องเขียวตลอด** — reskin = แก้ markup/CSS เท่านั้น
  ห้ามแตะ logic engine, ห้ามแก้ค่าคาลิเบรตเสาวัน (offset 49)
- flow `paper(form) → casting → result(8 panels)` พฤติกรรมเท่าเดิมทุกอย่าง:
  เพศ segmented · ปุ่มตั้งค่าขั้นสูง (toggle) · checkbox สุริยคติ · ปุ่ม "เปิดดวงปาจื้อ" · casting skip · back
  · `prefers-reduced-motion` · PetalCanvas
- **เปลี่ยนเฉพาะสี/พื้นผิวของหน้าฟอร์ม** (paper → dark) — `ResultScreen` เป็น dark + starfield อยู่แล้ว
  surface ของการ reskin จึงเหลือหลัก ๆ แค่ `FormScreen.tsx`
- การ์ด `bazi` บน hub → route `#/bazi` ตรง (ฟีเจอร์เดียวที่ข้าม layout 2-col **โดยตั้งใจ**)
- รับ `?bd=&bt=` → prefill + เริ่มที่ casting (ข้ามหน้าฟอร์ม) เหมือน flow ของ template

### 5.2 Detail layout (ฟีเจอร์อื่นทั้งหมด — ตรงกับ template เป๊ะ)

- 2-คอลัมน์ `minmax(0,350px) minmax(0,1fr)` gap 22px — ฟอร์มซ้าย **sticky top:80px**, ผลขวา
- ปุ่มชาด "เปิดดูผลทำนาย" (พื้น `#b1352a` เงาล่าง `0 2px 0 #8a2820`, active `translateY(1px)`)
- อ่านค่าฟอร์มแบบ **uncontrolled (ref ต่อ field) อ่านตอนกดปุ่ม** ไม่ใช่ controlled
- empty state: กรอบ dashed + อักษรจีนจางของฟีเจอร์ ก่อนกดปุ่ม
- มือถือ: 2-col → 1-col ที่ ~720px (ฟอร์มขึ้นบน, ยกเลิก sticky)

### 5.3 FieldRenderer (คุม UX ที่ HANDOFF เตือน — บังคับทุกฟีเจอร์)

- `date`/`time`: คลิกทั้งกล่อง → `showPicker()` (pattern เดียวกับ FormScreen เดิม)
- `input/select/textarea`: `font-size:16px` (กัน iOS zoom) · `min-width:0; width:100%` (กันล้นจอ) ·
  `color-scheme:dark` · `body{overflow-x:hidden}`
- container max 1080px · ทุก grid ใช้ `auto-fill minmax()` · hero/หัวข้อใช้ `clamp()`

---

## 6. Theme / Design tokens (`shared/theme/tokens.css`) — MooDee ราตรีมงคล (ทั้งเว็บ รวม BaZi)

```
--bg #0e1116 · --bg-grad-top #1c2433 · --surface rgba(24,28,36,.72) · --surface-inset rgba(255,255,255,.03)
--border-gold rgba(216,166,74,.16) · --primary #b1352a · --primary-shadow #8a2820 · --primary-bright #e0584b
--gold #d8a64a · --jade #6cc18a · --star #7da6d8 · --ame #c98ad8
--text #e7dcc2 · --text-strong #f4ecd9 · --text-muted #b9b2a0 · --text-dim #8a8474 · --text-faint #6f6a5c
--radius-card 5px · --radius-input 4px · --shadow 0 10px 30px rgba(0,0,0,.4)
```

- พื้นหลัง radial `circle at 50% -8%, #1c2433 → #0e1116 52%` + starfield (twinkle 5s)
- ฟอนต์: Noto Serif SC (จีน/ตัวเลขเด่น) · Noto Serif Thai (หัวเรื่อง) · Noto Sans Thai (เนื้อความ)
  โหลดจาก Google Fonts + system fallback (degrade ออฟไลน์ได้)
- การ์ดผลลัพธ์ **ห้ามใช้ `fadeUp` animation แบบเริ่ม opacity:0** (เคยทำให้ผลไม่โผล่ตอน tab ไม่ focus) —
  ถ้าจะ animate ใช้ IntersectionObserver

---

## 7. โมดูลดาราศาสตร์ (`src/astro/`) — เพราะเลือก "เต็มที่สุด"

### 7.1 `ephemeris.ts`

wrap `astronomy-engine` → ลองจิจูดสุริยวิถี (ecliptic longitude) ของ อาทิตย์ · จันทร์ · พุธ · ศุกร์ · อังคาร ·
พฤหัส · เสาร์ (+ ราหู/มฤตยู ถ้าตำราต้องการ) ณ JD ที่กำหนด · คืนค่าเป็นองศา 0–360 + ราศี + องศาในราศี

### 7.2 `cities.ts`

dataset bundle ในเครื่อง: **77 จังหวัดไทย + เมืองใหญ่ของโลก (~150–200)** → `{ name, lat, lon, tz }`
- ไทย: tz = +7 เสมอ
- ต่างประเทศ: ใช้ **standard UTC offset** ของเมืองนั้น + หมายเหตุว่า DST/historical-tz ไม่ครอบคลุม
- CityField = autocomplete พิมพ์ชื่อเมือง → match → ได้พิกัด · มี fallback ให้กรอก lat/lon เองได้

### 7.3 `houses.ts`

- **ลัคนา (Ascendant) + MC**: จาก Local Sidereal Time (GMST จาก JD ที่ `astro.ts` มี + ลองจิจูด) +
  obliquity ของสุริยวิถี + ละติจูดที่เกิด → คณิตล้วน **ไม่ต้องเพิ่ม lib**
- **เรือนชะตา (houses)**: ระบบ **Placidus** (นิยมสุดในโหราตะวันตก) — `natal`
- **ลัคนาแบบโหราไทย**: ใช้ ayanamsa (sidereal) แปลงจาก tropical → ราศีแบบไทย — `ascendant`/`rasi` (ถ้าเลือก sidereal)

### 7.4 `aspects.ts`

มุมสัมพันธ์หลัก: conjunction 0° · sextile 60° · square 90° · trine 120° · opposition 180° + orb มาตรฐาน
(เช่น ±6–8°) → ใช้ใน `natal`/`compat (synastry)`/`lifegraph (transit)`

### 7.5 ตรวจความถูกต้อง

test เทียบดวงอ้างอิงที่ทราบผล (เช่น ดวงตัวอย่างจาก astro.com / โหรไทยมาตรฐาน) → ลัคนา + ตำแหน่งดาว
คลาดเคลื่อนไม่เกิน tolerance ที่กำหนด (เช่น ลัคนา ±1°, ดาว ±0.5°)

---

## 8. ตารางวิธี/ความลึกต่อ feature (scaffold ให้ subagent research ตอน execute)

> spec ตรึง "วิธีนิยม + input + deterministic? + ใช้ astro? + จุดที่ moodee-lib ทำตื้นและต้อง deepen"
> **การ research เชิงลึก (สูตร/ตาราง/reference vectors) เกิดตอน execution** (1 subagent/feature) ไม่ใช่ตอนเขียน spec

| feature | วิธีนิยม (deepen) | input | det. | astro | จุดที่ต้อง deepen จาก moodee-lib |
|---|---|---|---|---|---|
| `phone` | เลขศาสตร์คู่เลขติดกัน + ผลรวม → เกรด | เบอร์ | ✅ | – | เพิ่มน้ำหนักตำแหน่ง (คู่ท้ายสำคัญ) + ความหมายต่อตำแหน่ง |
| `license` | เลขศาสตร์ + ค่าอักษรทะเบียน + จังหวัด | ทะเบียน, จังหวัด | ✅ | – | ตารางค่าพยัญชนะทะเบียน (วิธีนิยม) — moodee ข้าม |
| `idcard` | เลขศาสตร์ (เลือกประเภทเลข) | ประเภท, เลข | ✅ | – | – |
| `findlucky` | enumerate จากคู่มงคล กรองด้วย analyzer | ประเภท, เลขที่อยากมี, ระดับ | ✅ | – | **เปลี่ยน Math.random → enumerate deterministic + ปุ่ม "ดูเพิ่ม"** |
| `grader` | เลขศาสตร์ (เลขใดก็ได้) | เลข | ✅ | – | – |
| `nameanalyze` | ทักษา (กาลกิณีตามวัน) + เลขศาสตร์ชื่อ | ชื่อ, สกุล, วันเกิด | ✅ | – | เพิ่มเลขศาสตร์ชื่อ (ตารางค่าอักษรไทยที่นิยม) |
| `namesuggest` | คัด pool ไม่มีกาลกิณี + ผลรวมดี | วันเกิด, เพศ, อักษรขึ้นต้น | ✅ | – | ขยาย pool + คำนวณผลรวมจริง |
| `kalakini` | อัฐเคราะห์ 8 ภูมิ/วันเกิด | วันเกิด | ✅ | – | (แน่นแล้ว) |
| `natal` | tropical + Placidus + ดาว + aspects | วันเกิด, เวลา, เมือง(city) | ✅ | ✅ | **เดิม punt → ทำเต็ม (ดาวจริง/เรือน/มุม)** |
| `ascendant` | ลัคนา + ราศีอาทิตย์/จันทร์ จริง | วันเกิด, เวลา, เมือง | ✅ | ✅ | **เดิม punt → ลัคนา/จันทร์จริง** |
| `num7` | เลข 7 ตัว 9 ฐาน — ผูกฐานเต็ม | วันเกิด | ✅ | – | **เดิมแสดงแค่เลขฐาน → ผูกตาราง 9 ฐานเต็มตามสำนักนิยม** |
| `lifegraph` | ดาวจร (transit) เทียบดวงเดิม + personal year | วันเกิด, เวลา, เมือง, ช่วง | ✅* | ✅ | **เดิมแค่ numerology → ใช้ transit จริง** |
| `compat` | ธาตุราศี + ผู้ครองวัน + เลขชีวิต (+ synastry) | 2 วันเกิด (+เวลา/เมือง ถ้ามี) | ✅ | บางส่วน | เพิ่มชั้น synastry เมื่อมีดวงเต็ม |
| `timing` | ฤกษ์ยาม ปฏิทินจันทรคติไทย → ธงชัย/อธิบดี/อุบาทว์/โลกาวินาศ | ประเภทงาน, เดือน | ✅* | – | **เดิมแค่แนวทาง → คำนวณวันมงคลจริงจากปฏิทินจันทรคติ** |
| `bazi` | สี่เสาเต็ม (engine เดิม frozen) | (route เต็ม) | ✅ | (มีแล้ว) | ไม่แตะ engine |
| `zodiacyear` | รอบ 60 ปี + ซานเหอ/ลิ่วเหอ/ชง/ไห่ + ธาตุ | ปีเกิด พ.ศ. | ✅ | ตัดปี | ใช้ 立春 จริงตัดปีนักษัตรคนเกิด ม.ค.–ต้น ก.พ. |
| `kua` | กัวเลข + Eight Mansions 8 ทิศ | ปีเกิด, เพศ | ✅ | ตัดปี | ตัดปีด้วย 立春 จริง |
| `zodiaccompat` | ตารางคู่นักษัตร ถูกโฉลก/ชง | 2 นักษัตร | ✅ | – | (แน่นแล้ว) |
| `birthday` | ผู้ครองวัน + ราศี + เลขชีวิต + ปีส่วนตัว | วันเกิด | ✅* | – | (แน่น) |
| `rasi` | ราศีโหราไทย + เจ้าเรือน + ความเข้ากันธาตุ | วันเกิด | ✅ | เลือกได้ | option: ราศี sidereal จริงจาก astro |
| `luckycolor` | สีมงคลตามผู้ครองวัน + ด้านที่เสริม | วันเกิด, ด้าน | ✅ | – | (แน่น) |
| `dream` | ตำราทำนายฝัน keyword → ความหมาย + เลข | ข้อความฝัน | ✅ | – | ขยายพจนานุกรมฝัน (ตำรานิยม) |

\* deterministic เมื่อ inject เวลาอ้างอิง (now) เป็น input — ดู §4.4

---

## 9. Data flow

```
hub card → route #/f/<id> → DetailLayout อ่าน FEATURES[id]
  → FieldRenderer เรนเดอร์ fields → ผู้ใช้กรอก (refs)
  → กดปุ่ม → readInputs(vals) → [astro: resolve city→coords ก่อน] → engine.build(vals): Section[]
  → SectionRenderer (switch kind) → การ์ด

bazi card → route #/bazi → BaziApp เดิม (form→casting→result) — engine แยก ไม่ผ่าน Section
```

---

## 10. Error handling / edge cases

- **input ไม่ครบ/ผิดรูป** → engine คืน `[{ kind:"note", text:"กรอก... แล้วลองใหม่" }]` (ไม่ throw หลุดถึง UI)
- ปี พ.ศ./ค.ศ. ปนกัน → normalize (`>2300 ⇒ -543`) ก่อนคำนวณ
- วันที่ไม่มีจริง (31 ก.พ.) → guard ก่อนเข้า engine (pattern เดียวกับ `validate.ts`)
- เมืองไม่พบใน dataset → ให้กรอก lat/lon เอง / fallback กรุงเทพ + แจ้งใน note
- BaZi: คง guard เดิมทั้งหมด (ปี 1900–2100, ยามจื่อดึก ฯลฯ)
- ออฟไลน์: ฟอนต์ degrade เป็น system font, ทุกการคำนวณยังทำงาน

---

## 11. กลยุทธ์การทดสอบ

- **BaZi: 12/12 sxtwl vectors เขียวเสมอ** (gate — รันก่อน/หลังทุกการแตะ)
- **ต่อ feature (`engine.test.ts`):**
  1. determinism — input เดิม → output เดิม
  2. schema — `ReportSchema.parse(build(vals))` ผ่าน
  3. reference vectors — ค่าที่ทราบผล (เช่น kua ของปี/เพศที่รู้, นักษัตรของปีที่รู้, คู่เลขที่ตรวจมือ,
     ลัคนาของดวงอ้างอิง) → ตรงตาม tolerance
- **astro:** เทียบดวงอ้างอิง (§7.5)
- **รวม:** `tsc -b --noEmit` + `eslint .` + `vite build` + `vitest run` ผ่านทั้งหมด
- **manual QA:** UX parity ของ bazi flow + detail interactions, responsive ~375/720/1080, ทุก section kind เรนเดอร์ครบ

---

## 12. โมเดลการทำขนาน (สำหรับ writing-plans / execution)

1. **Phase 0 — foundation (sequential):** router · tokens · Section contract+zod+SectionRenderer+9 cards+Ring ·
   FieldRenderer/CityField/useFormRefs · DetailLayout · registry · HubScreen · astro module (ephemeris/cities/houses/aspects) ·
   **BaZi reskin + route + prefill** · **1 feature อ้างอิง end-to-end (`phone`)** เพื่อพิสูจน์ seam
2. **Phase 1 — features (parallel, 1 subagent/feature):** research วิธีนิยม → เขียน meta/fields/content/engine/tests
   ตาม contract · ฟีเจอร์ astro ขึ้นกับ astro module (Phase 0)
3. **Phase 2 — verify (รวม):** typecheck/lint/build/test ทั้งหมด · ทุก engine ผ่าน SectionSchema · bazi 12/12 ·
   QA UX/responsive · completeness critic (ฟีเจอร์ไหน method ตื้นกว่าที่ตกลง / ไม่มี reference vector)

> Phase 0 + frozen seam + reference feature **ต้องเสร็จก่อน** fan-out — ไม่งั้นได้ N การตีความที่ไม่ตรงกัน

---

## 13. ความเสี่ยง / blast radius / reversibility (DISSENT)

| ความเสี่ยง | ผลกระทบ | mitigation |
|---|---|---|
| Contract drift ข้าม subagent | งานขนานต่อไม่ติด | freeze Section + zod validate + reference feature ก่อน fan-out |
| BaZi 12/12 พัง | ของเดิมเสีย | ไม่ย้าย/ไม่ refactor engine · reskin แค่ CSS หน้าฟอร์ม · vectors เป็น gate |
| ephemeris ผิด | natal/ascendant คลาดเคลื่อน | test เทียบดวงอ้างอิง + tolerance + หมายเหตุ DST |
| scope 22 ฟีเจอร์ | ใหญ่/บานปลาย | foundation-first + ขนานจริง + ส่งเป็น subset ได้ (registry-driven) |
| dataset เมือง/tz ไม่ครบ | ลัคนาเมืองนอกคลาด | ให้กรอก lat/lon เอง + ระบุ DST/historical นอก scope |
| ความแม่นเชิงโหราศาสตร์ | คาดหวังเกินจริง | disclaimer เชิงสัญลักษณ์/บันเทิง โดยเฉพาะ dream/findlucky (พาดพิงหวย) |

**Reversibility:** โค้ดใหม่เป็น additive ทั้งหมด · BaZi ไม่ถูกแตะ · revert = ลบ route/registry entry · ship subset ได้

---

## 14. สมมติฐานที่ระบุชัด (NO MAGIC)

1. `astronomy-engine` ให้ความแม่นเพียงพอสำหรับ natal/ascendant ระดับผู้ใช้ทั่วไป (ไม่ใช่ระดับวิจัย)
2. โหราตะวันตก = tropical + Placidus (วิธีนิยมสุด) · โหราไทย = sidereal + ราศีไทย — subagent ยืนยันสำนักตอน research
3. timezone ใช้ standard offset ของเมือง (ไทย +7) — DST/historical ไม่ครอบคลุม
4. ฟีเจอร์อิงเวลาปัจจุบัน (personal year/transit/timing) รับ "now" เป็น input ที่ inject ได้ (กัน test ลอย)
5. deploy เป็น static (มี `dist/.nojekyll` อยู่แล้ว → GitHub Pages) → ใช้ hash route
6. ปี input รับทั้ง พ.ศ./ค.ศ. (normalize) ตาม moodee-lib เดิม

## 15. Disclaimers (ทุกหน้า)

ผลทำนายเป็นกรอบอ้างอิงเชิงสัญลักษณ์ตามตำรา ไม่ใช่คำพยากรณ์ตายตัว · เรื่องสุขภาพเป็นคติ ไม่ใช่คำวินิจฉัย ·
`dream`/`findlucky` เพื่อความบันเทิง โปรดเล่นอย่างมีสติ
