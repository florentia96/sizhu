import type { Field } from "../../app/feature";
import { ZODIAC } from "../_shared/sixtyCycle";

const ANIMALS = ZODIAC.map((z) => z.th);

export const fields: Field[] = [
  { label: "นักษัตรฝ่ายแรก", type: "select", options: ANIMALS },
  { label: "นักษัตรฝ่ายที่สอง", type: "select", options: ANIMALS },
];
