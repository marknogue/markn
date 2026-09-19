export function Footer() {
  return (
    <footer
      className="mt-[72px] px-5 md:px-10 lg:px-[72px] py-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
      style={{ color: "var(--fg)" }}
    >
      <p
        className="m-0 text-[10px] uppercase tracking-[0.2em] leading-none opacity-30"
        style={{ fontFamily: "var(--font-times), serif" }}
      >
        © {new Date().getFullYear()} Markn
      </p>

      <p
        className="m-0 text-[10px] uppercase tracking-[0.2em] leading-none opacity-30"
        style={{ fontFamily: "var(--font-times), serif" }}
      >
        Design &amp; Development —{" "}
        <a
          href="https://monk.haus"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-100 transition-opacity duration-200"
        >
          Monk Haus
        </a>
      </p>
    </footer>
  );
}
