import type { ReactNode } from "react";

// แผงผลแต่ละหัวข้อ — เผยขึ้นด้วย fadeUp (หน่วงตาม delay) · หัวข้อเป็น <h2> เพื่อ a11y
export function Panel({
  mark,
  title,
  delay,
  children,
}: {
  mark: string;
  title: string;
  delay: number;
  children: ReactNode;
}) {
  return (
    <div className="reveal" style={{ animationDelay: `${delay}s` }}>
      <section className="panel" aria-labelledby={`panel-${mark}`}>
        <h2 className="panel-head" id={`panel-${mark}`}>
          <span className="mk" aria-hidden="true">{mark}</span>
          {title}
        </h2>
        {children}
      </section>
    </div>
  );
}
