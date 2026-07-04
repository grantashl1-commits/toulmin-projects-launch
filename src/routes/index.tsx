import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Reveal } from "@/components/Reveal";
import heroImg from "@/assets/hero.jpg";
import portraitImg from "@/assets/portrait.jpg";
import expIncentive from "@/assets/exp-incentive.jpg";
import expMarketing from "@/assets/exp-marketing.jpg";
import expCorporate from "@/assets/exp-corporate.jpg";
import expStrategy from "@/assets/exp-strategy.jpg";
import spectacleImg from "@/assets/spectacle.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Experiences", href: "#experiences" },
  { label: "Contact", href: "#contact" },
];

function Wordmark({ reversed = false }: { reversed?: boolean }) {
  return (
    <a href="#top" className="inline-block leading-none" aria-label="Toulmin Projects — home">
      <span
        className={`wordmark block text-lg sm:text-xl ${reversed ? "text-cream" : "text-ink"}`}
      >
        Toulmin Projects
      </span>
      <span className="mt-1.5 block h-px w-full bg-champagne" aria-hidden="true" />
    </a>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-near/95 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
        <Wordmark reversed />

        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-cream/80 transition-colors hover:text-champagne"
            >
              {l.label}
            </a>
          ))}
          <a href="#contact" className="btn-outline text-cream">
            Start a project ›
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center text-cream md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 block h-px w-6 bg-current transition-transform duration-300 ${
                open ? "top-1/2 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 block h-px w-6 bg-current transition-opacity duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-px w-6 bg-current transition-transform duration-300 ${
                open ? "top-1/2 -rotate-45" : "bottom-0"
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden bg-near transition-[max-height] duration-500 md:hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-5 pb-6 pt-2" aria-label="Mobile">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-cream/10 py-3 text-cream/85"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="btn-outline mt-4 self-start text-cream"
          >
            Start a project ›
          </a>
        </nav>
      </div>
    </header>
  );
}

function Index() {
  return (
    <div id="top" className="bg-ink text-cream">
      <Nav />

      {/* 1 — HERO */}
      <section className="relative flex min-h-svh items-end overflow-hidden">
        <img
          src={heroImg}
          alt="Guests sharing a warm moment at an elegant candlelit gala dinner"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,10,11,0.72) 0%, rgba(10,10,11,0.35) 40%, rgba(10,10,11,0.88) 100%)",
          }}
        />
        <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-16 pt-32 sm:px-8 sm:pb-24">
          <Reveal as="p" className="eyebrow text-champagne">
            Events &amp; Marketing — Taupō, NZ
          </Reveal>
          <Reveal
            as="h1"
            delay={80}
            className="display mt-6 max-w-[16ch] text-cream text-[clamp(2.9rem,9vw,8.5rem)]"
          >
            From concept to <span className="text-champagne">flawless execution.</span>
          </Reveal>
          <Reveal
            as="p"
            delay={160}
            className="mt-8 max-w-xl text-base text-cream/80 sm:text-lg"
          >
            Event management and delivery for luxury incentive partners. Marketing strategy and
            execution for corporate clients.
          </Reveal>
          <Reveal delay={220} className="mt-10 flex flex-wrap items-center gap-6">
            <a href="#contact" className="btn-outline text-cream">
              Start a project ›
            </a>
            <a
              href="#experiences"
              className="text-sm text-cream/80 underline-offset-4 transition-colors hover:text-champagne hover:underline"
            >
              Our work ›
            </a>
          </Reveal>
        </div>
      </section>

      {/* 2 — STATEMENT BAND */}
      <section className="bg-near">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <Reveal
            as="h2"
            className="display text-cream text-[clamp(2.4rem,6.5vw,5.5rem)]"
          >
            Calm delivered. <span className="text-champagne">Flawlessly.</span>
          </Reveal>
          <Reveal as="p" delay={120} className="max-w-md text-cream/75 sm:text-lg">
            With 16+ years across tourism, events and strategic marketing in Aotearoa and
            internationally, I partner with organisations to turn ambitious ideas into experiences
            that land exactly as planned — even when nothing on-site is going to plan.
          </Reveal>
        </div>
      </section>

      {/* 3 — ABOUT */}
      <section id="about" className="bg-cream text-ink">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <Reveal className="order-2 lg:order-1">
            <p className="eyebrow text-champagne-deep">About</p>
            <h2 className="display mt-5 max-w-[15ch] text-[clamp(2rem,4.5vw,3.6rem)]">
              The calm in the room when everything&rsquo;s on the line.
            </h2>
            <div className="mt-8 max-w-xl space-y-5 text-ink/75">
              <p>
                I&rsquo;m Louise Toulmin. Over 16 years across tourism, events and strategic
                marketing — in Aotearoa and further afield — I&rsquo;ve learned that the difference
                between a good experience and an unforgettable one usually comes down to what nobody
                sees: the detail that was quietly handled before anyone noticed it was a problem.
              </p>
              <p>
                I work with destination management companies delivering luxury incentive programmes
                where the runsheet runs to twenty pages and the expectations run higher still, and
                with corporate clients who need marketing that&rsquo;s considered, strategic, and
                genuinely executed — not just posted. Whatever the brief, I bring the same thing:
                clear thinking, meticulous follow-through, and a steady hand when things don&rsquo;t
                go to plan.
              </p>
              <p className="text-ink font-medium">
                Based in Taupō, working with clients across New Zealand and beyond.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120} className="order-1 lg:order-2">
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <img
                src={portraitImg}
                alt="Portrait of Louise Toulmin"
                width={1008}
                height={1200}
                loading="lazy"
                className="h-full w-full object-cover grayscale"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4 — SERVICES */}
      <section id="services" className="bg-near text-cream">
        <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32">
          <Reveal>
            <p className="eyebrow text-champagne">Services</p>
            <h2 className="display mt-5 text-[clamp(2.2rem,6vw,5rem)]">
              Two ways I can <span className="text-champagne">help.</span>
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {[
              {
                title: "Event Management & Delivery",
                context:
                  "For DMCs and luxury incentive partners who need an expert on the ground in New Zealand.",
                bullets: [
                  "Luxury incentive programmes & corporate events",
                  "End-to-end logistics & supplier management",
                  "Bespoke familiarisation programmes",
                  "On-site delivery & leadership",
                  "Twenty-page runsheets, handled with meticulous care",
                ],
              },
              {
                title: "Marketing Strategy & Execution",
                context:
                  "For corporate clients who need strategic marketing delivered with clarity and maturity.",
                bullets: [
                  "Marketing strategy & planning",
                  "Email marketing & campaign implementation",
                  "Social marketing aligned to business goals",
                  "Partnership, sponsorship & charity packages",
                  "Stakeholder liaison & brand collateral",
                ],
              },
            ].map((card, i) => (
              <Reveal
                key={card.title}
                delay={i * 120}
                className="flex flex-col border border-cream/15 p-8 sm:p-10"
              >
                <h3 className="display text-2xl sm:text-[1.75rem]">{card.title}</h3>
                <p className="mt-4 text-cream/70">{card.context}</p>
                <ul className="mt-8 space-y-3.5 border-t border-cream/10 pt-8">
                  {card.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-sm text-cream/85">
                      <span className="mt-2 h-px w-4 shrink-0 bg-champagne" aria-hidden="true" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <p className="mt-10 text-sm text-cream/50">
              This is senior-level strategic work — not social media management.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 5 — EXPERIENCES */}
      <section id="experiences" className="bg-cream text-ink">
        <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32">
          <Reveal>
            <p className="eyebrow text-champagne-deep">Experiences</p>
            <h2 className="display mt-5 text-[clamp(2.2rem,6vw,5rem)]">
              A track record built on <span className="text-champagne-deep">trust.</span>
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2">
            {[
              {
                img: expIncentive,
                title: "Luxury Incentive Programme",
                line: "A multi-day incentive for an international corporate group, delivered without a single guest ever knowing what nearly went wrong.",
              },
              {
                img: expMarketing,
                title: "Destination Marketing Campaign",
                line: "A regional tourism campaign built to convert business event buyers into repeat bookers.",
              },
              {
                img: expCorporate,
                title: "Corporate Event Delivery",
                line: "End-to-end delivery for a corporate client event, from concept through to the last supplier invoice reconciled.",
              },
              {
                img: expStrategy,
                title: "Strategic Marketing Partnership",
                line: "Ongoing email, social and sponsorship strategy for a corporate client who no longer thinks about it — because it's handled.",
              },
            ].map((tile, i) => (
              <Reveal key={tile.title} delay={(i % 2) * 120} className="group">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={tile.img}
                    alt={tile.title}
                    width={1000}
                    height={750}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <h3 className="display mt-6 text-[1.6rem] sm:text-3xl">{tile.title}</h3>
                <p className="mt-3 max-w-md text-ink/70">{tile.line}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6 — SPECTACLE MOMENT */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
        <img
          src={spectacleImg}
          alt=""
          aria-hidden="true"
          width={1920}
          height={1088}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/55" />
        <Reveal className="relative px-5 text-center">
          <p className="display text-champagne text-[clamp(2.4rem,8vw,7rem)]">
            Above the brief.
            <br />
            Beyond expectation.
          </p>
        </Reveal>
      </section>

      {/* 7 — CONTACT */}
      <section id="contact" className="bg-ink text-cream">
        <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32">
          <div className="max-w-2xl">
            <Reveal as="p" className="eyebrow text-champagne">
              Contact
            </Reveal>
            <Reveal as="h2" delay={80} className="display mt-5 text-[clamp(3rem,10vw,8rem)]">
              Let&rsquo;s <span className="text-champagne">talk.</span>
            </Reveal>
            <Reveal as="p" delay={140} className="mt-8 text-cream/75 sm:text-lg">
              I&rsquo;d love to hear about your project. The best way to start is with a relaxed,
              no-obligation phone or Zoom call — it&rsquo;s always easier to talk things through than
              go back and forth over email. No pressure, just a conversation about how I might be
              able to help.
            </Reveal>
            <Reveal delay={200} className="mt-10 flex flex-col gap-6">
              <a
                href="mailto:louise@toulminprojects.co.nz"
                className="btn-outline self-start text-cream"
              >
                Start a project ›
              </a>
              <p className="text-sm text-cream/70">
                Or send me an email:{" "}
                <a
                  href="mailto:louise@toulminprojects.co.nz"
                  className="text-champagne underline-offset-4 hover:underline"
                >
                  louise@toulminprojects.co.nz
                </a>
              </p>
              <p className="eyebrow text-cream/40">Based in Taupō, New Zealand</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 8 — FOOTER */}
      <footer className="bg-ink text-cream">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-6 border-t border-cream/10 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Wordmark reversed />
          <a
            href="#contact"
            className="text-sm text-cream/80 transition-colors hover:text-champagne"
          >
            Start a project ›
          </a>
          <p className="text-xs text-cream/40">
            © Toulmin Projects {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
