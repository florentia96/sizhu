import { useEffect, useRef } from "react";

interface Petal {
  x: number; y: number; vy: number; sway: number; swayA: number; swaySpeed: number;
  rot: number; vr: number; size: number; op: number; deep: boolean;
}

// พื้นหลังกลีบดอกไม้ปลิว (เฉพาะหน้าผล) — โทน rose gold นุ่ม เข้าได้ทั้งสว่าง/มืด
// canvas วาดด้วยค่าสีตรง (อ้าง var() ไม่ได้) — สีกลีบล้อโทน --gold rose gold
// ไม่ mount เมื่อผู้ใช้ขอลดการเคลื่อนไหว
export function PetalCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = cv.getContext("2d");
    } catch {
      return; // สภาพแวดล้อมที่ไม่รองรับ canvas (เช่น jsdom) — ข้ามเอฟเฟกต์
    }
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let W = 0;
    let H = 0;
    let raf = 0;

    const resize = (): void => {
      W = window.innerWidth;
      H = window.innerHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      cv.style.width = `${W}px`;
      cv.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const mk = (seed: boolean): Petal => ({
      x: Math.random() * W,
      y: seed ? Math.random() * H : -30 - Math.random() * 120,
      vy: 0.5 + Math.random() * 1.0,
      sway: 0.5 + Math.random() * 1.3,
      swayA: Math.random() * Math.PI * 2,
      swaySpeed: 0.008 + Math.random() * 0.022,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.05,
      size: 6 + Math.random() * 8,
      op: 0.45 + Math.random() * 0.45,
      deep: Math.random() < 0.45,
    });
    const petals: Petal[] = Array.from({ length: 28 }, () => mk(true));

    const draw = (p: Petal): void => {
      const s = p.size;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.op;
      const g = ctx.createLinearGradient(0, -s, 0, s);
      if (p.deep) {
        g.addColorStop(0, "#c98a93");
        g.addColorStop(1, "#b76e79");
      } else {
        g.addColorStop(0, "#f0e3df");
        g.addColorStop(1, "#e6c9cf");
      }
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.72, -s * 0.5, s * 0.5, s * 0.62, 0, s);
      ctx.bezierCurveTo(-s * 0.5, s * 0.62, -s * 0.72, -s * 0.5, 0, -s);
      ctx.fill();
      ctx.globalAlpha = p.op * 0.4;
      ctx.strokeStyle = "rgba(120,80,90,.4)";
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.62);
      ctx.lineTo(0, s * 0.6);
      ctx.stroke();
      ctx.restore();
    };

    const loop = (): void => {
      ctx.clearRect(0, 0, W, H);
      for (const p of petals) {
        p.y += p.vy;
        p.swayA += p.swaySpeed;
        p.x += Math.sin(p.swayA) * p.sway * 0.6;
        p.rot += p.vr;
        if (p.y > H + 30) Object.assign(p, mk(false));
        draw(p);
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="petals" aria-hidden="true" />;
}
