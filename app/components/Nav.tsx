"use client";

import { useMountEffect } from "../hooks/useMountEffect";
import { SITE_NAME } from "../lib/site";

type NavLink = { label: string; href: string; external?: boolean };

const NAV_FONT: React.CSSProperties = {
  fontFamily: "var(--font-display), serif",
  fontSize: "clamp(12px, 1.1vw, 13px)",
  fontWeight: 300,
  letterSpacing: "0.01em",
  lineHeight: "1.6",
};

const isTouch = () => window.matchMedia("(hover: none)").matches;

const isNavHidden = () => {
  const body = document.body.classList;
  return body.contains("is-scrolled") && !body.contains("nav-open") && !body.contains("nav-reveal");
};

const closeNav = () => document.body.classList.remove("nav-open");

export function Nav() {
  useMountEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!(e.target instanceof Element) || e.target.closest(".nav-root")) return;
      closeNav();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  });

  const rows: NavLink[][] = [
    [
      { label: "Selected Works", href: "/#selected-works" },
      { label: "Portfolio", href: "/#portfolio" },
      { label: "Motion", href: "/#motion" },
    ],
    [
      { label: "About", href: "/#about" },
      { label: "Contact", href: "/#contact" },
    ],
  ];

  const scrollToHash = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    const hashIndex = href.indexOf("#");
    if (hashIndex === -1) return;
    const id = href.slice(hashIndex + 1);
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();

    const startY = window.scrollY;
    const targetY = el.getBoundingClientRect().top + startY;
    const distance = targetY - startY;
    if (Math.abs(distance) < 2) return;

    const duration = 1400;
    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    let startTime: number | null = null;
    const step = (now: number) => {
      if (startTime === null) startTime = now;
      const t = Math.min((now - startTime) / duration, 1);
      window.scrollTo(0, startY + distance * easeInOutCubic(t));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    window.history.pushState(null, "", `#${id}`);
  };

  const renderLink = (link: NavLink) => {
    if (link.external) {
      return (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-60 transition-opacity duration-200"
        >
          {link.label}
        </a>
      );
    }
    return (
      <a
        key={link.href}
        href={link.href}
        onClick={(e) => {
          closeNav();
          scrollToHash(e, link.href);
        }}
        className="hover:opacity-60 transition-opacity duration-200"
      >
        {link.label}
      </a>
    );
  };

  return (
    <div className="nav-root fixed z-40 top-0 left-1/2 -translate-x-1/2 flex flex-col items-center pt-5 md:pt-7">
      <a
        href="/#selected-works"
        onClick={(e) => {
          if (isTouch() && isNavHidden()) {
            e.preventDefault();
            document.body.classList.add("nav-open");
            return;
          }
          closeNav();
          scrollToHash(e, "/#selected-works");
        }}
        id="brand-logo"
        aria-label={SITE_NAME}
        className="block text-[var(--fg)] leading-none text-center whitespace-nowrap"
        style={{
          fontFamily: "var(--font-display), serif",
          fontSize: "clamp(24px, 4vw, 46px)",
          fontWeight: 300,
          letterSpacing: "0.15em",
          paddingLeft: "0.15em",
        }}
      >
        {SITE_NAME}
      </a>

      <nav
        className="nav-full flex flex-col items-center gap-y-1 mt-2 md:mt-3 text-[var(--fg)]"
        style={NAV_FONT}
      >
        {rows.map((row, i) => (
          <div
            key={i}
            className="flex items-center justify-center gap-x-4 whitespace-nowrap"
          >
            {row.map(renderLink)}
          </div>
        ))}
      </nav>
    </div>
  );
}
