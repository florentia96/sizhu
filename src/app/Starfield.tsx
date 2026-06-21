// ม่านละอองฟ้าอรุณ — พื้นหลังหลักวาดด้วย body::before (tokens.css)
// ชั้นนี้เติม "ละออง/ดาว" จาง ๆ ที่ปรับสีตามธีมผ่าน --star-dot (สว่าง=ละอองลาเวนเดอร์, มืด=ดาวขาว)
export function Starfield() {
  return <div aria-hidden className="starfield" />;
}
