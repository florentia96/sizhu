# MooDee — Code Review: Flow Redesign + 22-Feature Enrichment

วันที่: 2026-06-20
ขอบเขต: working-tree diff (101 ไฟล์, +3827/-959) — รื้อ flow (กรอกวันเกิดครั้งเดียวที่หน้าแรก) + enrich engine/content ทั้ง 22 feature
วิธีตรวจ: code-scrutinize (intent → trace → verify → report). โครงสร้าง/flow ตรวจเอง; correctness ของ domain math ทั้ง 18 engine กระจาย 5 cluster แล้ว verify จุดวิกฤตซ้ำที่ source เอง

---

## Step 1 — Intent + ทางเลือกที่ง่ายกว่า

**Intent:** ผู้ใช้กรอกวันเกิด/เวลา/เพศ ครั้งเดียวที่หน้าแรก (core profile เก็บใน localStorage) → แต่ละศาสตร์ดึง core field อัตโนมัติด้วย `resolveCore` → แสดง mini-form เฉพาะ field ที่ศาสตร์นั้นต้องใช้เพิ่ม → casting → result. พร้อม enrich เนื้อหา/ตรรกะทุกฟีเจอร์

**ทางเลือกที่ง่ายกว่า (mandatory pass):** ปัจจุบัน `resolveCore` จับคู่ profile↔field ด้วย **substring ของ label ภาษาไทย** (`label.includes("วันเกิด")` ฯลฯ). ทางเลือกที่ magic น้อยกว่า: เพิ่ม property ชัดเจนบน type `Field` เช่น `coreSlot?: "birthDate" | "birthTime" | "gender" | "yearOf" | "weekdayOf"` แล้วให้ ~22 ไฟล์ `fields.ts` ระบุเอง. ได้ความทนทานต่อการแก้ copy + อ่านง่าย + เทสต์ตรงจุด โดยเปลี่ยนเล็กน้อย → แนะนำเป็นทิศทางระยะยาว (แก้ A1 ด้านล่าง)

---

## Verification (รันเอง — ยืนยันคำกล่าวอ้างใน audit เดิม)
- `npm test`: **853 passed / 117 files** ✓
- `npm run typecheck`: **pass** ✓
- `npm run lint`: **0 errors**, 1 warning เดิม (`CityField.tsx`, ไม่เกี่ยวงานนี้) ✓

ไม่มี crash / data loss / security issue → **ไม่มี BLOCKER ที่หยุด ship** แต่มี MAJOR ที่ผู้ใช้เห็นผลและควรแก้ก่อน merge

---

## MAJOR (ต้องแก้ก่อน ship)

### M1 — dream: substring ชนกัน ทำให้ "เลขที่ทำนาย" ปนเปื้อน
**What:** `hit()` ใช้ token guard เฉพาะ keyword ≤2 ตัว; keyword ≥3 ตัวจับด้วย `text.indexOf` ล้วน → keyword สั้นที่เป็น substring ของ keyword ยาวจะ match พร้อมกัน และเลขถูกรวมข้าม hits
**Why it matters:** เลขหวยคือ payload หลักของฟีเจอร์ — ฝันผิดสัญลักษณ์ = ได้เลขผิดปน
**Evidence:**
- `dream/engine.ts:34` (≥3 ตัว → `indexOf`), `:64-69` (aggregate เลขทุก hit)
- ข้อมูลชนจริง: `content.ts:10` `"ทะเล"` ⊂ `:77` `"ทะเลาะ"` (ฝันทะเลาะ → ได้เลขน้ำ 27/72/2/7 ปน) · `:11` `"พระ"` ⊂ `:24` `"พระจันทร์"` / `:37` `"พระอาทิตย์"` / `:99` `"พระเครื่อง"`
- เทสต์ไม่จับ: `content.test.ts` เช็คแค่ keyword ไม่ซ้ำ (ไม่เช็ค substring); `engine.test.ts:62` เทสต์เฉพาะเคส ≤2 ตัว
**Suggested change:** ใช้ token-match กับทุกความยาว (เมื่อมี Segmenter) + longest-keyword-first; ระวัง Segmenter ตัด "พระจันทร์"→["พระ","จันทร์"] (ต้อง verify การ segment คำหลายพยางค์) + เพิ่ม regression test ว่า พระจันทร์/ทะเลาะ ไม่ดึง พระ/น้ำ

### M2 — FeatureFlow: ปุ่ม "↺ แก้ไขข้อมูลที่กรอก" โชว์ฟอร์มเปล่า
**What:** กด result → "แก้ไขข้อมูลที่กรอก" กลับไป mode "form" แต่ค่าที่กรอกไว้หาย (ต้องพิมพ์ใหม่ทั้งหมด)
**Why it matters:** ปุ่มสัญญาว่าแก้ของเดิม แต่กลับล้างทิ้ง — เด่นชัดมากกับ dream (ต้องพิมพ์ความฝันใหม่), nameanalyze (ชื่อ), namesuggest (อักษรนำ), compat (คนที่ 2), luckycolor (ด้านที่อยากเสริม). เป็น regression จาก `DetailLayout` เดิมที่ฟอร์ม mount ค้างไว้
**Evidence:** `FeatureFlow.tsx:128-134` (render `FieldRenderer`/`CityField` ไม่ส่ง `defaultValue`), `:105-109` (ปุ่ม), `useFormRefs.ts:19-23` (refs ถูก `delete` ตอน unmount) → form remount = input ว่าง
**Suggested change:** ตอน `run()` เก็บ `raw` ลง state แล้วส่งกลับเป็น `defaultValue` เมื่อ render form ใหม่ (FieldRenderer รองรับ `defaultValue` อยู่แล้ว)

### M3 — timing: การแยกวันตามชนิดงานแทบไม่มีผลจริง (audit อ้างว่าแก้แล้ว แต่ยังไม่ได้แก้)
**What:** `favorDow`/`avoidDow` ถูกแปลงเป็น `Set` แล้วใช้แค่ `.has()` → ลำดับใน favorDow (ที่ comment ระบุ "เรียงจากเหมาะที่สุด") ถูกทิ้ง; candidate pool ถูกล็อกที่วันธงชัย/อธิบดีเท่านั้น → +3 ของ favorDow แทบไม่กัด
**Why it matters:** เป้าหมายหลักของการรื้อคือ "วันในสัปดาห์ต่อกิจคัดวันจริง" แต่ผลที่ผู้ใช้เห็นไม่ต่าง
**Evidence:**
- `engine.ts:64-65` (`new Set(...)`), `:78` (`favorSet.has(dow)`), `:86-89` (flat +3), `:113-115` (pool = เฉพาะ `x.kala`)
- ข้อมูล: `content.ts:31-38` แต่งงาน favorDow `[5,4,3]`/avoid `[2,6]` ≡ `:49-57` ออกรถ `[4,5,3]`/avoid `[6,2]` (Set เดียวกัน → ผลเหมือนกันเป๊ะ); ขึ้นบ้านใหม่ `[4,1,3]` ≡ เซ็นสัญญา `[4,1,3]`. มีแต่ เปิดร้าน (avoid อาทิตย์ 0) ที่ต่าง
- เทสต์ tautology: `engine.test.ts:94-105` เช็คแค่ว่าทั้งคู่มี BEST + ผ่าน schema ไม่ได้ assert ว่าต่างกัน
**Suggested change:** ให้ลำดับ favorDow มีน้ำหนัก เช่น `score += (3 - favorDow.indexOf(dow))`; หรือให้คะแนนทุกวัน (ไม่ใช่เฉพาะวันกาลโยค) เพื่อให้ favorDow โผล่จริง + แก้เทสต์ให้ assert ความต่างในเดือนที่ควรต่าง

### M4 — zodiaccompat: 害 มาก่อน 刑 ใน else-if → สลับลำดับความหนัก
**What:** chain เดียว `六合→三合→same→沖→害→刑→neutral`. คู่ที่เป็นทั้ง 害 และ 刑 จะได้ 害 (55) ส่วนคู่ 刑 ล้วนได้ 50 → คู่ 三刑 (寅巳 เสือ-งู = 55) ได้คะแนน **สูงกว่า** คู่ 互刑 (子卯 ชวด-เถาะ = 50) ทั้งที่ 三刑 ถือว่าหนักกว่า
**Why it matters:** คะแนน/ป้ายคือผลลัพธ์หลัก — เป็นการตัดสินเชิงนโยบาย (ต่างสำนัก) ที่ควร ratify
**Evidence:** `engine.ts:93` (`HARM[ai]===bi` → 55) ก่อน `:96` (`xing` → 50); หมายเหตุ 相刑 ยังถูกแสดงแยกที่ `:105-109` (xing ไม่ถูกซ่อน)
**Suggested change:** ตัดสินใจให้ 刑 outrank 害 หรือคุมเพดานให้ 刑 ไม่ได้คะแนนสูงกว่า 害 อย่างน้อยระบุว่า headline = "ความสัมพันธ์เด่นที่สุดเพียงหนึ่ง"

### M5 — astrology: profile ไม่มีเวลาเกิด → natal/ascendant/lifegraph ขึ้น note รวมที่ระบุ field ที่รู้แล้วซ้ำ + `toUT` มี default "12:00" เงียบ ๆ (agent-found, ยืนยันตรรกะ)
**What:** `hasCoreProfile` ไม่บังคับเวลาเกิด → field เวลาเป็น manual; ถ้าไม่กรอก engine short-circuit เป็น note "กรอกวันเกิด เวลาเกิด เมืองเกิด ให้ครบ" ทั้งที่วันเกิด/เมืองมีแล้ว. `toUT` default เวลาเป็น "12:00" — กันด้วย regex guard รายไฟล์ (load-bearing)
**Why it matters:** path one-tap ที่ออกแบบไว้ดันเด้ง note กว้าง ๆ; default 12:00 เป็นกับดักแฝงถ้ามี caller ข้าม guard
**Evidence:** `profile.ts:74-76`; `resolveCore.ts:46-48`; `natal/engine.ts:33` (default "12:00") vs `:78-80` (guard); เช่นเดียวกับ `ascendant/engine.ts:42-44`, `lifegraph/engine.ts:75-84`
**Suggested change:** note เฉพาะเจาะจง ("ศาสตร์นี้ต้องใช้เวลาเกิด") หรือ pre-render เฉพาะ field เวลา; ตัด/กัน default 12:00 ใน `toUT`

### M6 — idcard/grader: "สูงสุด 15 หลัก" บังคับแค่ที่ HTML `maxLength` ไม่ใช่ engine (agent-found)
**What:** engine ไม่มีเพดานบนสำหรับ type ที่ไม่มี `len` (เลขบ้าน/บัญชี/grader) — รับ 20–500 หลักแล้ววิเคราะห์ปกติ
**Why it matters:** `maxLength` ไม่กันการ paste ทุก browser และ engine เป็น pure function เรียกตรงได้ (เทสต์ก็เรียกตรง). ผลกระทบจริงต่ำ (client-only ไม่มี backend) แต่ contract "สูงสุด 15" เป็นเท็จ
**Evidence:** `idcard/engine.ts:17-25` (เช็คแค่ `<2` และ `len` ตายตัว); `grader/engine.ts:6`
**Suggested change:** บังคับเพดานใน engine หรือลดทอนถ้อยคำใน hint

---

## Architecture (ความเสี่ยงเชิงโครงสร้าง)

### A1 — resolveCore ผูก profile↔field ด้วย substring ของ label (implicit coupling / NO MAGIC)
**What:** `resolveCore.ts:40-64` จับคู่ด้วย `label.includes("วันเกิด"|"เกิด"|"เพศ"|"ปีเกิด"|...)`. ถ้าเปลี่ยน copy ของ label ในไฟล์ใด → autofill one-tap ของ field นั้นพังเงียบ ๆ (field กลายเป็น mini-form) โดยไม่มีเทสต์ fail
**Evidence:** `resolveCore.ts:40-64`, `profile.ts:82-87` (`slotForField` ใช้ pattern เดียวกันซ้ำ). มี sweep test บางส่วน (`registry.sweep.test.ts`) แต่ไม่ครอบคลุมการ assert ว่าทุก feature ที่มี core field resolve ได้จริงด้วย profile ตัวอย่าง
**Suggested change:** ระยะสั้น — เพิ่ม sweep test: สำหรับทุก feature ใน registry ที่ `featureUsesCore`, ใส่ profile ตัวอย่างแล้ว assert ว่า `extraFieldIndexes` ไม่รวม core field ที่ควร resolve. ระยะยาว — ใช้ `coreSlot` บน Field (ดู Step 1)

### A2 — component ใหม่ (FeatureFlow, HomeProfileCard) ไม่มีเทสต์เฉพาะ
flow transition (form→casting→result→edit) ไม่ถูกเทสต์ตรง — เป็นเหตุให้ M2 หลุด. `App.integration.test.tsx` แตะ flow ระดับสูงแต่ไม่ครอบ edit-form

---

## NIT
- **rasi:** `normYear` ถูกเรียกซ้ำ (`engine.ts:31` + `sidereal.ts:21`) — ไม่เป็นพิษตอนนี้ (threshold >2300) แต่เป็นกับดัก; hint "กรอก พ.ศ. หรือ ค.ศ." ไม่ถึงผ่าน `<input type=date>` (`fields.ts:7`)
- **namesuggest:** `"เปมิกา"` (`content.ts:36`) ขึ้นต้นสระ เ → `name[0]` จับสระแทนพยัญชนะต้น (`engine.ts:23-27`) ทำให้ rank/note ผิดชื่อเดียว (filter กาลกิณียังสแกนทุกตัวอักษร = ปลอดภัย); ลำดับ มนตรี↔มูละ ต่างจาก nameanalyze (cosmetic)
- **zodiacyear:** รายงานคนเดียวไม่มี 刑 (`engine.ts:99-109`); zodiaccompat ก๊อป `XING_PAIRS`/`BRANCH_EL`/`GEN`/`CTRL` จาก `constants.ts` แบบ hand-maintained โดยไม่มีเทสต์ assert ว่าตรงกัน (drift risk)
- **idcard:** ข้อความ error รายงานจำนวนหลัก "หลัง strip" ไม่ตรงกับที่ผู้ใช้พิมพ์ถ้ามีตัวคั่น (`engine.ts:23`)
- **lifegraph:** ไม่มีเทสต์ pin ค่าตัวเลขจริง (transit/personal-year) เทียบ reference — เลขอาจ drift โดยเทสต์ไม่จับ; daily-Moon คำนวณที่ noon ของ tz เมืองเกิด (อ่อนไหวต่อชั่วโมงที่เลือก)
- **over-gating:** ฟีเจอร์ที่ใช้แค่ "วันเกิด" (เช่น birthday) ยังถูก gate หลัง `hasCoreProfile` ที่บังคับเพศด้วย; ค่ากรอก core ผ่าน mini-form (เข้าตรงด้วย URL ไม่มี profile) ไม่ถูกจำลง profile (ไม่มี remember/`patchProfile` ใน FeatureFlow)

---

## ผ่านการ trace แล้ว = ถูกต้อง (ไม่มีปัญหา)
- **coupling วันเกิด/เพศ/ปี:** `taksa.ts:48-50` map "พุธ (กลางวัน)"→ฐานพุธ, "พุธ (กลางคืน)"→ฐานราหู ถูก (kalakini/nameanalyze/luckycolor); kua/zodiacyear gender `["ชาย","หญิง"]` + `toCE("2000")` ถูก; compat คนที่ 2 ถูก exclude ด้วย `isSecondPerson`
- **"" vs null:** `patchProfile` strip ค่าว่างด้วย `v.trim()` (`profile.ts:49`) → `birthTime` ไม่มีทางเป็น "" → field เวลาเป็น extra ถูกต้อง
- **kua:** สูตร Eight Mansions (10−s/9−s ชาย, +5/+6 หญิง), kua=5 แทน (ชาย→2 หญิง→8), ทิศ 8 มี derive test จริง (`directions.test.ts`); ลี่ชุน (Feb 4) ใช้ `lichunCE` ร่วมกับ zodiacyear = consistent
- **num7:** year-seed ใช้ `zodiacIndexFromCE` (ปีนักษัตร) ถูกตามที่ audit อ้าง; 21 ภพ derive จากตารางสอดคล้อง (reproduce แล้ว)
- **namesuggest/nameanalyze/birthday:** ranking auspicious-first, per-letter ทักษา, life path/ราศี ถูก (reproduce reference vectors)
- **compat:** สองระบบ (sidereal Thai กับ tropical synastry) แยกกันจริง ไม่รวมคะแนน
- **luckycolor/kalakini:** จัดการพุธกลางวัน/กลางคืนถูก; deterministic; มี reference-vector test
- **ascendant/natal:** ascendant/MC/whole-sign/Lahiri ถูก pin กับ ephemeris จริง (Einstein, Bangkok)
- **license/numerology core:** ตารางอักษร 44 ตัวครบไม่ซ้ำ; ไม่มีคู่ที่อยู่ทั้ง good และ bad; "69" reword กระทบแค่ข้อความ ไม่กระทบ score (k ไม่เปลี่ยน)

---

## Verdict รายส่วน
| area | verdict |
|---|---|
| โครงสร้าง flow (FeatureFlow/resolveCore/Hub gating) | fix-then-ship (M2 + A1) |
| ascendant · natal | ship |
| rasi · lifegraph | fix-then-ship (M5 + NIT) |
| birthday · num7 · nameanalyze · namesuggest | ship |
| kua · zodiacyear · compat | ship |
| zodiaccompat | fix-then-ship (M4) |
| luckycolor · kalakini | ship |
| dream | fix-then-ship (M1) |
| timing | rework (M3) |
| license · findlucky · phone | ship |
| idcard · grader | fix-then-ship (M6) |

## Verdict รวม: **fix-then-ship**
ไม่มี blocker ที่หยุดการรัน (test/typecheck/lint เขียว, core math แน่น) แต่มี 4 จุดผู้ใช้เห็นผลที่ควรแก้ก่อน merge: **M1 (dream เลขปน), M2 (edit ฟอร์มเปล่า), M3 (timing ไม่แยกวันจริง — ขัดคำกล่าวอ้าง audit), M4 (zodiaccompat ลำดับ 害/刑)** + เพิ่ม sweep test กัน A1 regression

---

## Remediation (2026-06-20) — แก้แล้วก่อน deploy
ยืนยัน: `typecheck` ผ่าน · `lint` 0 error · `test` 858 ผ่าน/117 ไฟล์ (เสถียร 2 รอบ) · `build` สำเร็จ

| รหัส | แก้เป็น | ไฟล์ |
|---|---|---|
| M1 | dream จับ keyword จากยาวสุดก่อน + กินช่วง (mask) คงไว้ token guard คำ ≤2; +2 regression test | `dream/engine.ts`, `dream/engine.test.ts` |
| M2 | FeatureFlow เก็บค่าที่กรอกลง `draft` state ส่งกลับเป็น `defaultValue` เมื่อแก้ฟอร์ม | `shared/layout/FeatureFlow.tsx` |
| M3 | timing rank-weight `favorDow` (ลำดับมีผล) + ขยาย pool รวมวัน favored; เทสต์ tautology → assert ความต่างจริง | `timing/engine.ts`, `timing/engine.test.ts` |
| M4 | ย้าย branch 刑 มาก่อน 害 (刑 หนักกว่า); lift `XING_PAIRS/SELF_XING/isXing/xingPartners` ขึ้น `_shared/sixtyCycle` ใช้ร่วม | `_shared/sixtyCycle.ts`, `zodiaccompat/engine.ts` |
| M5 | natal/ascendant/lifegraph แยก guard → note เฉพาะกรณีขาดเวลาเกิด (ไม่ทวงช่องที่กรอกแล้ว) | `natal/ascendant/lifegraph engine.ts` + test |
| M6 | idcard (no-len types) + grader บังคับเพดาน 15 หลักใน engine | `idcard/engine.ts`, `grader/engine.ts` |
| NIT | rasi เลิก normYear ซ้ำ (ส่ง raw y ให้ siderealCell) · namesuggest ข้ามสระนำจับพยัญชนะต้น · zodiacyear เพิ่ม row 刑 | rasi/namesuggest/zodiacyear |
| A1 | registry sweep test: ทุก core field ต้อง resolve ด้วย profile เต็ม (กัน label drift) | `shared/profile/resolveCore.test.ts` |

### Defer (ไม่ใช่บั๊ก — hardening/นโยบาย, ทำรอบหน้าได้)
- lifegraph: ยังไม่เพิ่ม pinned numeric test (transit/personal-year) — มีเทสต์ cycle behavior อยู่แล้ว
- zodiaccompat: `BRANCH_EL/GEN/CTRL` ยัง local (XING lift ขึ้น shared แล้ว ส่วนที่เหลือ verified ถูก + drift ต่ำ)
- idcard: ข้อความ error รายงานจำนวน "หลัง strip" — กรณี numeric-only ถูกต้องอยู่แล้ว
- over-gating: ฟีเจอร์ที่ใช้แค่วันเกิดยังต้องกรอกเพศด้วย (ตัดสินเชิงผลิตภัณฑ์ — เก็บโปรไฟล์แกนครั้งเดียว)
- FeatureFlow/HomeProfileCard: ยังไม่มี component test เฉพาะ (M2 verify ด้วยการอ่านโค้ด + typecheck)
