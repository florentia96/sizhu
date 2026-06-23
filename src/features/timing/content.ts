// 0=Sunday 1=Monday 2=Tuesday 3=Wednesday 4=Thursday 5=Friday 6=Saturday
export const WEEKDAY_TH = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

export interface ActivityRule {
  // Weekdays the Thai texts favor for this task (ordered most suitable first)
  favorDow: number[];
  // Weekdays the Thai texts say to avoid specifically for this task
  avoidDow: number[];
  // prefer the waxing moon (true) or accept the waning moon (false = not emphasized)
  preferWaxing: boolean;
  // Brief principle (complete sentence, polite neutral tone)
  principle: string;
  // Task-specific advice - appended when summarizing the guidance
  guidance: string;
}

// Source of the weekday conventions: general Thai auspicious-timing texts
//   wedding favors Friday (Venus = love) - housewarming favors Thursday/Monday, avoid Saturday/Tuesday
//   shop opening favors Thursday/Wednesday (trade, finance) - new car favors Thursday/Friday, avoid Saturday (Saturn = obstacles)
//   signing a contract favors Thursday/Monday (stability, communication)
export const ACTIVITY: Record<string, ActivityRule> = {
  ขึ้นบ้านใหม่: {
    favorDow: [4, 1, 3],
    avoidDow: [6, 2],
    preferWaxing: true,
    principle:
      "งานขึ้นบ้านใหม่นิยมวันพฤหัสบดีและวันจันทร์ในช่วงข้างขึ้น เพราะถือเป็นการเริ่มต้นที่หนุนความเจริญและความร่มเย็นของบ้าน โดยเลี่ยงวันเสาร์และวันอังคารซึ่งตำราถือว่าให้โทษ",
    guidance:
      "ควรทำพิธีช่วงเช้าและเลือกวันที่ตรงข้างขึ้นเพื่อเสริมความเจริญของบ้าน หากเลือกวันพฤหัสบดีได้จะถือว่าเป็นมงคลที่สุดสำหรับงานนี้",
  },
  แต่งงาน: {
    favorDow: [5, 4, 3],
    avoidDow: [2, 6],
    preferWaxing: true,
    principle:
      "งานแต่งงานนิยมวันศุกร์เป็นอันดับแรกตามคติดาวศุกร์อันเป็นดาวแห่งความรัก รองลงมาคือวันพฤหัสบดี โดยเลือกช่วงข้างขึ้นและถือว่าวันที่เป็นเลขคู่เป็นมงคล",
    guidance:
      "ควรเลือกวันที่ตรงข้างขึ้นและเป็นเลขคู่ ตามธรรมเนียมถือว่าหนุนให้ชีวิตคู่ราบรื่น โดยเลี่ยงวันอังคารและวันเสาร์",
  },
  "เปิดร้าน/ธุรกิจ": {
    favorDow: [4, 3, 5],
    avoidDow: [6, 0],
    preferWaxing: true,
    principle:
      "งานเปิดร้านหรือเริ่มธุรกิจนิยมวันพฤหัสบดีและวันพุธ ตามคติที่ถือว่าหนุนการค้าและการเงิน โดยเลือกฤกษ์ช่วงเช้าและช่วงข้างขึ้นเพื่อเสริมความเจริญรุ่งเรือง",
    guidance:
      "ควรเปิดกิจการช่วงเช้าและเลือกวันที่ตรงข้างขึ้นเพื่อเสริมกระแสการค้าให้เติบโต โดยเลี่ยงวันเสาร์และวันอาทิตย์ซึ่งถือว่าไม่หนุนการเริ่มต้น",
  },
  ออกรถ: {
    favorDow: [4, 5, 3],
    avoidDow: [6, 2],
    preferWaxing: true,
    principle:
      "งานออกรถนิยมวันพฤหัสบดีและวันศุกร์ และให้เลี่ยงวันเสาร์เป็นสำคัญ ตามคติดาวเสาร์ที่ถือว่านำมาซึ่งอุปสรรค โดยนิยมรับรถช่วงเช้า",
    guidance:
      "ควรรับรถช่วงเช้าและเลี่ยงวันเสาร์เป็นอันดับแรก การเลือกวันที่ตรงข้างขึ้นถือว่าช่วยเสริมความราบรื่นในการใช้รถ",
  },
  เซ็นสัญญา: {
    favorDow: [4, 1, 3],
    avoidDow: [2, 6],
    preferWaxing: true,
    principle:
      "งานเซ็นสัญญานิยมวันพฤหัสบดีและวันจันทร์ในช่วงข้างขึ้น ตามคติที่ถือว่าหนุนความมั่นคงของข้อตกลงและการสื่อสารที่ราบรื่น",
    guidance:
      "ควรเลือกวันที่ตรงข้างขึ้นเพื่อเสริมความมั่นคงของข้อตกลง และตรวจทานเงื่อนไขให้ครบถ้วนก่อนลงนามในวันที่เลือกไว้",
  },
};

export const YAM_MONGKOL =
  "ช่วงเช้าเวลาประมาณ 06:00 ถึง 09:00 น. ถือเป็นยามอุดมมงคลสำหรับการเริ่มสิ่งใหม่ การประกอบพิธีในช่วงนี้ถือว่าเป็นสิริมงคล";

// Explanation of the four kala-yok meanings (polite neutral tone)
export const KALA_MEANING: Record<string, string> = {
  ธงชัย:
    "วันธงชัยถือเป็นวันแห่งชัยชนะและความสำเร็จ ตำราว่าเหมาะกับการเริ่มงานที่เกี่ยวกับวัตถุ สถานที่ และการก่อร่างสร้างตัว",
  อธิบดี:
    "วันอธิบดีถือเป็นวันแห่งอำนาจและบารมี ตำราว่าเหมาะกับงานที่เกี่ยวกับบุคคลและการเป็นใหญ่ ให้คุณด้านความมั่นคงและการปกครอง",
  อุบาทว์:
    "วันอุบาทว์ถือเป็นวันให้โทษ ตำราว่าไม่เหมาะกับการประกอบการมงคล ควรเลี่ยงการเริ่มงานสำคัญ",
  โลกาวินาศ:
    "วันโลกาวินาศถือเป็นวันให้โทษหนัก ตำราว่าไม่เหมาะกับการประกอบการมงคลทุกชนิด ควรเลี่ยงการเริ่มงานสำคัญ",
};
