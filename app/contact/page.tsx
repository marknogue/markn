import type { Metadata } from "next";
import { PROJECTS } from "../lib/placeholders";
import { INSTAGRAM_URL, SITE_EMAIL, SITE_LOCATION, SITE_NAME } from "../lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Markn, a London based photographer and director, for fashion and documentary commissions and collaborations.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact — Markn",
    description:
      "Contact Markn, a London based photographer and director, for fashion and documentary commissions and collaborations.",
    url: "/contact",
  },
};

const IMAGES = [PROJECTS[0].images[0], PROJECTS[0].images[6]];

const INSTAGRAM_HANDLE = `@${new URL(INSTAGRAM_URL).pathname.replaceAll("/", "")}`;

export function ContactSection({ id }: { id?: string }) {
  return (
    <section
      id={id}
      className="pt-[88px] md:pt-[130px] pb-[6em] md:pb-[10em]"
      style={{ backgroundColor: "var(--white-smoke)", color: "var(--brand-black)" }}
    >
      <div
        className="section-name sticky z-20 text-center pb-[1em] md:pb-[2em]"
        style={{ top: 0, paddingTop: "clamp(63px, 7.5vw, 93px)" }}
      >
        <span
          style={{
            fontFamily: "var(--font-times), serif",
            fontSize: "clamp(18px, 1.7vw, 23px)",
            letterSpacing: "0.01em",
            lineHeight: "1.6",
          }}
        >
          Contact
        </span>
      </div>

      <div className="px-6 md:px-10 lg:px-[120px] max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
          {IMAGES.map((img) => (
            <img
              key={img.src}
              src={img.src}
              alt="Photograph by Markn"
              width={img.w}
              height={img.h}
              loading="lazy"
              decoding="async"
              style={{ width: "100%", height: "auto" }}
              className="block"
            />
          ))}
        </div>

        <div className="mt-[5em] md:mt-[8em] text-center">
          <h2
            style={{
              fontFamily: "var(--font-times), serif",
              fontSize: "clamp(22px, 3vw, 34px)",
              letterSpacing: "0.01em",
              lineHeight: "1.3",
            }}
          >
            {SITE_NAME}
          </h2>

          <div
            className="mt-6 md:mt-8 flex flex-col gap-1 leading-relaxed"
            style={{
              fontFamily: "var(--font-times), serif",
              fontSize: "clamp(13px, 1.2vw, 15px)",
              letterSpacing: "0.02em",
            }}
          >
            <p className="m-0">{SITE_LOCATION}</p>
            <p className="m-0 mt-4">
              <a
                href={`mailto:${SITE_EMAIL}`}
                className="hover:opacity-60 transition-opacity duration-200"
              >
                {SITE_EMAIL}
              </a>
            </p>
            <p className="m-0">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-60 transition-opacity duration-200"
              >
                {INSTAGRAM_HANDLE}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ContactPage() {
  return (
    <main>
      <ContactSection />
    </main>
  );
}
