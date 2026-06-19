import type { Field } from "../../app/feature";
import { ZODIAC } from "../_shared/sixtyCycle";

const ANIMALS = ZODIAC.map((z) => z.th);

const ZODIAC_HINT =
  "ชื่อปีนักษัตรไทย — ชวด(หนู) ฉลู(วัว) ขาล(เสือ) เถาะ(กระต่าย) มะโรง(มังกร) มะเส็ง(งู) มะเมีย(ม้า) มะแม(แพะ) วอก(ลิง) ระกา(ไก่) จอ(หมา) กุน(หมู)";

export const fields: Field[] = [
  { label: "นักษัตรฝ่ายแรก", type: "select", options: ANIMALS, hint: ZODIAC_HINT },
  { label: "นักษัตรฝ่ายที่สอง", type: "select", options: ANIMALS },
];
