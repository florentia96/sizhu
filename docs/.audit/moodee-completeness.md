# MooDee — Phase 2 Completeness Audit

Phase 2 verification of the 22 features against spec §8 (`docs/superpowers/specs/2026-06-19-moodee-multi-fortune-design.md`).

- **method implemented** — what `engine.ts` actually computes.
- **matches §8 popular method** — does the implementation match the "วิธีนิยม (deepen)" column of spec §8.
- **reference vector** — does `engine.test.ts` assert at least one known-input → known-domain-answer (not just schema/determinism/structural).
- **depth note** — shallowness vs the spec's "most detailed possible" bar; resolved items from the §8 "ต้อง deepen" column.

| feature | method implemented | matches §8 popular method | reference vector | depth note / shallowness |
|---|---|---|---|---|
| phone | เลขศาสตร์คู่เลขติดกัน (sliding-window pairs) + ผลรวม → score/grade | Y | Y (`0812345678` → 78/A, hand-traced) | Full. Pair quality + sum-quality bonus. No per-position weighting (§8 "deepen" suggestion) but core method present. |
| license | numberReport(plate digits) + ค่าพยัญชนะทะเบียน (ก=1) + combinedSum + จังหวัด | Y | Y (`1กก234` → combinedSum 12) | Full. Letter-value table added (the moodee gap §8 flagged is closed). |
| idcard | เลขศาสตร์ numberReport ตามประเภทเลข | Y | Y (digit-root / known number assertions) | Full. Matches §8 (no deepen item). |
| findlucky | enumerate จากคู่มงคล (GOOD_PAIRS) กรองด้วย analyzer, deterministic + paging | Y | N (structural/determinism/paging only — no fixed known-answer vector) | Math.random → deterministic enumerate + paging done (§8 core deepen closed). Gap: no golden reference set asserting a specific produced number. |
| grader | เลขศาสตร์ numberReport (เลขใดก็ได้) | Y | Y (known number → score) | Full. Matches §8. |
| nameanalyze | ทักษา (กาลกิณีตามวัน) + เลขศาสตร์ชื่อ (numerologySections) | Y | Y (kala detection + name-sum vectors) | Full. Name numerology layer added (§8 deepen closed). |
| namesuggest | คัด NAME_POOL ไม่มีกาลกิณี + ผลรวม + prefix filter | Y | N (property tests: kala-free, prefix — no fixed known-answer vector) | Pool filter + real name-sum present. Gap: pool breadth (§8 "ขยาย pool"); no reference vector. |
| kalakini | อัฐเคราะห์ 8 ภูมิ/วันเกิด (taksaForDay) | Y | Y (per-day bhumi letters) | Full. §8 marks "(แน่นแล้ว)". |
| natal | tropical zodiac + Placidus cusps + ดาวจริง + aspects | Y | Y (Sun sign, house, aspect vectors) | Full. Real ephemeris (§8 "เดิม punt → ทำเต็ม" closed). |
| ascendant | ลัคนาจริง + ราศีอาทิตย์/จันทร์ + ลัคนาโหราไทย sidereal (Lahiri) | Y | Y (Sun=มังกร 1990-01-15; tropical≠sidereal) | Full. Real lagna/moon (§8 deepen closed). |
| num7 | เลข 7 ตัว — 3 ฐาน × 7 ภพ + ฐานบวก/ฐานเดิน (rows 4–7) | Partial | Y (base-grid value vector) | **Shallow vs §8.** §8 asks "ผูกตาราง 9 ฐานเต็ม"; engine builds 7 rows and the trailing note explicitly states ฐาน 8–9 (เดินยาม) are omitted (no validated example). |
| lifegraph | ดาวจร (transit) จริงเทียบดวงเดิม + personal year + life path | Y | Y (transit/PY vectors) | Full. Real transit (§8 "เดิมแค่ numerology → transit จริง" closed). Deterministic only when `now` injected (vals[4]). |
| compat | ธาตุราศี + ผู้ครองวัน + เลขชีวิต + synastry (เมื่อมีเวลา/เมืองครบ) | Y | Y (score components, synastry gating) | Full. Synastry layer added (§8 closed). |
| timing | ฤกษ์ยาม ปฏิทินจันทรคติไทย → ธงชัย/อธิบดี/อุบาทว์/โลกาวินาศ + ดิถี | Y | Y (กาลโยค weekday vectors per จ.ศ.) | Full. Real lunar-calendar day computation (§8 "เดิมแค่แนวทาง → คำนวณจริง" closed). |
| bazi | สี่เสาเต็ม via full route (`#/bazi`); Section engine = no-op teaser note | Y | Y (12/12 sxtwl golden vectors, `test/bazi-vectors.gate.test.ts`) | Full. engine frozen per §8; routes to dedicated page, not Section pipeline. |
| zodiacyear | รอบ 60 ปี + ซานเหอ/ลิ่วเหอ/ชง/ไห่ + ธาตุ; 立春 cut via real solar term | Y | Y (nakshatra-for-year vectors) | Full. Real 立春 year-cut (§8 deepen closed). |
| kua | กัวเลข + Eight Mansions 8 ทิศ; 立春 year-cut | Y | Y (1984♂→6, 1990♀→6, center-5 rules) | Full. Real 立春 cut (§8 deepen closed). |
| zodiaccompat | ตารางคู่นักษัตร — ลิ่วเหอ/ซานเหอ/ชง/ไห่ → score | Y | Y (95/90/42/55/78/70 score vectors) | Full. §8 marks "(แน่นแล้ว)". |
| birthday | ผู้ครองวัน + ราศี + เลขชีวิต + ปีส่วนตัว + สีมงคล | Y | Y (day-lord/rasi/life-path vectors) | Full. §8 marks "(แน่น)". |
| rasi | ราศีโหราไทย + เจ้าเรือน + ความเข้ากันธาตุ + sidereal cell จาก astro | Y | Y (rasi/ruler vectors) | Full. Sidereal option from real astro added (§8 option closed). |
| luckycolor | สีมงคลตามผู้ครองวัน + ด้านที่เสริม (work/money/love/health/luck) | Y | Y (per-day color vectors) | Full. §8 marks "(แน่น)". |
| dream | ตำราทำนายฝัน keyword → ความหมาย + เลข (2/3/1 ตัว) | Y | Y (งู → 56/569 known numbers) | Core method present. Gap: dream-dictionary breadth (§8 "ขยายพจนานุกรมฝัน"). |

## Summary

- **Method coverage:** 21/22 match the §8 popular method (`num7` partial).
- **Reference vectors:** 20/22 carry a known-answer vector. Missing: `findlucky`, `namesuggest` (both have only structural/property/determinism tests).
- **Shallow vs spec bar:** `num7` is the one method-level gap — ฐาน 8–9 (เดินยาม) omitted, so the "9 ฐานเต็ม" §8 target is not met (documented in-engine, not silent).
- **Breadth (non-blocking) notes:** `namesuggest` pool size and `dream` dictionary size are smaller than an exhaustive "most detailed" set, though both compute correctly.
- All §8 "เดิม punt / เดิมแค่..." deepen items (natal, ascendant, lifegraph, timing, compat synastry, license letters, nameanalyze numerology, findlucky determinism, zodiacyear/kua 立春) are closed.
