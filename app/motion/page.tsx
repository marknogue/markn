import type { Metadata } from "next";
import { type Cell, type Media, type Row } from "./data";
import { packRows } from "../lib/mosaic";
import { sized } from "../lib/sanity/client";
import { getMotion, type Media as SanityMedia } from "../lib/sanity/queries";
import { Lightbox } from "./LightboxClient";

const round = (n: number) => Math.round(n * 1e4) / 1e4;

function buildFromSanity(items: SanityMedia[]) {
  const cells: Cell[] = items.map((m) => {
    const ar = round(m.width / m.height);
    const item: Media = {
      kind: m.type === "video" ? "video" : "gif",
      src: m.type === "video" ? m.src : sized(m.src, 900, 65),
      w: m.width,
      h: m.height,
      ar,
      caption: m.caption,
      poster: m.poster ? sized(m.poster, 900, 65) : undefined,
    };
    return { type: "single", ar, item };
  });
  const packable = cells.map((c) => ({ ar: c.ar, data: c }));
  return {
    cells,
    desktopRows: packRows(packable, 1280, 50, 320, 2),
    mobileRows: packRows(packable, 390, 14, 240, 1),
  };
}

const ROW_GAP_PCT = 5;
const ROW_MARGIN_PCT = 5;

const LIGHTBOX_CSS = `
.lightbox{position:fixed;inset:0;z-index:60;display:none;background-color:var(--white-smoke)}
.lightbox:target{display:flex}
.lb-prev{cursor:url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%3E%3Cpath%20d='M20%208L12%2016L20%2024'%20fill='none'%20stroke='white'%20stroke-width='4'%20stroke-linecap='round'%20stroke-linejoin='round'/%3E%3Cpath%20d='M20%208L12%2016L20%2024'%20fill='none'%20stroke='%23141210'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3E%3C/svg%3E") 16 16, w-resize}
.lb-next{cursor:url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%3E%3Cpath%20d='M12%208L20%2016L12%2024'%20fill='none'%20stroke='white'%20stroke-width='4'%20stroke-linecap='round'%20stroke-linejoin='round'/%3E%3Cpath%20d='M12%208L20%2016L12%2024'%20fill='none'%20stroke='%23141210'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3E%3C/svg%3E") 16 16, e-resize}
`;

function HoverOverlay({ caption }: { caption?: string }) {
  if (!caption) return null;
  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 bg-[var(--white-smoke)]/80 pointer-events-none z-10">
      <span
        className="text-[var(--brand-black)]"
        style={{
          fontFamily: "var(--font-grand), serif",
          fontSize: "clamp(13px, 1.1vw, 16px)",
          letterSpacing: "0.01em",
        }}
      >
        {caption}
      </span>
    </div>
  );
}

function HoverBorder() {
  return (
    <div className="absolute inset-0 border border-transparent group-hover/card:border-[var(--brand-black)] transition-colors duration-300 pointer-events-none z-20" />
  );
}

function MediaTile({ item }: { item: Media }) {
  if (item.kind === "video") {
    if (item.poster) {
      return (
        <img
          src={item.poster}
          alt="Motion film by Markn"
          loading="lazy"
          decoding="async"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      );
    }
    return (
      <video
        src={item.src}
        data-grid-video
        muted
        loop
        playsInline
        preload="none"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  }
  return (
    <img
      src={item.src}
      alt="Motion still by Markn"
      loading="lazy"
      decoding="async"
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
}

function CellTile({ cell, cellIdx }: { cell: Cell; cellIdx: number }) {
  return (
    <a
      href={`#mo-lb-${cellIdx}`}
      className="group/card relative overflow-hidden block h-full min-w-0"
      style={{ flex: `${cell.ar} 0 0` }}
    >
      <MediaTile item={cell.item} />
      <HoverOverlay caption={cell.item.caption} />
      <HoverBorder />
    </a>
  );
}

function MosaicGrid({
  rows,
  rowGap = ROW_GAP_PCT,
  rowMargin = ROW_MARGIN_PCT,
  packWidth,
  packGap,
  maxH,
}: {
  rows: Row[];
  rowGap?: number;
  rowMargin?: number;
  packWidth: number;
  packGap: number;
  maxH: number;
}) {
  let idx = 0;
  return (
    <>
      {rows.map((row, ri) => {
        const ar = row.ar / (1 - (rowGap / 100) * (row.cells.length - 1));
        const naturalH = (packWidth - packGap * (row.cells.length - 1)) / row.ar;
        const widthPct = naturalH > maxH ? (maxH / naturalH) * 100 : 100;
        return (
          <div
            key={ri}
            className="flex mr-auto"
            style={{
              width: `${widthPct}%`,
              aspectRatio: ar,
              gap: `${rowGap}%`,
              marginBottom: `${rowMargin}%`,
            }}
          >
            {row.cells.map((cell, ci) => {
              const cellIdx = idx++;
              return <CellTile key={ci} cell={cell} cellIdx={cellIdx} />;
            })}
          </div>
        );
      })}
    </>
  );
}

export const metadata: Metadata = {
  title: "Motion",
  description:
    "Moving image work by London based photographer and director Markn — fashion and documentary films.",
  alternates: { canonical: "/motion" },
  openGraph: {
    title: "Motion — Markn",
    description:
      "Moving image work by London based photographer and director Markn — fashion and documentary films.",
    url: "/motion",
  },
};

export async function MotionSection({ id }: { id?: string }) {
  const media = await getMotion();
  const { cells: allCells, desktopRows, mobileRows } = buildFromSanity(media || []);

  return (
    <section
      id={id}
      className="pt-[88px] md:pt-[130px] pb-[6em] md:pb-[10em]"
      style={{ backgroundColor: "var(--white-smoke)", color: "var(--brand-black)" }}
    >
      <style dangerouslySetInnerHTML={{ __html: LIGHTBOX_CSS }} />

      <div
        className="section-name sticky z-20 text-center pb-[1em] md:pb-[2em]"
        style={{ top: 0, paddingTop: "clamp(63px, 7.5vw, 93px)" }}
      >
        <span
          style={{
            fontFamily: "var(--font-display), serif",
            fontSize: "clamp(18px, 1.7vw, 23px)",
            fontWeight: 300,
            letterSpacing: "0.01em",
            lineHeight: "1.6",
          }}
        >
          Motion
        </span>
      </div>

      <div className="px-3 md:hidden">
        <MosaicGrid
          rows={mobileRows}
          rowGap={16}
          rowMargin={16}
          packWidth={390}
          packGap={14}
          maxH={240}
        />
      </div>

      <div className="hidden md:block px-6 lg:px-10 max-w-[1400px] mx-auto">
        <MosaicGrid rows={desktopRows} packWidth={1280} packGap={50} maxH={320} />
      </div>

      {allCells.map((cell, i) => (
        <Lightbox key={i} cell={cell} index={i} total={allCells.length} />
      ))}
    </section>
  );
}

export default function MotionPage() {
  return (
    <main>
      <MotionSection />
    </main>
  );
}
