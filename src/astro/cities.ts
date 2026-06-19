export type City = { name: string; lat: number; lon: number; tz: number };

// All 77 Thai provinces (provincial-capital coordinates, tz +7).
const THAI: City[] = [
  { name: "Bangkok", lat: 13.7563, lon: 100.5018, tz: 7 },
  { name: "Amnat Charoen", lat: 15.86, lon: 104.63, tz: 7 },
  { name: "Ang Thong", lat: 14.59, lon: 100.46, tz: 7 },
  { name: "Bueng Kan", lat: 18.36, lon: 103.65, tz: 7 },
  { name: "Buriram", lat: 14.99, lon: 103.1, tz: 7 },
  { name: "Chachoengsao", lat: 13.69, lon: 101.07, tz: 7 },
  { name: "Chai Nat", lat: 15.19, lon: 100.13, tz: 7 },
  { name: "Chaiyaphum", lat: 15.81, lon: 102.03, tz: 7 },
  { name: "Chanthaburi", lat: 12.61, lon: 102.1, tz: 7 },
  { name: "Chiang Mai", lat: 18.79, lon: 98.98, tz: 7 },
  { name: "Chiang Rai", lat: 19.91, lon: 99.84, tz: 7 },
  { name: "Chonburi", lat: 13.36, lon: 100.98, tz: 7 },
  { name: "Chumphon", lat: 10.49, lon: 99.18, tz: 7 },
  { name: "Kalasin", lat: 16.43, lon: 103.51, tz: 7 },
  { name: "Kamphaeng Phet", lat: 16.48, lon: 99.52, tz: 7 },
  { name: "Kanchanaburi", lat: 14.02, lon: 99.53, tz: 7 },
  { name: "Khon Kaen", lat: 16.44, lon: 102.83, tz: 7 },
  { name: "Krabi", lat: 8.09, lon: 98.91, tz: 7 },
  { name: "Lampang", lat: 18.29, lon: 99.49, tz: 7 },
  { name: "Lamphun", lat: 18.58, lon: 99.01, tz: 7 },
  { name: "Loei", lat: 17.49, lon: 101.73, tz: 7 },
  { name: "Lopburi", lat: 14.8, lon: 100.65, tz: 7 },
  { name: "Mae Hong Son", lat: 19.3, lon: 97.97, tz: 7 },
  { name: "Maha Sarakham", lat: 16.18, lon: 103.3, tz: 7 },
  { name: "Mukdahan", lat: 16.54, lon: 104.72, tz: 7 },
  { name: "Nakhon Nayok", lat: 14.21, lon: 101.21, tz: 7 },
  { name: "Nakhon Pathom", lat: 13.82, lon: 100.06, tz: 7 },
  { name: "Nakhon Phanom", lat: 17.41, lon: 104.78, tz: 7 },
  { name: "Nakhon Ratchasima", lat: 14.97, lon: 102.1, tz: 7 },
  { name: "Nakhon Sawan", lat: 15.7, lon: 100.14, tz: 7 },
  { name: "Nakhon Si Thammarat", lat: 8.43, lon: 99.96, tz: 7 },
  { name: "Nan", lat: 18.78, lon: 100.78, tz: 7 },
  { name: "Narathiwat", lat: 6.43, lon: 101.82, tz: 7 },
  { name: "Nong Bua Lamphu", lat: 17.2, lon: 102.44, tz: 7 },
  { name: "Nong Khai", lat: 17.88, lon: 102.74, tz: 7 },
  { name: "Nonthaburi", lat: 13.86, lon: 100.51, tz: 7 },
  { name: "Pathum Thani", lat: 14.02, lon: 100.53, tz: 7 },
  { name: "Pattani", lat: 6.87, lon: 101.25, tz: 7 },
  { name: "Phang Nga", lat: 8.45, lon: 98.53, tz: 7 },
  { name: "Phatthalung", lat: 7.62, lon: 100.08, tz: 7 },
  { name: "Phayao", lat: 19.17, lon: 99.9, tz: 7 },
  { name: "Phetchabun", lat: 16.42, lon: 101.16, tz: 7 },
  { name: "Phetchaburi", lat: 13.11, lon: 99.94, tz: 7 },
  { name: "Phichit", lat: 16.44, lon: 100.35, tz: 7 },
  { name: "Phitsanulok", lat: 16.82, lon: 100.27, tz: 7 },
  { name: "Phra Nakhon Si Ayutthaya", lat: 14.35, lon: 100.58, tz: 7 },
  { name: "Phrae", lat: 18.14, lon: 100.14, tz: 7 },
  { name: "Phuket", lat: 7.88, lon: 98.39, tz: 7 },
  { name: "Prachinburi", lat: 14.05, lon: 101.37, tz: 7 },
  { name: "Prachuap Khiri Khan", lat: 11.81, lon: 99.8, tz: 7 },
  { name: "Ranong", lat: 9.96, lon: 98.64, tz: 7 },
  { name: "Ratchaburi", lat: 13.54, lon: 99.81, tz: 7 },
  { name: "Rayong", lat: 12.68, lon: 101.27, tz: 7 },
  { name: "Roi Et", lat: 16.06, lon: 103.65, tz: 7 },
  { name: "Sa Kaeo", lat: 13.81, lon: 102.07, tz: 7 },
  { name: "Sakon Nakhon", lat: 17.16, lon: 104.15, tz: 7 },
  { name: "Samut Prakan", lat: 13.6, lon: 100.6, tz: 7 },
  { name: "Samut Sakhon", lat: 13.55, lon: 100.27, tz: 7 },
  { name: "Samut Songkhram", lat: 13.41, lon: 100.0, tz: 7 },
  { name: "Saraburi", lat: 14.53, lon: 100.91, tz: 7 },
  { name: "Satun", lat: 6.62, lon: 100.07, tz: 7 },
  { name: "Sing Buri", lat: 14.89, lon: 100.4, tz: 7 },
  { name: "Sisaket", lat: 15.12, lon: 104.32, tz: 7 },
  { name: "Songkhla", lat: 7.21, lon: 100.6, tz: 7 },
  { name: "Sukhothai", lat: 17.01, lon: 99.82, tz: 7 },
  { name: "Suphan Buri", lat: 14.47, lon: 100.12, tz: 7 },
  { name: "Surat Thani", lat: 9.14, lon: 99.33, tz: 7 },
  { name: "Surin", lat: 14.88, lon: 103.49, tz: 7 },
  { name: "Tak", lat: 16.87, lon: 99.13, tz: 7 },
  { name: "Trang", lat: 7.56, lon: 99.61, tz: 7 },
  { name: "Trat", lat: 12.24, lon: 102.51, tz: 7 },
  { name: "Ubon Ratchathani", lat: 15.24, lon: 104.85, tz: 7 },
  { name: "Udon Thani", lat: 17.41, lon: 102.79, tz: 7 },
  { name: "Uthai Thani", lat: 15.38, lon: 100.02, tz: 7 },
  { name: "Uttaradit", lat: 17.62, lon: 100.1, tz: 7 },
  { name: "Yala", lat: 6.54, lon: 101.28, tz: 7 },
  { name: "Yasothon", lat: 15.79, lon: 104.15, tz: 7 },
];

// Representative world-city subset (standard UTC offset; DST/historical-tz out of scope, spec §7.2).
// EXECUTOR: complete to ~120 major world cities from GeoNames "cities15000"
// (https://download.geonames.org/export/dump/) — take name, lat, lon, and the
// standard (non-DST) UTC offset of each city's timezone; keep east-positive lon,
// north-positive lat. Do NOT apply DST. Append below, keeping this representative
// set intact.
const WORLD: City[] = [
  { name: "London", lat: 51.51, lon: -0.13, tz: 0 },
  { name: "Paris", lat: 48.86, lon: 2.35, tz: 1 },
  { name: "Berlin", lat: 52.52, lon: 13.41, tz: 1 },
  { name: "Madrid", lat: 40.42, lon: -3.7, tz: 1 },
  { name: "Rome", lat: 41.9, lon: 12.5, tz: 1 },
  { name: "Moscow", lat: 55.76, lon: 37.62, tz: 3 },
  { name: "Dubai", lat: 25.2, lon: 55.27, tz: 4 },
  { name: "New Delhi", lat: 28.61, lon: 77.21, tz: 5.5 },
  { name: "Singapore", lat: 1.35, lon: 103.82, tz: 8 },
  { name: "Beijing", lat: 39.9, lon: 116.41, tz: 8 },
  { name: "Hong Kong", lat: 22.32, lon: 114.17, tz: 8 },
  { name: "Tokyo", lat: 35.68, lon: 139.69, tz: 9 },
  { name: "Seoul", lat: 37.57, lon: 126.98, tz: 9 },
  { name: "Sydney", lat: -33.87, lon: 151.21, tz: 10 },
  { name: "New York", lat: 40.71, lon: -74.01, tz: -5 },
  { name: "Los Angeles", lat: 34.05, lon: -118.24, tz: -8 },
  { name: "Chicago", lat: 41.88, lon: -87.63, tz: -6 },
  { name: "Toronto", lat: 43.65, lon: -79.38, tz: -5 },
  { name: "Sao Paulo", lat: -23.55, lon: -46.63, tz: -3 },
  { name: "Cairo", lat: 30.04, lon: 31.24, tz: 2 },
  { name: "Johannesburg", lat: -26.2, lon: 28.05, tz: 2 },
];

export const CITY: City[] = [...THAI, ...WORLD];

// ชื่อไทย → ชื่อในตาราง (อังกฤษ) — ครบ 77 จังหวัด + ชื่อเรียกที่นิยม + เมืองโลกหลัก
// แอปเป็นภาษาไทย ผู้ใช้พิมพ์ชื่อไทยต้องค้นเจอ (ไม่งั้นจะ fallback ผิดเมือง)
const TH_ALIAS: Record<string, string> = {
  กรุงเทพมหานคร: "Bangkok", กรุงเทพ: "Bangkok", กทม: "Bangkok", บางกอก: "Bangkok",
  กระบี่: "Krabi", กาญจนบุรี: "Kanchanaburi", กาฬสินธุ์: "Kalasin", กำแพงเพชร: "Kamphaeng Phet",
  ขอนแก่น: "Khon Kaen", จันทบุรี: "Chanthaburi", ฉะเชิงเทรา: "Chachoengsao", ชลบุรี: "Chonburi",
  ชัยนาท: "Chai Nat", ชัยภูมิ: "Chaiyaphum", ชุมพร: "Chumphon", เชียงราย: "Chiang Rai",
  เชียงใหม่: "Chiang Mai", ตรัง: "Trang", ตราด: "Trat", ตาก: "Tak", นครนายก: "Nakhon Nayok",
  นครปฐม: "Nakhon Pathom", นครพนม: "Nakhon Phanom", นครราชสีมา: "Nakhon Ratchasima", โคราช: "Nakhon Ratchasima",
  นครศรีธรรมราช: "Nakhon Si Thammarat", นครสวรรค์: "Nakhon Sawan", นนทบุรี: "Nonthaburi",
  นราธิวาส: "Narathiwat", น่าน: "Nan", บึงกาฬ: "Bueng Kan", บุรีรัมย์: "Buriram",
  ปทุมธานี: "Pathum Thani", ประจวบคีรีขันธ์: "Prachuap Khiri Khan", ปราจีนบุรี: "Prachinburi",
  ปัตตานี: "Pattani", พระนครศรีอยุธยา: "Phra Nakhon Si Ayutthaya", อยุธยา: "Phra Nakhon Si Ayutthaya",
  พะเยา: "Phayao", พังงา: "Phang Nga", พัทลุง: "Phatthalung", พิจิตร: "Phichit", พิษณุโลก: "Phitsanulok",
  เพชรบุรี: "Phetchaburi", เพชรบูรณ์: "Phetchabun", แพร่: "Phrae", ภูเก็ต: "Phuket",
  มหาสารคาม: "Maha Sarakham", มุกดาหาร: "Mukdahan", แม่ฮ่องสอน: "Mae Hong Son", ยโสธร: "Yasothon",
  ยะลา: "Yala", ร้อยเอ็ด: "Roi Et", ระนอง: "Ranong", ระยอง: "Rayong", ราชบุรี: "Ratchaburi",
  ลพบุรี: "Lopburi", ลำปาง: "Lampang", ลำพูน: "Lamphun", เลย: "Loei", ศรีสะเกษ: "Sisaket",
  สกลนคร: "Sakon Nakhon", สงขลา: "Songkhla", หาดใหญ่: "Songkhla", สตูล: "Satun",
  สมุทรปราการ: "Samut Prakan", สมุทรสงคราม: "Samut Songkhram", สมุทรสาคร: "Samut Sakhon",
  สระแก้ว: "Sa Kaeo", สระบุรี: "Saraburi", สิงห์บุรี: "Sing Buri", สุโขทัย: "Sukhothai",
  สุพรรณบุรี: "Suphan Buri", สุราษฎร์ธานี: "Surat Thani", สุรินทร์: "Surin", หนองคาย: "Nong Khai",
  หนองบัวลำภู: "Nong Bua Lamphu", อ่างทอง: "Ang Thong", อำนาจเจริญ: "Amnat Charoen",
  อุดรธานี: "Udon Thani", อุตรดิตถ์: "Uttaradit", อุทัยธานี: "Uthai Thani", อุบลราชธานี: "Ubon Ratchathani",
  ลอนดอน: "London", ปารีส: "Paris", โตเกียว: "Tokyo", โซล: "Seoul", สิงคโปร์: "Singapore",
  ฮ่องกง: "Hong Kong", ปักกิ่ง: "Beijing", ดูไบ: "Dubai", นิวยอร์ก: "New York", ซิดนีย์: "Sydney",
};

export function findCity(name: string): City | null {
  const raw = (name || "").trim();
  if (!raw) return null;
  const q = (TH_ALIAS[raw] ?? raw).toLowerCase();
  for (const c of CITY) {
    if (c.name.toLowerCase() === q) return c;
  }
  return null;
}
