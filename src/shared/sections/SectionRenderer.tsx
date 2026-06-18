import type { Section } from "./types";
import { VerdictCard } from "./cards/VerdictCard";
import { RowsCard } from "./cards/RowsCard";
import { BlocksCard } from "./cards/BlocksCard";
import { GridCard } from "./cards/GridCard";
import { CardsCard } from "./cards/CardsCard";
import { SwatchesCard } from "./cards/SwatchesCard";
import { ProseCard } from "./cards/ProseCard";
import { CompatCard } from "./cards/CompatCard";
import { NoteCard } from "./cards/NoteCard";

function renderOne(section: Section, accent: string) {
  switch (section.kind) {
    case "verdict":
      return <VerdictCard section={section} accent={accent} />;
    case "rows":
      return <RowsCard section={section} />;
    case "blocks":
      return <BlocksCard section={section} />;
    case "grid":
      return <GridCard section={section} accent={accent} />;
    case "cards":
      return <CardsCard section={section} accent={accent} />;
    case "swatches":
      return <SwatchesCard section={section} accent={accent} />;
    case "prose":
      return <ProseCard section={section} accent={accent} />;
    case "compat":
      return <CompatCard section={section} accent={accent} />;
    case "note":
      return <NoteCard section={section} />;
    default: {
      const _exhaustive: never = section;
      return _exhaustive;
    }
  }
}

export function SectionRenderer({ sections, accent }: { sections: Section[]; accent: string }) {
  return (
    <div>
      {sections.map((s, i) => (
        <div key={i} style={{ marginBottom: 14 }}>
          {renderOne(s, accent)}
        </div>
      ))}
    </div>
  );
}
