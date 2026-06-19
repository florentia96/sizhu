export interface BaziPrefill {
  date?: string;
  time?: string;
  autocast: boolean;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{1,2}:\d{2}$/;

// แปลง ?bd=YYYY-MM-DD&bt=HH:mm → prefill — สะท้อน _prefillFromURL ของ template:
// "bd มี ⇒ เริ่มที่ casting" ; bt ใช้ default 12:00 ถ้าไม่มี (จัดการที่ชั้น run ไม่ใช่ที่นี่)
export function parseBaziParams(query: string): BaziPrefill {
  const q = new URLSearchParams(query.replace(/^\?/, ""));
  const bd = q.get("bd");
  if (!bd || !DATE_RE.test(bd)) return { autocast: false };
  const out: BaziPrefill = { date: bd, autocast: true };
  const bt = q.get("bt");
  if (bt && TIME_RE.test(bt)) out.time = bt;
  return out;
}
