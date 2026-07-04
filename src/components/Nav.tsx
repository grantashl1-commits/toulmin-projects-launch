import { useEffect, useState, useRef } from "react";
import { MagneticButton } from "./MagneticButton";
import logoHeader from "@/assets/logo-header.png";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Experiences", href: "#experiences" },
  { label: "Contact", href: "#contact" },
];

const TICKER_ITEMS = [
  "CALM UNDER PRESSURE",
  "TAUPŌ, NEW ZEALAND",
  "LUXURY INCENTIVE TRAVEL",
  "STRATEGIC MARKETING",
  "16+ YEARS' EXPERIENCE",
];

function Wordmark() {
  return (
    <a
      href="#top"
      className="inline-block leading-none"
      aria-label="Toulmin Projects — home"
    >
      <img
        src={logoHeader}
        alt="Toulmin Projects"
        width={1280}
        height={512}
        className="h-9 w-auto sm:h-11"
      />
    </a>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(() => {
          const sections = NAV_LINKS.map((l) => document.getElementById(l.href.slice(1)));
          const scrollPos = window.scrollY + window.innerHeight / 3;

          for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            if (section && section.offsetTop <= scrollPos) {
              setActiveSection(NAV_LINKS[i].href);
              break;
            }
            if (i === 0) setActiveSection("");
          }
          ticking.current = false;
        });
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tickerContent = TICKER_ITEMS.map((t) => `${t}  ·  `).join("");

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled ? "bg-cream/95 backdrop-blur-sm shadow-[0_1px_0_rgba(0,0,0,0.04)]" : "bg-cream"
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-3.5 sm:px-8 sm:py-4">
          <Wordmark />

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`underline-wood relative pb-1 text-sm text-matte/80 transition-colors hover:text-matte ${
                  activeSection === l.href ? "underline-wood-drawn text-matte" : ""
                }`}
              >
                {l.label}
              </a>
            ))}
            <MagneticButton href="#contact">Start a project</MagneticButton>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center text-matte md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 block h-px w-5 bg-current transition-transform duration-300 ${
                  open ? "top-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 block h-px w-5 bg-current transition-opacity duration-300 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-5 bg-current transition-transform duration-300 ${
                  open ? "top-1/2 -rotate-45" : "bottom-0"
                }`}
              />
            </span>
          </button>
        </div>

        <div
          className={`overflow-hidden bg-cream transition-[max-height] duration-500 md:hidden ${
            open ? "max-h-96" : "max-h-0"
          }`}
        >
          <nav className="flex flex-col gap-0 px-5 pb-6 pt-1" aria-label="Mobile">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-matte/8 py-3 text-sm text-matte/80"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="btn-outline mt-4 self-start"
            >
              Start a project
            </a>
          </nav>
        </div>
      </header>

      {/* Ticker bar — wood-grain accent band */}
      <div className="bg-wood-texture group fixed inset-x-0 top-[49px] z-40 overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_0_rgba(0,0,0,0.15)] sm:top-[57px]">
        <div className="animate-marquee flex whitespace-nowrap py-2">
          <span className="inline-block shrink-0 pr-8 text-[0.66rem] font-medium uppercase tracking-[0.24em] text-cream/80">
            {tickerContent}
          </span>
          <span className="inline-block shrink-0 pr-8 text-[0.66rem] font-medium uppercase tracking-[0.24em] text-cream/80">
            {tickerContent}
          </span>
        </div>
      </div>

      {/* Spacer to push content below the fixed nav + ticker */}
      <div className="h-[78px] sm:h-[88px]" aria-hidden="true" />
    </>
  );
}
