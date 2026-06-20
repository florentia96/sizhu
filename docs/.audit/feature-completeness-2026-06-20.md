# MooDee (มูดีย์) — Feature Completeness Audit

วันที่: 2026-06-20
ขอบเขต: ตรวจ + ปรับปรุงทั้ง 22 feature (validation · โทนสุภาพ · ความครบถ้วนผลลัพธ์ · ความถูกต้องเนื้อหา) หลังรื้อ flow ใหม่ (กรอกวันเกิดครั้งเดียวที่หน้าแรก)

## สรุปผลรวม
- **22/22 feature ผ่านการตรวจ + ปรับปรุง**
- `npm test`: 853 ผ่าน (117 ไฟล์) · `npm run typecheck`: ผ่าน · `npm run lint`: 0 error (เหลือ 1 warning เดิมที่ `CityField.tsx` ไม่เกี่ยวงานนี้)
- โทน: grep ทั้ง `src/` ไม่พบ ครับ/ค่ะ/นะคะ/สแลง ในข้อความผู้ใช้ (เฉพาะ test assertion)
- บั๊กเนื้อหาจริงที่พบและแก้: 8 จุด (ดูหัวข้อถัดไป)

## บั๊กเนื้อหา/ตรรกะที่พบและแก้แล้ว
| feature | บั๊ก | แก้เป็น |
|---|---|---|
| zodiaccompat | ขาดตาราง 相刑 (สิง/โทษ) → ชวด+เถาะ (子卯互刑) ถูกจัด "เป็นกลาง 70" ผิด | เพิ่ม XING → คู่โทษได้ 50 + เตือน 相刑/自刑 |
| namesuggest | UI บอก "ขึ้นต้นด้วยอักษรเดช/ศรี" แต่ logic แค่ตัดกาลกิณีออก ไม่ได้เรียงอักษรมงคลขึ้นก่อน | จัดอันดับ เดช→ศรี→มนตรี→มูละ→อุตสาหะ + ขยาย name pool (32→59/52/38) |
| num7 | year-seed (ฐานล่าง) ใช้ digitRoot(ปี ค.ศ.) ผิดธรรมเนียม | ใช้ปีนักษัตร (zodiacIndexFromCE) ตามตำราเลข 7 ตัว |
| timing | ธรรมเนียมวันในสัปดาห์ของแต่ละงาน "แสดงแต่ไม่ถูกใช้คัดวัน" (แต่งงาน/ออกรถ ได้วันเหมือนกัน) | favorDow บวกคะแนน, avoidDow ตัดวันออก |
| lifegraph | จันทร์จร (เร็ว) ปนใน "ช่วงชีวิต"; Personal Year อิงปีปฏิทินไม่ใช่รอบวันเกิด; meta อ้างเท็จว่า "ฉีดวันนี้อัตโนมัติ" | แยกจันทร์เป็นโน้ตรายวัน + personalYearAsOf รอบวันเกิด + แก้ meta |
| natal | องศาลัคนา (degree-in-sign) คำนวณเปราะ | ใช้ signFromLon(asc).deg |
| idcard | ใส่ "ค่ะ" 2 จุด (ผิดกฎโทนกลางไม่ระบุเพศ) | ตัดออก |
| numerology (shared) | คู่ "69" จัด good แต่ความหมายมี "(ระวังหมกมุ่น)" ขัดในตัว | แก้ความหมายให้สอดคล้อง good (ไม่เปลี่ยน k → ไม่กระทบ score) |

## ผลรายฟีเจอร์ (sections ก่อน→หลัง / สิ่งที่ verify)
| feature | result | ตรวจความถูกต้อง |
|---|---|---|
| bazi | gold standard (คงเดิม) | tone-clean; เนื้อหา verify ใน commit ก่อนหน้า |
| birthday | 6→10 | สีประจำวัน/กาลกิณี, life path, ราศี+ดาวเจ้าเรือน |
| ascendant | 4→7 | ลัคนา/ayanamsa Lahiri, ราศีจันทร์, +MC/whole-sign (เทียบ ephemeris จริง) |
| natal | 4→7 | ตำแหน่งดาว/เรือน เทียบ J2000/Apollo11/Bangkok |
| lifegraph | enriched | ดาวจร, scope filter, เลขศาสตร์รอบวันเกิด |
| compat | 4→5 | ธาตุคู่, synastry, +xing |
| rasi | enriched, +28 tests | sidereal (นิรายนะ) + ดาวเจ้าเรือน + ธาตุ ครบ 12 |
| num7 | →8 | เลข 7 ฐาน + 21 ภพ (เทียบตำราหลายแหล่ง) |
| kua | 5→6 | สูตรเลขกัว (Eight Mansions) + 8 ทิศ derive ทางคณิตศาสตร์ + ลี่ชุน |
| zodiacyear | 5→8 | นักษัตร+ธาตุ+ลี่ชุน ครบ 12 reference |
| zodiaccompat | 4→5 | 三合/六合/六沖/六害/相刑 |
| kalakini | 4→6 | วงล้ออัฐเคราะห์ + 8 ภูมิ + กาลกิณี (พุธ/เสาร์ ถูก) |
| nameanalyze | →6+ | ทักษา per-letter + เลขศาสตร์ + guidance |
| namesuggest | enriched | ทักษา auspicious-first + pool ขยาย |
| luckycolor | 5→6 | สีประจำวัน/กาลกิณี + บุคลิกดาวประจำวัน |
| dream | 40→86 สัญลักษณ์ | tokenize ไทย (กันคำสั้นชน) + fallback |
| phone | คงเดิม (รวย) | numerology 10 หลัก |
| grader | คงเดิม | numerology หลายชนิดเลข |
| idcard | +type note | บัตร 13 หลัก + per-type length |
| license | enriched | ทะเบียน letters+digits |
| findlucky | คงเดิม | ranking เลขมงคล deterministic |
| timing | enriched | กาลโยค + วันในสัปดาห์ต่อกิจ |

## Input validation (research-backed)
| feature | field | maxLength | inputMode |
|---|---|---|---|
| phone | เบอร์ | 10 | numeric |
| idcard | เลข | 15 (บัตร 13 / บัญชีถึง 15) | numeric |
| license | ทะเบียน | 8 | text (มีอักษรไทย) |
| grader | เลข | 15 | numeric |
| findlucky | เลขที่อยากมี | 6 | numeric |
| kua / zodiacyear | ปีเกิด | 4 | numeric |
| namesuggest | อักษรนำ | 1 | — |
| nameanalyze | ชื่อ/สกุล | 40 | — |
| dream | ข้อความฝัน | 200 | — |

## จุดใน shared/infra ที่ควรตามต่อ (รายงานไว้ ยังไม่แก้ — กระทบหลายฟีเจอร์/score/test หรือเป็นเรื่องตำราต่างสำนัก)
- **`_shared/numerology.ts`**: คู่ 24/42 และ 56/65 เน้นความหมายต่างจากสำนักหลัก (แต่ k ถูก ไม่กระทบ score) · 13/31 (bad) กับ 40/90 (sum good) เป็นจุด debatable ระหว่างสำนัก · 05/50 ไม่มีในตาราง (ถือเป็นกลาง) — การแก้จะเลื่อน score + ต้องอัปเดต test ที่ pin ค่าไว้ ควรตัดสินใจระดับเจ้าของตำรา
- **`src/astro/aspects.ts`**: ใช้ orb คงที่ 6° ทุกมุม/ทุกดาว ตามหลักควรต่างกัน (conjunction ~8–10°, sextile ~4–6°, จันทร์กว้างกว่า)
- **`_shared/thaiAstro.ts` `personalYear`**: อิงปีปฏิทิน ไม่ใช่รอบวันเกิด (lifegraph patch ที่ชั้นฟีเจอร์แล้ว)
- **`_shared/thaiAstro.ts` `RASI`**: ช่วงวันคงที่ คลาด ±1 วันจาก ingress จริงรายปี (rasi ชดเชยด้วยช่อง sidereal-true)
- **`_shared/thaiLunar.ts` `chulaSakaratForMonth`**: เส้นแบ่ง จ.ศ. ใช้ระดับเดือน (เม.ย.ทั้งเดือน) จริงคือ 16 เม.ย. → 1–15 เม.ย. คลาด
- **ไม่มี helper เดือนจันทรคติ** ใน shared → num7 ฐานกลางใช้เดือนสุริยคติเป็น approximation (ระบุใน note แล้ว)
- **ตาราง XING/相刑** อยู่ใน `src/engine/constants.ts` แต่ไม่อยู่ `_shared` → zodiaccompat นิยาม local; zodiacyear ก็ยังขาด ควรย้ายขึ้น `_shared`

## วิธีตรวจซ้ำ
```
npm run typecheck
npm test
npm run lint
npm run dev   # smoke: กรอกวันเกิดที่หน้าแรก → กดแต่ละศาสตร์ → casting → ผล → กลับหน้าแรก
```
