import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useEffect, useState, useRef, useCallback } from "react";

import { Reveal } from "@/components/Reveal";
import { Nav } from "@/components/Nav";
import { MagneticButton } from "@/components/MagneticButton";
import { AnimatedCounter } from "@/components/AnimatedCounter";

import heroImg from "@/assets/hero.jpg";
import statementImg from "@/assets/statement.jpg";
import spectacleImg from "@/assets/spectacle.jpg";
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
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return inView;
}

/* ------------------------------------------------------------------ */
/*  Staggered headline — word-by-word reveal, colour inside the words  */
/* ------------------------------------------------------------------ */

interface StaggeredHeadlineProps {
  text: string;
  highlightWords?: string[];
  /** Use the caramel wood tone (for dark bands) */
  light?: boolean;
  as?: "h1" | "h2";
  className?: string;
}

function StaggeredHeadline({
  text,
  highlightWords = [],
  light = false,
  as: Tag = "h2",
  className = "",
}: StaggeredHeadlineProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const inView = useIntersectionWords(containerRef);
  const words = text.split(" ");
  const highlightClass = light ? "word-wood-light" : "word-wood";

  return (
    <Tag ref={containerRef as React.RefObject<HTMLHeadingElement>} className={className}>
      {words.map((word, i) => {
        const wordCleaned = word.toLowerCase().replace(/[^a-z]/g, "");
        const isHighlighted = highlightWords.some(
          (uw) => wordCleaned === uw.toLowerCase().replace(/[^a-z]/g, ""),
        );

        return (
          <Fragment key={i}>
            <span
              className={`reveal-word ${inView ? "reveal-word-in" : ""}`}
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              {isHighlighted ? <span className={highlightClass}>{word}</span> : word}
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
      tileRef.current.style.transform = `perspective(1200px) rotateY(${x * 4}deg) rotateX(${-y * 3}deg)`;
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
        className="tilt-target group relative aspect-[3/4] w-full overflow-hidden"
      >
        <img
          src={img}
          alt={label}
          loading="lazy"
          className="animate-kenburns-hover h-full w-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-matte/80 via-matte/10 to-transparent"
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="eyebrow mb-1.5 text-wood-light">{location}</p>
          <p className="display text-cream text-xl leading-tight sm:text-2xl">{label}</p>
        </div>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Scroll-pinned intro statement section (dark band)                   */
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
    <section ref={sectionRef} className="relative bg-matte" style={{ height: "250vh" }} id="about">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={statementImg}
            alt=""
            aria-hidden="true"
            width={1536}
            height={1024}
            className="animate-kenburns h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-matte/75" />

        {/* Text layers */}
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          {/* Line 1 */}
          <p
            className="display text-[clamp(2rem,5.5vw,3.6rem)] text-cream transition-opacity duration-700"
            style={{ opacity: line1Opacity }}
          >
            Sixteen years. Still obsessed with the <span className="word-wood-light">details.</span>
          </p>

          {/* Line 2 */}
          <p
            className="display text-[clamp(2rem,5.5vw,3.6rem)] text-cream transition-opacity duration-700"
            style={{ opacity: line2Opacity }}
          >
            <AnimatedCounter
              end={16}
              prefix=""
              suffix="+ years"
              start={showCounter}
              className="tabular-nums"
            />
            . Not a single <span className="word-wood-light">hair out of place.</span>
          </p>

          {/* Line 3 */}
          <div
            className="transition-opacity duration-700"
            style={{ opacity: line3Opacity }}
          >
            <p className="display text-[clamp(2rem,5.5vw,3.6rem)] text-cream">
              Deep in the weeds of tourism, events and{" "}
              <span className="word-wood-light">strategic marketing</span> — here in Aotearoa and
              well beyond it.
            </p>
            <p className="eyebrow mt-10 text-cream/50">Based in Taupō, New Zealand</p>
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
  const spectacleRef = useRef<HTMLDivElement>(null);
  const [spectacleY, setSpectacleY] = useState(0);

  useEffect(() => {
    const el = spectacleRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const fromTop = rect.top + window.scrollY;
    const rel = scrollY + window.innerHeight - fromTop;
    setSpectacleY(rel * 0.08);
  }, [scrollY]);

  return (
    <div id="top" className="bg-cream text-matte">
      <Nav />

      {/* ================================================================ */}
      {/* 1 — HERO (dark, full-bleed)                                      */}
      {/* ================================================================ */}
      <section className="relative flex min-h-[calc(100vh-78px)] items-end overflow-hidden bg-matte sm:min-h-[calc(100vh-88px)]">
        <div
          className="absolute inset-0"
          style={{ transform: `translate3d(0, ${scrollY * 0.2}px, 0)` }}
        >
          <img
            src={heroImg}
            alt="Aerial helicopter view over Queenstown lakes and the Southern Alps at golden hour"
            width={1536}
            height={1024}
            className="animate-kenburns h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-matte via-matte/45 to-matte/25"
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-14 sm:px-8 sm:pb-24">
          <Reveal>
            <p className="eyebrow text-wood-light">Events &amp; Marketing &middot; Taupō, New Zealand</p>
          </Reveal>

          <StaggeredHeadline
            as="h1"
            light
            text="From concept to flawless execution."
            highlightWords={["flawless", "execution."]}
            className="display mt-6 max-w-[15ch] text-cream text-[clamp(2.9rem,9vw,8rem)]"
          />

          <Reveal delay={300} className="mt-7 max-w-xl">
            <p className="text-base text-cream/70 sm:text-lg sm:leading-relaxed">
              I design and deliver events that people actually talk about afterwards — and build
              marketing strategies that do more than just look nice in a slide deck.
            </p>
          </Reveal>

          <Reveal delay={380} className="mt-9 flex flex-wrap items-center gap-6">
            <MagneticButton href="#contact" isLight>
              Start a project
            </MagneticButton>
            <a
              href="#experiences"
              className="eyebrow text-cream/60 transition-colors hover:text-wood-light"
            >
              Our work &rsaquo;
            </a>
          </Reveal>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 2 — INTRO STATEMENT (dark, scroll-pinned)                        */}
      {/* ================================================================ */}
      <IntroSection />

      {/* ================================================================ */}
      {/* 3 — PORTFOLIO GRID (light)                                        */}
      {/* ================================================================ */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[1440px] px-5 pt-24 sm:px-8 sm:pt-32">
          <Reveal>
            <p className="eyebrow text-wood">The Calibre of Work</p>
          </Reveal>
          <StaggeredHeadline
            text="Moments made to matter."
            highlightWords={["matter."]}
            className="display mt-5 max-w-[16ch] text-[clamp(2.2rem,6vw,5rem)]"
          />
        </div>

        <div className="mt-14 grid grid-cols-2 gap-1 sm:gap-1.5 lg:grid-cols-4">
          <PhotoGridTile img={expIncentive} label="Alpine Incentive" location="Queenstown" />
          <PhotoGridTile img={expMarketing} label="Lakeside Gala" location="Lake Wānaka" />
          <PhotoGridTile img={expCorporate} label="Corporate Showcase" location="Southern Alps" />
          <PhotoGridTile img={expStrategy} label="Familiarisation Tour" location="Taupō" />
        </div>
      </section>

      {/* ================================================================ */}
      {/* 4 — SPECTACLE MOMENT (dark, wood-grain)                           */}
      {/* ================================================================ */}
      <section
        ref={spectacleRef}
        className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-matte py-28 sm:min-h-[80vh]"
      >
        <div
          className="absolute inset-0"
          style={{ transform: `translate3d(0, ${spectacleY}px, 0) scale(1.15)` }}
        >
          <img
            src={spectacleImg}
            alt=""
            aria-hidden="true"
            width={1536}
            height={1024}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-matte/45" aria-hidden="true" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <Reveal>
            <p className="eyebrow text-cream/70">The Approach</p>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="spectacle-type mt-6 text-[clamp(3rem,13vw,10rem)] uppercase leading-[0.86]">
              <span className="block">
                Above
                <span className="italic lowercase font-normal opacity-90"> &amp; </span>
              </span>
              <span className="block">Beyond</span>
            </h2>
          </Reveal>
          <Reveal delay={240}>
            <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-cream/70 sm:text-lg">
              One person. The thoroughness of an agency. The accountability of someone whose name is
              on the door.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 5 — SERVICES (light)                                              */}
      {/* ================================================================ */}
      <section id="services" className="bg-cream">
        <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32">
          <Reveal>
            <p className="eyebrow text-wood">Services</p>
          </Reveal>

          <StaggeredHeadline
            text="Here's what I'm good at."
            highlightWords={["good"]}
            className="display mt-5 max-w-[14ch] text-[clamp(2.2rem,6vw,5rem)]"
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {[
              {
                title: "Event Management & Delivery",
                context:
                  "For DMCs and luxury incentive partners who need someone on the ground who actually knows New Zealand — not just reads about it.",
                bullets: [
                  "Luxury incentive programmes & corporate events",
                  "End-to-end logistics & supplier management",
                  "Bespoke familiarisation programmes",
                  "On-site delivery & leadership",
                  "Runsheets thick enough to stop a door. Every page accounted for.",
                ],
              },
              {
                title: "Marketing Strategy & Execution",
                context:
                  "For corporate clients who need marketing that moves the needle — not just fills the calendar with colour.",
                bullets: [
                  "Marketing strategy & planning",
                  "Email marketing & campaign implementation",
                  "Social marketing aligned to actual business goals",
                  "Partnership, sponsorship & charity packages",
                  "Stakeholder liaison & brand collateral",
                ],
              },
            ].map((card, i) => (
              <Reveal
                key={card.title}
                delay={i * 140}
                className="group flex flex-col border border-matte/10 p-8 transition-colors duration-500 hover:border-wood/40 sm:p-10"
              >
                <h3 className="display text-[1.6rem] sm:text-3xl">
                  <span className="underline-wood underline-wood-drawn">{card.title}</span>
                </h3>
                <p className="mt-5 text-matte/60">{card.context}</p>
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
              Senior-level strategy and delivery — not posting pretty pictures and hoping for likes.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 6 — EXPERIENCES / TRACK RECORD (dark)                            */}
      {/* ================================================================ */}
      <section id="experiences" className="bg-matte text-cream">
        <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32">
          <Reveal>
            <p className="eyebrow text-wood-light">Experiences</p>
          </Reveal>

          <StaggeredHeadline
            light
            text="A track record built on trust."
            highlightWords={["trust."]}
            className="display mt-5 max-w-[14ch] text-cream text-[clamp(2.2rem,6vw,5rem)]"
          />

          <div className="mt-14 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            <div className="flex w-max gap-8 pb-4">
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
                  line: "Ongoing email, social and sponsorship strategy for a corporate client who no longer thinks about it — because it\u2019s handled.",
                },
              ].map((tile, i) => (
                <Reveal
                  key={tile.label}
                  delay={i * 100}
                  className="w-[300px] flex-shrink-0 snap-start sm:w-[380px]"
                >
                  <div className="divider-wood mb-6 opacity-60" />
                  <p className="eyebrow text-wood-light">{tile.label}</p>
                  <p className="mt-4 text-lg leading-relaxed text-cream/75">{tile.line}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 7 — CONTACT (light)                                               */}
      {/* ================================================================ */}
      <section id="contact" className="bg-cream">
        <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32">
          <div className="max-w-3xl">
            <Reveal>
              <p className="eyebrow text-wood">Contact</p>
            </Reveal>

            <StaggeredHeadline
              text="Let's talk."
              highlightWords={["talk."]}
              as="h2"
              className="display mt-5 max-w-[10ch] text-[clamp(3rem,11vw,9rem)]"
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
      {/* 8 — FOOTER (dark)                                                 */}
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
