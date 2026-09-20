"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useHash } from "../hooks/useHash";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Preloader } from "./Preloader";
import { isFullWidth, type Item, type Placed, type GalleryImg } from "../lib/home";
import { packRows } from "../lib/mosaic";

type PreImg = { src: string; w: number; h: number };

gsap.registerPlugin(useGSAP, ScrollTrigger);

const HLB_CSS = `
.hlb{position:fixed;inset:0;z-index:70;display:none;overflow-y:auto;overscroll-behavior:contain;background-color:var(--white-smoke)}
.hlb:target{display:block}
.hlb-one{position:fixed;inset:0;z-index:70;display:none;background-color:var(--white-smoke)}
.hlb-one:target{display:block}
.hlb-prev{cursor:url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%3E%3Cpath%20d='M20%208L12%2016L20%2024'%20fill='none'%20stroke='white'%20stroke-width='4'%20stroke-linecap='round'%20stroke-linejoin='round'/%3E%3Cpath%20d='M20%208L12%2016L20%2024'%20fill='none'%20stroke='%23141210'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3E%3C/svg%3E") 16 16, w-resize}
.hlb-next{cursor:url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%3E%3Cpath%20d='M12%208L20%2016L12%2024'%20fill='none'%20stroke='white'%20stroke-width='4'%20stroke-linecap='round'%20stroke-linejoin='round'/%3E%3Cpath%20d='M12%208L20%2016L12%2024'%20fill='none'%20stroke='%23141210'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3E%3C/svg%3E") 16 16, e-resize}
`;

function MediaCard({ item, align }: { item: Item; align: string }) {
  const full = isFullWidth(item);
  const opensLightbox = !!(item.gallery && item.gallery.length) || item.type !== "video";
  const cls = `group/card relative block mx-auto ${align}`;
  const styleW = {
    width: full ? "var(--item-w-full, 92%)" : "var(--item-w, 75%)",
  };

  const media = (
    <>
      {item.type === "video" ? (
        <video
          src={item.src}
          data-grid-video
          muted
          loop
          playsInline
          preload="none"
          style={{ width: "100%", height: "auto" }}
          className="block"
        />
      ) : (
        <Image
          src={item.image}
          alt={item.caption || "Photograph by Markn"}
          width={item.width}
          height={item.height}
          unoptimized={item.type === "gif"}
          style={{ width: "100%", height: "auto" }}
          className="block"
          sizes="(max-width: 767px) 85vw, 30vw"
        />
      )}

      {item.caption ? (
        <div className="hidden md:flex absolute inset-0 items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 bg-[var(--white-smoke)]/80 pointer-events-none">
          <span
            className="text-[var(--brand-black)]"
            style={{
              fontFamily: "var(--font-times), serif",
              fontSize: "clamp(20px, 2vw, 26px)",
            }}
          >
            {item.caption}
          </span>
        </div>
      ) : null}
    </>
  );

  return (
    <div data-item className="mb-[6em] md:mb-[12em] lg:mb-[15em]">
      {opensLightbox ? (
        <a href={`#home-lb-${item.id}`} className={cls} style={styleW}>
          {media}
        </a>
      ) : (
        <Link href={item.href} className={cls} style={styleW}>
          {media}
        </Link>
      )}

      {item.caption ? (
        <div className="md:hidden mt-3 mx-auto" style={styleW}>
          <span
            className="block text-center text-[var(--brand-black)]"
            style={{
              fontFamily: "var(--font-times), serif",
              fontSize: "16px",
            }}
          >
            {item.caption}
          </span>
        </div>
      ) : null}
    </div>
  );
}

function LightboxHeader({
  caption,
  absolute = false,
}: {
  caption?: string;
  absolute?: boolean;
}) {
  return (
    <div
      className={`${
        absolute ? "absolute top-0 left-0 right-0" : "sticky top-0"
      } z-30 text-center pointer-events-none`}
      style={{ backgroundColor: "var(--white-smoke)", padding: "20px 36px" }}
    >
      <h2
        style={{
          fontFamily: "var(--font-times), serif",
          fontSize: "clamp(13px, 1.3vw, 16px)",
          lineHeight: "1.5",
        }}
      >
        <span>Markn</span>
        <span style={{ opacity: 0.6 }}>
          {" "}/ Images{caption ? ` / ${caption}` : ""}
        </span>
      </h2>
      <a
        href="#!"
        aria-label="Close"
        className="pointer-events-auto absolute flex items-center justify-center leading-none hover:opacity-60 transition-opacity"
        style={{
          top: "4px",
          right: "8px",
          width: "44px",
          height: "44px",
          fontFamily: "var(--font-times), serif",
          fontSize: "30px",
          color: "var(--brand-black)",
        }}
      >
        ×
      </a>
    </div>
  );
}

function GalleryRows({
  base,
  gallery,
  alt,
  packWidth,
  packGap,
  maxH,
  minN,
  rowGap,
}: {
  base: string;
  gallery: GalleryImg[];
  alt: string;
  packWidth: number;
  packGap: number;
  maxH: number;
  minN: number;
  rowGap: number;
}) {
  const rows = packRows(
    gallery.map((g) => ({ ar: g.w / g.h, data: g })),
    packWidth,
    packGap,
    maxH,
    minN
  );
  let idx = 0;
  return (
    <>
      {rows.map((row, ri) => {
        const arAdj = row.ar / (1 - (rowGap / 100) * (row.cells.length - 1));
        const naturalH =
          (packWidth - packGap * (row.cells.length - 1)) / row.ar;
        const widthPct = naturalH > maxH ? (maxH / naturalH) * 100 : 100;
        return (
          <div
            key={ri}
            className="flex mr-auto"
            style={{
              width: `${widthPct}%`,
              aspectRatio: arAdj,
              gap: `${rowGap}%`,
              marginBottom: `${rowGap}%`,
            }}
          >
            {row.cells.map((g) => {
              const i = idx++;
              return (
                <a
                  key={i}
                  href={`#${base}-${i}`}
                  className="block overflow-hidden min-w-0"
                  style={{ flex: `${g.w / g.h} 0 0` }}
                >
                  <img
                    src={g.thumb}
                    data-gallery-thumb
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    className="block"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </a>
              );
            })}
          </div>
        );
      })}
    </>
  );
}

function GalleryLightbox({ item }: { item: Item }) {
  const gallery = item.gallery;
  if (!gallery || !gallery.length) return null;
  const base = `home-lb-${item.id}`;
  const total = gallery.length;
  const alt = item.caption || "Markn photograph";
  const hash = useHash();
  const isActive = hash === `#${base}` || hash.startsWith(`#${base}-`);

  if (!isActive) {
    return (
      <>
        <div id={base} className="hlb" />
        {gallery.map((_, i) => (
          <div key={i} id={`${base}-${i}`} className="hlb-one" />
        ))}
      </>
    );
  }

  let minAr = Infinity;
  let maxAr = 0;
  let sumAr = 0;
  for (const g of gallery) {
    const a = g.w / g.h;
    if (a < minAr) minAr = a;
    if (a > maxAr) maxAr = a;
    sumAr += a;
  }
  const uniform = minAr > 0 && maxAr / minAr <= 1.12;
  const avgAr = sumAr / gallery.length;

  return (
    <>
      <div id={base} className="hlb">
        <LightboxHeader caption={item.caption} />
        <div className="px-5 md:px-10 lg:px-[120px] pb-[6em] max-w-[1400px] mx-auto">
          {uniform ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {gallery.map((g, i) => (
                <a
                  key={i}
                  href={`#${base}-${i}`}
                  className="block overflow-hidden"
                  style={{ aspectRatio: avgAr }}
                >
                  <img
                    src={g.thumb}
                    data-gallery-thumb
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    className="block"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </a>
              ))}
            </div>
          ) : (
            <>
              <div className="md:hidden">
                <GalleryRows
                  base={base}
                  gallery={gallery}
                  alt={alt}
                  packWidth={350}
                  packGap={12}
                  maxH={220}
                  minN={1}
                  rowGap={3}
                />
              </div>
              <div className="hidden md:block">
                <GalleryRows
                  base={base}
                  gallery={gallery}
                  alt={alt}
                  packWidth={1160}
                  packGap={24}
                  maxH={300}
                  minN={2}
                  rowGap={2}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {gallery.map((g, i) => {
        const prev = (i - 1 + total) % total;
        const next = (i + 1) % total;
        return (
          <div key={i} id={`${base}-${i}`} className="hlb-one">
            <LightboxHeader caption={item.caption} absolute />
            <a
              href={`#${base}-${prev}`}
              aria-label="Previous"
              className="hlb-prev absolute top-0 left-0 z-20"
              style={{ width: "40%", height: "100%" }}
            />
            <a
              href={`#${base}-${next}`}
              aria-label="Next"
              className="hlb-next absolute top-0 right-0 z-20"
              style={{ width: "40%", height: "100%" }}
            />
            <div
              className="absolute left-0 right-0 flex items-center justify-center px-5 md:px-[120px] pointer-events-none"
              style={{ top: "70px", bottom: "70px" }}
            >
              <img
                src={g.src}
                alt={item.caption || "Markn photograph"}
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
            </div>
            <div className="absolute bottom-0 left-0 right-0 z-30 text-center pointer-events-none py-4">
              <span
                style={{
                  fontFamily: "var(--font-times), serif",
                  fontSize: "clamp(12px, 1.2vw, 15px)",
                }}
              >
                {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
            </div>
          </div>
        );
      })}
    </>
  );
}

function SingleImageLightbox({ item }: { item: Item }) {
  if (item.type === "video") return null;
  const base = `home-lb-${item.id}`;
  const hash = useHash();
  const isActive = hash === `#${base}`;

  if (!isActive) {
    return <div id={base} className="hlb-one" />;
  }

  return (
    <div id={base} className="hlb-one">
      <LightboxHeader caption={item.caption} absolute />
      <a href="#!" aria-label="Close" className="absolute inset-0 z-10" />
      <div
        className="absolute left-0 right-0 flex items-center justify-center px-5 md:px-[120px] pointer-events-none"
        style={{ top: "70px", bottom: "70px" }}
      >
        <img
          src={item.image}
          alt={item.caption || "Photograph by Markn"}
          decoding="async"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            width: "auto",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </div>
    </div>
  );
}

export function HomeGrid({
  items,
  colA,
  colB,
  preloaderImages,
  secondsPerImage,
  holdSeconds,
}: {
  items: Item[];
  colA: Placed[];
  colB: Placed[];
  preloaderImages?: PreImg[];
  secondsPerImage?: number;
  holdSeconds?: number;
}) {
  const mainRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-item]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          }
        );
      });
    },
    { scope: mainRef }
  );

  return (
    <section
      id="images"
      ref={mainRef}
      className="pt-[120px] md:pt-[180px] pb-[6em] md:pb-[10em]"
      style={{ backgroundColor: "var(--white-smoke)", color: "var(--brand-black)" }}
    >
      <Preloader
        images={preloaderImages}
        secondsPerImage={secondsPerImage}
        holdSeconds={holdSeconds}
      />
      <style dangerouslySetInnerHTML={{ __html: HLB_CSS }} />
      <div
        className="section-name sticky z-20 text-center pb-[2em] md:pb-[4em]"
        style={{ top: 0, paddingTop: "clamp(63px, 7.5vw, 93px)" }}
      >
        <span
          style={{
            fontFamily: "var(--font-times), serif",
            fontSize: "clamp(18px, 1.7vw, 23px)",
            lineHeight: "1.6",
          }}
        >
          Images
        </span>
      </div>

      <div className="md:hidden px-10">
        {items.map((item) => (
          <MediaCard key={item.id} item={item} align="mx-auto" />
        ))}
      </div>

      <div className="hidden md:flex gap-[7em] lg:gap-[10em] px-16 lg:px-[120px]">
        <div className="flex-1 min-w-0 flex flex-col">
          {colA.map(({ item, align }) => (
            <MediaCard key={item.id} item={item} align={align} />
          ))}
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          {colB.map(({ item, align }) => (
            <MediaCard key={item.id} item={item} align={align} />
          ))}
        </div>
      </div>

      {items.map((item) =>
        item.gallery && item.gallery.length ? (
          <GalleryLightbox key={item.id} item={item} />
        ) : item.type === "video" ? null : (
          <SingleImageLightbox key={item.id} item={item} />
        )
      )}
    </section>
  );
}
