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
          fontFamily: "var(--font-grand), serif",
          fontSize: "clamp(64px, 14vw, 160px)",
          letterSpacing: "0.02em",
          lineHeight: "1",
        }}
      >
        404
      </p>

      <p
        className="m-0 mt-6"
        style={{
          fontFamily: "var(--font-grand), serif",
          fontSize: "clamp(16px, 1.8vw, 22px)",
          letterSpacing: "0.01em",
        }}
      >
        This page could not be found.
      </p>

      <Link
        href="/"
        className="mt-10 hover:opacity-60 transition-opacity duration-200"
        style={{
          fontFamily: "var(--font-petit), sans-serif",
          fontSize: "11px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
        }}
      >
        Back to Selected Works
      </Link>
    </main>
  );
}
