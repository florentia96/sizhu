import { useEffect, useRef } from "react";

interface Petal {
  x: number; y: number; vy: number; sway: number; swayA: number; swaySpeed: number;
  rot: number; vr: number; size: number; op: number; deep: boolean;
}

// Falling flower-petal background (result pages only) - champagne gold tone (starlight), works in both light/dark
// Canvas draws with literal color values (cannot reference var()) - petal color echoes the --gold champagne tone
// Not mounted when the user requests reduced motion
export function PetalCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = cv.getContext("2d");
    } catch {
      return; // Environments without canvas support (e.g. jsdom) - skip the effect
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
        g.addColorStop(0, "#e0c074");
        g.addColorStop(1, "#bd9436");
      } else {
        g.addColorStop(0, "#f4ecd8");
        g.addColorStop(1, "#e6d5b0");
      }
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.72, -s * 0.5, s * 0.5, s * 0.62, 0, s);
      ctx.bezierCurveTo(-s * 0.5, s * 0.62, -s * 0.72, -s * 0.5, 0, -s);
      ctx.fill();
      ctx.globalAlpha = p.op * 0.4;
      ctx.strokeStyle = "rgba(110,80,35,.4)";
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
