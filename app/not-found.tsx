import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ backgroundColor: "var(--white-smoke)", color: "var(--brand-black)" }}
    >
      <p
        className="m-0"
        style={{
          fontFamily: "var(--font-times-bold), serif",
          fontWeight: 700,
          fontSize: "clamp(64px, 14vw, 160px)",
          lineHeight: "1",
        }}
      >
        404
      </p>

      <p
        className="m-0 mt-6"
        style={{
          fontFamily: "var(--font-times), serif",
          fontSize: "clamp(16px, 1.8vw, 22px)",
        }}
      >
        This page could not be found.
      </p>

      <Link
        href="/"
        className="mt-10 hover:opacity-60 transition-opacity duration-200"
        style={{
          fontFamily: "var(--font-times-bold), serif",
          fontWeight: 700,
          fontSize: "11px",
        }}
      >
        Back to Images
      </Link>
    </main>
  );
}
