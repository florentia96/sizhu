import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

// deploy origin (ตรงกับ canonical ใน index.html) — base "/sizhu/" รวมอยู่ใน SITE แล้ว
const SITE = "https://florentia96.github.io/sizhu";

interface Feat {
  id: string;
  name: string;
  desc: string;
}

// อ่าน id/name/desc จาก meta.ts ของทุกฟีเจอร์ตอน build (source of truth เดียว ไม่ duplicate)
// ฟอร์แมต meta.ts สม่ำเสมอ (ค่าเป็น string ลิเทอรัล ไม่มี " ซ้อน) — parse ไม่ได้ = โยน error ให้ build แดง
function readFeatures(root: string): Feat[] {
  const dir = path.join(root, "src", "features");
  const feats: Feat[] = [];
  for (const name of fs.readdirSync(dir)) {
    const metaPath = path.join(dir, name, "meta.ts");
    if (!fs.existsSync(metaPath)) continue;
    const src = fs.readFileSync(metaPath, "utf8");
    const id = src.match(/id:\s*"([^"]+)"/)?.[1];
    const fname = src.match(/name:\s*"([^"]+)"/)?.[1];
    const desc = src.match(/desc:\s*"([^"]+)"/)?.[1];
    if (!id || !fname || !desc) throw new Error(`[seo] parse meta.ts ไม่ได้ที่ฟีเจอร์ "${name}"`);
    feats.push({ id, name: fname, desc });
  }
  if (feats.length < 20) throw new Error(`[seo] เจอแค่ ${feats.length} ฟีเจอร์ — น่าจะ parse พลาด`);
  return feats;
}

const esc = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// path ในเว็บ (bazi ใช้หน้าเต็ม /bazi · ที่เหลือ /f/{id}) — ตรงกับ routes.ts/hrefFor
const urlPath = (id: string): string => (id === "bazi" ? "/bazi" : `/f/${id}`);
// ไฟล์ใน dist แบบ flat .html → GitHub Pages เสิร์ฟ /f/dream จาก f/dream.html ตรงๆ ไม่ redirect
const filePath = (id: string): string => (id === "bazi" ? "bazi.html" : `f/${id}.html`);

function replaceOnce(html: string, re: RegExp, repl: string, label: string): string {
  if (!re.test(html)) throw new Error(`[seo] หา pattern ไม่เจอใน index.html: ${label}`);
  return html.replace(re, repl);
}

function featureHtml(template: string, f: Feat): string {
  const fullUrl = SITE + urlPath(f.id);
  const title = `${f.name} · MooDee`;
  let html = template;
  html = replaceOnce(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`, "title");
  html = replaceOnce(html, /(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${esc(f.desc)}$2`, "description");
  html = replaceOnce(html, /(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${esc(title)}$2`, "og:title");
  html = replaceOnce(html, /(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${esc(f.desc)}$2`, "og:description");
  html = replaceOnce(html, /(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${fullUrl}$2`, "og:url");
  html = replaceOnce(html, /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, `$1${esc(title)}$2`, "twitter:title");
  html = replaceOnce(html, /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${esc(f.desc)}$2`, "twitter:description");
  html = replaceOnce(html, /(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${fullUrl}$2`, "canonical");

  const ld = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: title,
    url: fullUrl,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    inLanguage: "th",
    description: f.desc,
    isPartOf: { "@type": "WebSite", name: "MooDee", url: `${SITE}/` },
    offers: { "@type": "Offer", price: "0", priceCurrency: "THB" },
  };
  const ldTag = `<script type="application/ld+json">${JSON.stringify(ld)}</script>`;
  html = html.replace("</head>", `${ldTag}\n  </head>`);

  // เนื้อหา static ใน #root — crawler ที่ไม่รัน JS เห็นชื่อ+คำอธิบาย (React แทนที่ตอน mount)
  const intro =
    `<div id="root"><main style="max-width:680px;margin:0 auto;padding:48px 22px;font-family:'Anuphan',system-ui,sans-serif">` +
    `<h1>${esc(f.name)}</h1><p>${esc(f.desc)}</p>` +
    `<p><a href="${SITE}/">MooDee — ดูดวงครบ จบในที่เดียว 22 บริการ</a></p></main></div>`;
  html = replaceOnce(html, /<div id="root">\s*<\/div>/, intro, "#root");
  return html;
}

function sitemap(feats: Feat[], isoDate: string): string {
  const urls = [`${SITE}/`, ...feats.map((f) => SITE + urlPath(f.id))];
  const body = urls
    .map((u) => `  <url><loc>${u}</loc><lastmod>${isoDate}</lastmod></url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export function seoPlugin(): Plugin {
  let root = process.cwd();
  let outDir = "dist";
  return {
    name: "moodee-seo",
    apply: "build",
    configResolved(c) {
      root = c.root;
      outDir = c.build.outDir;
    },
    closeBundle() {
      const dist = path.isAbsolute(outDir) ? outDir : path.join(root, outDir);
      const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
      const feats = readFeatures(root);

      // SPA fallback — GitHub Pages เสิร์ฟ 404.html ทุก path ที่ไม่มีไฟล์ตรง
      fs.writeFileSync(path.join(dist, "404.html"), template);

      for (const f of feats) {
        const out = path.join(dist, filePath(f.id));
        fs.mkdirSync(path.dirname(out), { recursive: true });
        fs.writeFileSync(out, featureHtml(template, f));
      }

      const iso = new Date().toISOString().slice(0, 10);
      fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap(feats, iso));
      fs.writeFileSync(
        path.join(dist, "robots.txt"),
        `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`,
      );

      console.log(`[seo] prerendered ${feats.length} feature pages + sitemap + 404 + robots`);
    },
  };
}
