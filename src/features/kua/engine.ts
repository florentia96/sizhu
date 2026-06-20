import type { Section } from "../../shared/sections/types";
import type { FeatureEngine } from "../../app/feature";
import { toCE, lichunCE } from "../zodiacyear/engine";
import {
  KUA_DIR, GOOD_NAME, BAD_NAME, DIR_TH, GROUP_INFO, JADE, GOLD, RED,
} from "./content";

export function sumDigits(s: string): number {
  return (s.match(/\d/g) ?? []).reduce((a, d) => a + Number(d), 0);
}

export function reduceSingle(n: number): number {
  let x = n;
  while (x > 9) x = String(x).split("").reduce((a, d) => a + Number(d), 0);
  return x;
}

export function kuaNumber(ce: number, gender: string): number {
  // สูตร Eight Mansions มาตรฐาน ใช้ 2 หลักท้ายของปี ค.ศ.
  // ค่าคงที่สลับตอนปี 2000 (10−s vs 9−s / s+5 vs s+6) ออกแบบมาเพื่อ 2 หลักท้ายโดยเฉพาะ
  const s = reduceSingle(sumDigits(String(ce).slice(-2)));
  const male = gender === "ชาย";
  let k: number;
  if (ce >= 2000) {
    k = male ? 9 - s : s + 6;
  } else {
    k = male ? 10 - s : s + 5;
  }
  k = reduceSingle(k);
  if (k === 0) k = 9;
  if (male && k === 5) k = 2;
  if (!male && k === 5) k = 8;
  return k;
}

export function isEastGroup(k: number): boolean {
  return [1, 3, 4, 9].indexOf(k) >= 0;
}

export function kuaReport(ce: number, gender: string): Section[] {
  const k = kuaNumber(ce, gender);
  const dirs = KUA_DIR[k];
  const east = isEastGroup(k);
  const group = GROUP_INFO[east ? "east" : "west"];

  // ชื่อทิศ (ไทย) ของแต่ละตำแหน่งตามลำดับ KUA_DIR
  const D = (i: number) => DIR_TH[dirs[i]];
  const shengQi = D(0);
  const tianYi = D(1);
  const yanNian = D(2);
  const jueMing = D(7);

  const goodItems = GOOD_NAME.map((g, i) => ({
    title: g.th + " (" + g.cn + ") — " + g.short,
    tag: DIR_TH[dirs[i]],
    accent: i === 0 ? JADE : GOLD,
    text: g.d + " วิธีใช้: " + g.use,
    chips: [DIR_TH[dirs[i]]],
  }));

  const badItems = BAD_NAME.map((g, i) => ({
    name: g.th + " (" + g.cn + ")",
    value: DIR_TH[dirs[i + 4]] + " — " + g.short,
    note: g.d + " วิธีรับมือ: " + g.use,
  }));

  const secs: Section[] = [];
  secs.push({
    kind: "verdict",
    score: 0,
    hideRing: true,
    grade: "กัว " + k,
    gradeLabel: group.name,
    accent: JADE,
    summary:
      "เลขกัว " + k + " อยู่ใน" + group.name +
      " ทิศมงคลของคุณคือ " + group.dirs +
      " ใช้จัดทิศโต๊ะทำงาน หัวเตียง และประตูหลักเพื่อเสริมดวง",
    meta: "คำนวณจากปีเกิด ค.ศ. " + ce + " และเพศ ตามวิชาฮวงจุ้ยแปดทิศ (Eight Mansions)",
  });

  secs.push({
    kind: "prose",
    title: "กลุ่มทิศของคุณ",
    glyph: east ? "東" : "西",
    accent: JADE,
    paras: [
      {
        h: group.name,
        t: group.meaning + " ทิศมงคลทั้งสี่ของกลุ่มนี้คือ " + group.dirs,
      },
      {
        h: "หลักการใช้งาน",
        t: "ทิศมงคลใช้กับสิ่งที่ต้องการพลังดี เช่น หันหน้าขณะทำงาน หันหัวเตียง และทางเข้าหลัก " +
          "ส่วนทิศที่ควรเลี่ยงให้จัดเป็นพื้นที่ที่ไม่ได้อยู่ประจำ เช่น ห้องเก็บของหรือห้องน้ำ",
      },
    ],
  });

  secs.push({
    kind: "blocks",
    title: "4 ทิศมงคล (เรียงจากดีสุด)",
    glyph: "吉",
    items: goodItems,
  });

  secs.push({
    kind: "grid",
    title: "4 ทิศที่ควรเลี่ยง (เรียงจากเบาไปหนัก)",
    glyph: "凶",
    accent: RED,
    cells: badItems,
  });

  secs.push({
    kind: "prose",
    title: "นำไปใช้จริงในบ้าน",
    glyph: "宅",
    accent: JADE,
    paras: [
      {
        h: "โต๊ะทำงาน",
        t: "หันหน้า (ทิศที่หน้าหันไปขณะนั่ง) ไปทาง" + shengQi +
          " ซึ่งเป็นทิศเซิงชี่ เพื่อเสริมการงานและโชคลาภ",
      },
      {
        h: "หัวเตียงนอน",
        t: "หันหัวเตียงไปทาง" + tianYi + " ซึ่งเป็นทิศเทียนอีเพื่อเสริมสุขภาพ " +
          "หรือทาง" + yanNian + " ซึ่งเป็นทิศเหยียนเหนียนเพื่อเสริมความรัก",
      },
      {
        h: "เตาไฟและครัว",
        t: "ในวิชาฮวงจุ้ยแปดทิศ เตาควรตั้งอยู่ในโซนทิศที่ควรเลี่ยง แต่หันหน้าเตา " +
          "(ด้านที่จุดไฟหรือปุ่มเปิด) ไปทางทิศมงคล เพื่อเปลี่ยนพลังร้ายให้เป็นดี",
      },
      {
        h: "ประตูหลักและสิ่งที่ควรเลี่ยง",
        t: "ให้ประตูหลักรับพลังจากทิศมงคลข้างต้น และอย่าหันหัวเตียงหรือประตูหลักไปทาง" +
          jueMing + " ซึ่งเป็นทิศเจวี๋ยมิ่ง อันเป็นทิศร้ายที่สุด",
      },
    ],
  });

  secs.push({
    kind: "note",
    text:
      "คำนวณตามวิชาฮวงจุ้ยแปดทิศ (Eight Mansions) ซึ่งเปลี่ยนรอบปีราววันที่ 4 กุมภาพันธ์ของทุกปี ไม่ใช่ 1 มกราคม " +
      "หากเกิดช่วงต้นปีก่อน 4 กุมภาพันธ์และไม่ได้กรอกวันเกิด ให้ลองคำนวณโดยใช้ปีก่อนหน้าเทียบดูด้วย",
  });
  return secs;
}

export const engine: FeatureEngine = {
  build(vals: string[]): Section[] {
    const ce = toCE(vals[0] ?? "");
    const gender = (vals[1] ?? "").trim();
    if (ce == null || (gender !== "ชาย" && gender !== "หญิง"))
      return [{ kind: "note", text: "กรุณากรอกปีเกิด (พ.ศ.) และเลือกเพศ" }];
    if (ce < 1900 || ce > 2100)
      return [{ kind: "note", text: "กรุณากรอกปีเกิดให้ถูกต้อง (ค.ศ. 1900–2100 หรือ พ.ศ. 2443–2643)" }];
    const dateStr = (vals[2] ?? "").trim();
    let effectiveCE = ce;
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
    if (m) {
      effectiveCE = lichunCE(parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10));
    }
    return kuaReport(effectiveCE, gender);
  },
};
