import type { Metadata } from "next";
import { INSTAGRAM_URL, SITE_EMAIL, SITE_NAME } from "../lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Markn is a London based photographer and director whose images explore intimacy and connection, and celebrate inclusivity and diversity.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Markn",
    description:
      "Markn is a London based photographer and director whose images explore intimacy and connection, and celebrate inclusivity and diversity.",
    url: "/about",
  },
};

const PUBLICATIONS = [
  "WSJ",
  "Vogue",
  "Purple",
  "More or Less",
  "Document Journal",
  "i-D",
  "Luncheon",
  "M Le Monde",
  "Perfect Magazine",
];

const CLIENTS = [
  "Dior",
  "Feng Chen Wang",
  "16 Arlington",
  "Hugo Boss",
  "Mytheresa",
  "Primark",
  "Nike",
  "Agnona",
];

const copyright = `All images © ${SITE_NAME}`;

const byName = (a: string, b: string) =>
  a.localeCompare(b, undefined, { sensitivity: "base" });

const bodyStyle: React.CSSProperties = {
  fontFamily: "var(--font-times), serif",
  fontSize: "clamp(11px, 1vw, 13px)",
  lineHeight: "1.6",
};

function NameList({ title, names }: { title: string; names: string[] }) {
  return (
    <div className="mt-[1.8em]" style={bodyStyle}>
      <p className="m-0 opacity-50">{title}</p>
      <ul className="mt-2 m-0 p-0 list-none columns-2 sm:columns-3 lg:columns-4 gap-x-7 text-left max-w-[680px] mx-auto">
        {[...names].sort(byName).map((name) => (
          <li key={name} className="break-inside-avoid">
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AboutSection({
  id,
  standalone = false,
}: {
  id?: string;
  standalone?: boolean;
}) {
  return (
    <section
      id={id}
      className={
        standalone
          ? "about-page min-h-[100svh] flex flex-col items-center justify-center text-center px-6 pt-[120px] md:pt-[150px] pb-[2em]"
          : "min-h-[100svh] flex flex-col text-center px-6 pb-[2em]"
      }
      style={{ backgroundColor: "var(--white-smoke)", color: "var(--brand-black)" }}
    >
      {!standalone && (
        <div
          className="section-name sticky z-20 text-center pb-[1em] md:pb-[2em]"
          style={{ top: 0, paddingTop: "clamp(63px, 7.5vw, 93px)" }}
        >
          <span
            style={{
              fontFamily: "var(--font-times-bold), serif",
              fontWeight: 700,
              fontSize: "clamp(18px, 1.7vw, 23px)",
              lineHeight: "1.6",
            }}
          >
            About
          </span>
        </div>
      )}

      <div className="max-w-[720px] mx-auto">
        <div
          className="flex flex-col gap-3"
          style={{
            fontFamily: "var(--font-times), serif",
            fontSize: "clamp(14px, 1.6vw, 20px)",
            lineHeight: "1.45",
          }}
        >
          <p className="m-0">
            {SITE_NAME} is a London based photographer and director. His
            images explore themes surrounding intimacy and connection, and
            celebrate inclusivity and diversity.
          </p>
          <p className="m-0">
            {SITE_NAME} is currently working on several ongoing stills and
            moving image projects within fashion and documentary.
          </p>
        </div>

        <div className="mt-[1.8em] flex flex-col gap-1" style={bodyStyle}>
          <p className="m-0">
            E:{" "}
            <a
              href={`mailto:${SITE_EMAIL}`}
              className="hover:opacity-60 transition-opacity duration-200"
            >
              {SITE_EMAIL}
            </a>
            {"    "}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity duration-200"
            >
              Instagram
            </a>
          </p>
        </div>

        <NameList title="Selected Publications" names={PUBLICATIONS} />
        <NameList title="Select Clients" names={CLIENTS} />

        <p
          className="m-0 mt-[1.8em] opacity-40"
          style={{
            fontFamily: "var(--font-times), serif",
            fontSize: "clamp(10px, 1vw, 11px)",
          }}
        >
          {copyright}
        </p>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <main>
      <AboutSection standalone />
    </main>
  );
}
