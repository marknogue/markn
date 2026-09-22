import type { Metadata } from "next";
import { INSTAGRAM_URL, SITE_EMAIL, SITE_LOCATION, SITE_NAME } from "../lib/site";
import { getSettings } from "../lib/sanity/queries";

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

const handleFrom = (url: string) => `@${new URL(url).pathname.replaceAll("/", "")}`;

export async function ContactSection({ id }: { id?: string }) {
  const settings = await getSettings();
  const location = settings?.location || SITE_LOCATION;
  const email = settings?.email || SITE_EMAIL;
  const instagramUrl = settings?.instagramUrl || INSTAGRAM_URL;

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
            fontFamily: "var(--font-display), serif",
            fontSize: "clamp(18px, 1.7vw, 23px)",
            fontWeight: 300,
            letterSpacing: "0.01em",
            lineHeight: "1.6",
          }}
        >
          Contact
        </span>
      </div>

      <div className="px-6 md:px-10 lg:px-[120px] max-w-[1200px] mx-auto">
        <div className="text-center">
          <h2
            style={{
              fontFamily: "var(--font-grand), serif",
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
              fontFamily: "var(--font-petit), sans-serif",
              fontSize: "clamp(13px, 1.2vw, 15px)",
              letterSpacing: "0.02em",
            }}
          >
            <p className="m-0">{location}</p>
            <p className="m-0 mt-4">
              <a
                href={`mailto:${email}`}
                className="hover:opacity-60 transition-opacity duration-200"
              >
                {email}
              </a>
            </p>
            <p className="m-0">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-60 transition-opacity duration-200"
              >
                {handleFrom(instagramUrl)}
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
