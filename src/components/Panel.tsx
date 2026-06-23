import type { ReactNode } from "react";

// One result panel per topic - revealed with fadeUp (staggered by delay) - heading is an <h2> for a11y
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
