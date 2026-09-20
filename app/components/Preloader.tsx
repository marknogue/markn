"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

let played = false;

type PreImg = { src: string; w: number; h: number };

type Frame =
  | { type: "pair"; imgs: string[] }
  | { type: "land"; img: string };

function buildFrames(images: PreImg[]): Frame[] {
  const frames: Frame[] = [];
  let pending: string | null = null;
  for (const im of images) {
    const ar = im.w / im.h;
    if (ar > 1.2) {
      if (pending) {
        frames.push({ type: "pair", imgs: [pending] });
        pending = null;
      }
      frames.push({ type: "land", img: im.src });
    } else if (pending) {
      frames.push({ type: "pair", imgs: [pending, im.src] });
      pending = null;
    } else {
      pending = im.src;
    }
  }
  if (pending) frames.push({ type: "pair", imgs: [pending] });
  return frames;
}

function FrameView({ frame }: { frame: Frame }) {
  if (frame.type === "pair") {
    return (
      <div
        data-frame
        className="absolute inset-0 flex items-center justify-center gap-[3vw]"
        style={{ opacity: 0 }}
      >
        {frame.imgs.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            decoding="async"
            style={{
              height: "min(60vh, 50vw)",
              aspectRatio: "3 / 4",
              width: "auto",
              objectFit: "cover",
              display: "block",
            }}
          />
        ))}
      </div>
    );
  }
  return (
    <div
      data-frame
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity: 0 }}
    >
      <img
        src={frame.img}
        alt=""
        decoding="async"
        style={{
          height: "min(66vh, 68vw)",
          aspectRatio: "3 / 2",
          width: "auto",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
}

const DEFAULT_SECONDS_PER_IMAGE = 0.28;
const DEFAULT_HOLD_SECONDS = 2;

export function Preloader({
  images,
  secondsPerImage = DEFAULT_SECONDS_PER_IMAGE,
  holdSeconds = DEFAULT_HOLD_SECONDS,
}: {
  images?: PreImg[];
  secondsPerImage?: number;
  holdSeconds?: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  const frames = images && images.length ? buildFrames(images) : [];
  const nameIn = frames.length * secondsPerImage + 0.15;
  const totalSeconds = nameIn + 0.5 + holdSeconds + 0.7;

  useGSAP(
    () => {
      if (played) {
        setDone(true);
        return;
      }

      const root = rootRef.current!;
      const name = nameRef.current!;
      const frameEls = gsap.utils.toArray<HTMLElement>("[data-frame]");

      document.body.style.overflow = "hidden";

      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        played = true;
        document.body.style.overflow = "";
        setDone(true);
      };

      const fallback = window.setTimeout(finish, totalSeconds * 1000 + 400);

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: finish,
      });

      gsap.set(frameEls, { opacity: 0, scale: 1.06 });
      gsap.set(name, { opacity: 0 });

      frameEls.forEach((f, i) => {
        tl.to(f, { opacity: 1, scale: 1, duration: 0.5 }, i * secondsPerImage);
      });

      tl.to(name, { opacity: 1, duration: 0.5 }, nameIn);
      tl.to(
        root,
        { opacity: 0, duration: 0.7, ease: "power2.inOut" },
        nameIn + 0.5 + holdSeconds
      );

      return () => window.clearTimeout(fallback);
    },
    { scope: rootRef }
  );

  if (done) return null;

  return (
    <div
      ref={rootRef}
      id="preloader"
      data-timeout={Math.round(totalSeconds * 1000)}
      className="fixed inset-0 z-[100] overflow-hidden"
      style={{ backgroundColor: "var(--white-smoke)" }}
    >
      <div ref={framesRef} className="absolute inset-0">
        {frames.map((f, i) => (
          <FrameView key={i} frame={f} />
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <span
          ref={nameRef}
          className="text-center leading-none whitespace-nowrap"
          style={{
            fontFamily: "var(--font-times), serif",
            fontSize: "clamp(27px, 7.8vw, 108px)",
            color: "var(--brand-black)",
            opacity: 0,
          }}
        >
          Markn
        </span>
      </div>
    </div>
  );
}
