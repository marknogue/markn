import type { Metadata } from "next";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { INSTAGRAM_URL, SITE_EMAIL, SITE_NAME } from "../lib/site";
import { getAbout, getSettings } from "../lib/sanity/queries";

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

const bodyStyle: React.CSSProperties = {
  fontFamily: "var(--font-petit), sans-serif",
  fontSize: "clamp(11px, 1vw, 13px)",
  letterSpacing: "0.02em",
  lineHeight: "1.6",
};

const ptComponents: PortableTextComponents = {
  block: { normal: ({ children }) => <p className="m-0">{children}</p> },
};

function NameList({ title, names }: { title: string; names: string[] }) {
  return (
    <div className="mt-[1.8em]" style={bodyStyle}>
      <p className="m-0 opacity-50">{title}</p>
      <ul className="mt-2 m-0 p-0 list-none columns-3 sm:columns-4 lg:columns-5 gap-x-4 sm:gap-x-7 text-left max-w-[680px] mx-auto">
        {names.map((name) => (
          <li key={name} className="break-inside-avoid">
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function AboutSection({
  id,
  standalone = false,
}: {
  id?: string;
  standalone?: boolean;
}) {
  const [about, settings] = await Promise.all([getAbout(), getSettings()]);

  const bio = about?.bio?.length ? about.bio : null;
  const publications = about?.publications?.length ? about.publications : PUBLICATIONS;
  const clients = about?.clients?.length ? about.clients : CLIENTS;
  const copyrightLine = about?.copyright || copyright;
  const email = settings?.email || SITE_EMAIL;
  const instagramUrl = settings?.instagramUrl || INSTAGRAM_URL;

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
              fontFamily: "var(--font-display), serif",
              fontSize: "clamp(18px, 1.7vw, 23px)",
              fontWeight: 300,
              letterSpacing: "0.01em",
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
            fontFamily: "var(--font-grand), serif",
            fontSize: "clamp(14px, 1.6vw, 20px)",
            letterSpacing: "0.01em",
            lineHeight: "1.45",
          }}
        >
          {bio ? (
            <PortableText value={bio} components={ptComponents} />
          ) : (
            <>
              <p className="m-0">
                {SITE_NAME} is a London based photographer and director. His
                images explore themes surrounding intimacy and connection, and
                celebrate inclusivity and diversity.
              </p>
              <p className="m-0">
                {SITE_NAME} is currently working on several ongoing stills and
                moving image projects within fashion and documentary.
              </p>
            </>
          )}
        </div>

        <div className="mt-[1.8em] flex flex-col gap-1" style={bodyStyle}>
          <p className="m-0">
            E:{" "}
            <a
              href={`mailto:${email}`}
              className="hover:opacity-60 transition-opacity duration-200"
            >
              {email}
            </a>
            {"    "}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity duration-200"
            >
              Instagram
            </a>
          </p>
        </div>

        <NameList title="Selected Publications" names={publications} />
        <NameList title="Select Clients" names={clients} />

        <p
          className="m-0 mt-[1.8em] opacity-40"
          style={{
            fontFamily: "var(--font-petit), sans-serif",
            fontSize: "clamp(10px, 1vw, 11px)",
            letterSpacing: "0.04em",
          }}
        >
          {copyrightLine}
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
