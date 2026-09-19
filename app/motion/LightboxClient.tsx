"use client";

import { useHash } from "../hooks/useHash";
import { type Cell, type Media } from "./data";

function LightboxMedia({ item }: { item: Media }) {
  if (item.kind === "video") {
    return (
      <video
        ref={(el) => {
          if (!el) return;
          const p = el.play();
          if (p && p.catch) p.catch(() => {});
        }}
        src={item.src}
        loop
        playsInline
        controls
        autoPlay
        preload="auto"
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          width: "auto",
          height: "auto",
          objectFit: "contain",
          pointerEvents: "auto",
        }}
      />
    );
  }
  return (
    <img
      src={item.src}
      alt="Motion still by Markn"
      loading="lazy"
      decoding="async"
      style={{
        maxWidth: "100%",
        maxHeight: "100%",
        width: "auto",
        height: "auto",
        objectFit: "contain",
      }}
    />
  );
}

export function Lightbox({
  cell,
  index,
  total,
}: {
  cell: Cell;
  index: number;
  total: number;
}) {
  const hash = useHash();
  const base = `mo-lb-${index}`;
  const isActive = hash === `#${base}`;

  if (!isActive) {
    return <div id={base} className="lightbox" />;
  }

  const prev = (index - 1 + total) % total;
  const next = (index + 1) % total;
  const isVideo = cell.item.kind === "video";

  const btnBase =
    "absolute z-30 flex items-center justify-center text-[var(--brand-black)] no-underline";

  return (
    <div id={base} className="lightbox">
      <div
        className="absolute top-0 left-0 right-0 z-30 text-center pointer-events-none"
        style={{
          backgroundColor: "var(--white-smoke)",
          padding: "20px 36px",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-times), serif",
            fontSize: "clamp(13px, 1.3vw, 16px)",
            lineHeight: "1.5",
            letterSpacing: "0.01em",
          }}
        >
          <strong style={{ fontWeight: 700 }}>Markn</strong>
          <span style={{ opacity: 0.6 }}>
            {" "}
            / Motion{cell.item.caption ? ` / ${cell.item.caption}` : ""}
          </span>
        </h2>
      </div>

      <a
        href={`#mo-lb-${prev}`}
        aria-label="Previous"
        className={`${btnBase} lb-prev top-0 left-0`}
        style={{ width: "30%", height: "100%" }}
      />
      <a
        href={`#mo-lb-${next}`}
        aria-label="Next"
        className={`${btnBase} lb-next top-0 right-0`}
        style={{ width: "30%", height: "100%" }}
      />

      <a
        href="#!"
        aria-label="Close"
        className={`${btnBase} z-40 leading-none hover:opacity-60 transition-opacity`}
        style={{
          top: "4px",
          right: "8px",
          width: "44px",
          height: "44px",
          fontFamily: "var(--font-times), serif",
          fontSize: "30px",
        }}
      >
        ×
      </a>

      <div
        className={`absolute left-0 right-0 flex items-center justify-center px-0 md:px-[120px] ${
          isVideo ? "z-40" : "pointer-events-none"
        }`}
        style={{ top: "70px", bottom: "70px" }}
      >
        <LightboxMedia item={cell.item} />
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 z-30 text-center pointer-events-none"
        style={{ padding: "20px 36px", color: "var(--brand-black)" }}
      >
        <span
          style={{
            fontFamily: "var(--font-times), serif",
            fontSize: "clamp(12px, 1.2vw, 15px)",
            letterSpacing: "0.04em",
          }}
        >
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
