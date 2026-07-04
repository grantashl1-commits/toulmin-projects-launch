import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useEffect, useState, useRef, useCallback } from "react";

import { Reveal } from "@/components/Reveal";
import { Nav } from "@/components/Nav";
import { MagneticButton } from "@/components/MagneticButton";
import { AnimatedCounter } from "@/components/AnimatedCounter";

import heroImg from "@/assets/hero.jpg";
import statementImg from "@/assets/statement.jpg";
import expIncentive from "@/assets/exp-incentive.jpg";
import expMarketing from "@/assets/exp-marketing.jpg";
import expCorporate from "@/assets/exp-corporate.jpg";
import expStrategy from "@/assets/exp-strategy.jpg";

export const Route = createFileRoute("/")({ component: Index });

/* ------------------------------------------------------------------ */
/*  Custom hooks                                                       */
/* ------------------------------------------------------------------ */

function useScrollY() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return scrollY;
}

function useIntersectionWords(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return inView;
}

/* ------------------------------------------------------------------ */
/*  Staggered headline — word-by-word reveal                           */
/* ------------------------------------------------------------------ */

interface StaggeredHeadlineProps {
  text: string;
  underlineWords?: string[];
  as?: "h1" | "h2";
  className?: string;
}

function StaggeredHeadline({
  text,
  underlineWords = [],
  as: Tag = "h2",
  className = "",
}: StaggeredHeadlineProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const inView = useIntersectionWords(containerRef);
  const [underlinesShown, setUnderlinesShown] = useState(false);
  const words = text.split(" ");

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => setUnderlinesShown(true), 550);
      return () => clearTimeout(timer);
    }
  }, [inView]);

  return (
    <Tag ref={containerRef as React.RefObject<HTMLHeadingElement>} className={className}>
      {words.map((word, i) => {
        const wordCleaned = word.toLowerCase().replace(/[^a-z]/g, "");
        const isUnderlined = underlineWords.some(
          (uw) => wordCleaned === uw.toLowerCase().replace(/[^a-z]/g, ""),
        );

        return (
          <Fragment key={i}>
            <span
              className={`reveal-word ${inView ? "reveal-word-in" : ""}`}
              style={{ transitionDelay: `${i * 65}ms` }}
            >
              {isUnderlined ? (
                <span className={`underline-wood ${underlinesShown ? "underline-wood-drawn" : ""}`}>
                  {word.replace(/[.,;:!?]$/, "")}
                </span>
              ) : (
                word
              )}
            </span>{" "}
          </Fragment>
        );
      })}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/*  Photo-grid tile with cursor tilt                                    */
/* ------------------------------------------------------------------ */

function PhotoGridTile({ img, label, location }: { img: string; label: string; location: string }) {
  const tileRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(true);

  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (isTouch || !tileRef.current) return;
      const rect = tileRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      tileRef.current.style.transform = `perspective(1200px) rotateY(${x * 5}deg) rotateX(${-y * 4}deg)`;
    },
    [isTouch],
  );

  const onLeave = useCallback(() => {
    if (tileRef.current) {
      tileRef.current.style.transform = "perspective(1200px) rotateY(0deg) rotateX(0deg)";
    }
  }, []);

  return (
    <Reveal className="w-full">
      <div
        ref={tileRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="tilt-target group relative aspect-[4/3] w-full overflow-hidden"
      >
        <img
          src={img}
          alt={label}
          loading="lazy"
          className="animate-kenburns-hover h-full w-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-matte/55 via-transparent to-transparent"
          aria-hidden="true"
        />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="eyebrow mb-1 text-cream/85">{location}</p>
          <p className="text-cream text-lg font-semibold leading-tight">{label}</p>
        </div>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Scroll-pinned intro statement section                               */
/* ------------------------------------------------------------------ */

function IntroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const counterTriggered = useRef(false);
  const [showCounter, setShowCounter] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setProgress(1);
      setShowCounter(true);
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    let raf = 0;

    const tick = () => {
      const rect = section.getBoundingClientRect();
      const sectionH = section.offsetHeight;
      const viewportH = window.innerHeight;
      const scrollable = sectionH - viewportH;
      if (scrollable <= 0) {
        setProgress(1);
        return;
      }
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / scrollable));
      setProgress(p);

      if (p >= 0.24 && !counterTriggered.current) {
        counterTriggered.current = true;
        setShowCounter(true);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    tick();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const line1Opacity = progress < 0.22 ? 1 : progress < 0.3 ? 1 - (progress - 0.22) / 0.08 : 0;
  const line2Opacity =
    progress < 0.22
      ? 0
      : progress < 0.3
        ? (progress - 0.22) / 0.08
        : progress < 0.58
          ? 1
          : progress < 0.66
            ? 1 - (progress - 0.58) / 0.08
            : 0;
  const line3Opacity = progress < 0.58 ? 0 : progress < 0.66 ? (progress - 0.58) / 0.08 : 1;

  return (
    <section ref={sectionRef} className="relative" style={{ height: "250vh" }} id="about">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={spectacleImg}
            alt=""
            aria-hidden="true"
            className="animate-kenburns h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-matte/55" />

        {/* Text layers */}
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          {/* Line 1 */}
          <p
            className="display text-[clamp(1.8rem,5vw,2.8rem)] text-cream transition-opacity duration-700"
            style={{ opacity: line1Opacity }}
          >
            Sixteen years of experience.
          </p>

          {/* Line 2 */}
          <p
            className="display text-[clamp(1.8rem,5vw,2.8rem)] text-cream transition-opacity duration-700"
            style={{ opacity: line2Opacity, marginTop: "-0.5em" }}
          >
            <AnimatedCounter
              end={16}
              prefix=""
              suffix="+ years"
              start={showCounter}
              className="tabular-nums"
            />
            , delivered without a single visible crack.
          </p>

          {/* Line 3 */}
          <div
            className="transition-opacity duration-700"
            style={{ opacity: line3Opacity, marginTop: "-0.5em" }}
          >
            <p className="display text-[clamp(1.8rem,5vw,2.8rem)] text-cream">
              Harnessing deep expertise across tourism, events and strategic marketing in Aotearoa
              and internationally.
            </p>
            <p className="eyebrow mt-8 text-cream/60">Based in Taupō, New Zealand</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

function Index() {
  const scrollY = useScrollY();

  return (
    <div id="top" className="bg-cream text-matte">
      <Nav />

      {/* ================================================================ */}
      {/* 1 — HERO                                                         */}
      {/* ================================================================ */}
      <section className="relative flex min-h-[calc(100vh-78px)] flex-col md:flex-row sm:min-h-[calc(100vh-88px)]">
        {/* Left — text */}
        <div className="flex flex-1 items-center bg-cream px-5 py-16 sm:px-10 md:py-0 lg:px-16 xl:px-20">
          <div className="w-full max-w-xl">
            <StaggeredHeadline
              as="h1"
              text="From concept to flawless execution."
              underlineWords={["flawless", "execution"]}
              className="display text-[clamp(2.6rem,7vw,5.5rem)] text-matte"
            />

            <Reveal delay={300} className="mt-6 max-w-lg">
              <p className="text-base text-matte/65 sm:text-lg sm:leading-relaxed">
                Event management and delivery for luxury incentive partners. Marketing strategy and
                execution for corporate clients.
              </p>
            </Reveal>

            <Reveal delay={380} className="mt-8 flex flex-wrap items-center gap-5">
              <MagneticButton href="#contact">Start a project</MagneticButton>
              <a
                href="#experiences"
                className="text-sm font-medium text-matte/50 underline-offset-4 transition-colors hover:text-wood hover:underline"
              >
                Our work &rsaquo;
              </a>
            </Reveal>
          </div>
        </div>

        {/* Right — image */}
        <div className="relative flex-1 overflow-hidden min-h-[45vh] md:min-h-0">
          <div
            className="absolute inset-0"
            style={{ transform: `translate3d(0, ${scrollY * 0.25}px, 0)` }}
          >
            <img
              src={heroImg}
              alt="Scenic helicopter flight over mountains and lakes"
              className="animate-kenburns h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 2 — INTRO STATEMENT (scroll-pinned storytelling)                  */}
      {/* ================================================================ */}
      <IntroSection />

      {/* ================================================================ */}
      {/* 3 — PHOTO GRID ("AS SEEN AT")                                     */}
      {/* ================================================================ */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32">
          <Reveal>
            <p className="eyebrow text-wood">The Calibre of Work</p>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <PhotoGridTile img={expIncentive} label="Vineyard Dinner" location="Central Otago" />
            <PhotoGridTile img={expMarketing} label="Incentive Programme" location="Queenstown" />
            <PhotoGridTile img={expCorporate} label="Corporate Gala" location="Auckland" />
            <PhotoGridTile img={expStrategy} label="Familiarisation Tour" location="Taupō" />
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 4 — SERVICES                                                      */}
      {/* ================================================================ */}
      <section id="services" className="bg-cream">
        <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32">
          <Reveal>
            <p className="eyebrow text-wood">Services</p>
          </Reveal>

          <StaggeredHeadline
            text="Two ways I can help."
            underlineWords={["help"]}
            className="display mt-5 max-w-[14ch] text-[clamp(2.2rem,6vw,4.8rem)]"
          />

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
                delay={i * 140}
                className="group flex flex-col border border-matte/10 p-8 sm:p-10"
              >
                <h3 className="display text-2xl sm:text-[1.75rem]">
                  <span className="underline-wood underline-wood-drawn">{card.title}</span>
                </h3>
                <p className="mt-4 text-matte/60">{card.context}</p>
                <div className="divider-wood mt-8" />
                <ul className="mt-8 space-y-3.5">
                  {card.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-sm text-matte/75">
                      <span
                        className="mt-[0.45em] h-px w-5 shrink-0 bg-wood/40"
                        aria-hidden="true"
                      />
                      <span className="leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>

          <Reveal delay={140}>
            <p className="mt-10 text-sm text-matte/40">
              This is senior-level strategic work — not social media management.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 5 — TESTIMONIALS / EXPERIENCES                                    */}
      {/* ================================================================ */}
      <section id="experiences" className="bg-cream">
        <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32">
          <Reveal>
            <p className="eyebrow text-wood">Experiences</p>
          </Reveal>

          <StaggeredHeadline
            text="A track record built on trust."
            underlineWords={["trust"]}
            className="display mt-5 max-w-[14ch] text-[clamp(2.2rem,6vw,4.8rem)]"
          />

          <div className="mt-14 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            <div className="flex w-max gap-6 pb-4">
              {[
                {
                  label: "Luxury Incentive Programme",
                  line: "A multi-day incentive for an international corporate group, delivered without a single guest ever knowing what nearly went wrong.",
                },
                {
                  label: "Destination Marketing Campaign",
                  line: "A regional tourism campaign built to convert business event buyers into repeat bookers.",
                },
                {
                  label: "Corporate Event Delivery",
                  line: "End-to-end delivery for a corporate client event, from concept through to the last supplier invoice reconciled.",
                },
                {
                  label: "Strategic Marketing Partnership",
                  line: "Ongoing email, social and sponsorship strategy for a corporate client who no longer thinks about it — because it&rsquo;s handled.",
                },
              ].map((tile, i) => (
                <Reveal
                  key={tile.label}
                  delay={i * 100}
                  className="w-[300px] flex-shrink-0 snap-start sm:w-[360px]"
                >
                  <div className="divider-wood mb-6" />
                  <p className="eyebrow text-wood">{tile.label}</p>
                  <p className="mt-4 text-lg leading-relaxed text-matte/75">{tile.line}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 6 — CONTACT                                                       */}
      {/* ================================================================ */}
      <section id="contact" className="bg-cream">
        <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32">
          <div className="max-w-2xl">
            <Reveal>
              <p className="eyebrow text-wood">Contact</p>
            </Reveal>

            <StaggeredHeadline
              text="Let's talk."
              underlineWords={["talk"]}
              as="h2"
              className="display mt-5 max-w-[10ch] text-[clamp(2.8rem,9vw,7rem)]"
            />

            <Reveal delay={200} className="mt-8">
              <p className="text-lg leading-relaxed text-matte/65 sm:text-xl sm:leading-relaxed">
                I&rsquo;d love to hear about your project. The best way to start is with a relaxed,
                no-obligation phone or Zoom call — it&rsquo;s always easier to talk things through
                than go back and forth over email. No pressure, just a conversation about how I
                might be able to help.
              </p>
            </Reveal>

            <Reveal delay={280} className="mt-10 flex flex-col gap-5">
              <MagneticButton href="mailto:louise@toulminprojects.co.nz">
                Start a project
              </MagneticButton>

              <p className="text-sm text-matte/55">
                Or send me an email:{" "}
                <a
                  href="mailto:louise@toulminprojects.co.nz"
                  className="font-medium text-wood underline-offset-4 transition-colors hover:underline"
                >
                  louise@toulminprojects.co.nz
                </a>
              </p>

              <p className="eyebrow text-matte/30">Based in Taupō, New Zealand</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 7 — FOOTER                                                        */}
      {/* ================================================================ */}
      <footer className="bg-matte text-cream">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <a href="#top" className="wordmark text-cream" aria-label="Toulmin Projects — home">
            Toulmin Projects
          </a>

          <nav className="flex flex-wrap items-center gap-6" aria-label="Footer">
            <a href="#about" className="text-sm text-cream/60 transition-colors hover:text-cream">
              About
            </a>
            <a
              href="#services"
              className="text-sm text-cream/60 transition-colors hover:text-cream"
            >
              Services
            </a>
            <a
              href="#experiences"
              className="text-sm text-cream/60 transition-colors hover:text-cream"
            >
              Experiences
            </a>
            <a href="#contact" className="text-sm text-cream/60 transition-colors hover:text-cream">
              Contact
            </a>
            <a href="#contact" className="btn-outline-light text-xs">
              Start a project
            </a>
          </nav>

          <p className="text-xs text-cream/30">
            &copy; Toulmin Projects {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
