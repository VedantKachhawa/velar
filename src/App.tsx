import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

const GRASS_GREEN = "#213138";
const FULL_TEXT = "Velar.";
const HOUSE_IMG = "/building.webp";
const BG_IMG =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260603_073200_7082add5-f1f8-4873-8696-d6f78a44089b.png&w=1920&q=85";

const GALLERY_VIDEOS = [
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260528_154759_4cdc8175-8261-497c-b688-9477c76545d4.mp4",
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260528_154751_39b1b9bb-2708-4211-b6a2-d39f93309e52.mp4",
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260528_154737_eba7900c-0313-483c-a30a-632c747ccc42.mp4",
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260602_144009_4348fe33-f885-4345-8e92-3fe1c2625d32.mp4",
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260602_145337_e44eaa8c-6bb1-4a6e-a70f-ed0231cbaccb.mp4",
] as const;

const TICKER_TEXT =
  "Velar.   Velar.   Velar.   Velar.   Velar.   Velar.   Velar.   Velar.  ";

const CHAR_INTERVAL = 140;
const TYPE_START = 600;
const LIFT_AT = TYPE_START + FULL_TEXT.length * CHAR_INTERVAL + 700;

const MENU_LINKS = [
  { label: "Residences", href: "#residences" },
  { label: "Story", href: "#story" },
  { label: "Listings", href: "#listings" },
  { label: "Inquire", href: "#inquire" },
] as const;

const STATS = [
  { end: 120, suffix: "+", label: "Portfolio Holdings" },
  { end: 12, suffix: "", label: "Global Locations" },
  { end: 98, suffix: "%", label: "Patron Loyalty Rate" },
] as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function CountUp({ end, suffix }: { end: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    let started = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || started) return;
        started = true;
        const start = performance.now();

        const tick = (now: number) => {
          const t = Math.min((now - start) / 2000, 1);
          const eased = 1 - (1 - t) ** 3;
          setValue(Math.round(eased * end));
          if (t < 1) frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [end]);

  return (
    <span ref={ref} aria-label={`${end}${suffix}`}>
      {value}
      {suffix}
    </span>
  );
}

function VelarMark({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={className}
      style={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: 700,
        letterSpacing: "-0.02em",
        ...style,
      }}
    >
      Velar<span style={{ fontWeight: 900 }}>.</span>
    </span>
  );
}

const PAGE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Syne:wght@400;700;800;900&display=swap');

html, body, #root {
  background: #f5f0ea;
  overflow-x: clip;
}

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  color: #213138;
  -webkit-font-smoothing: antialiased;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.preloader-word {
  display: inline-flex;
  align-items: center;
  font-family: 'Syne', sans-serif;
  font-size: 2.6rem;
  color: #ffffff;
  letter-spacing: -0.02em;
  line-height: 1;
  white-space: nowrap;
}

.type-cursor {
  display: inline-block;
  width: 3px;
  height: 1.1em;
  margin-left: 3px;
  border-radius: 999px;
  background: #ffffff;
  animation: blink 0.7s step-end infinite;
  flex: 0 0 auto;
}

.hero-text-block {
  position: relative;
  z-index: 10;
  opacity: 0;
  transform: translateY(-28px);
}

.house-wrap {
  position: fixed;
  z-index: 22;
  bottom: 0;
  left: 50%;
  width: 100%;
  min-width: 1400px;
  pointer-events: none;
  will-change: transform;
  transform: translateX(-50%);
}

.hero-text-block.is-in {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.1s,
    transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.1s;
}

.hero-heading-top {
  margin-bottom: -0.04em;
}

.hero-own-the,
.hero-extraordinary {
  margin: 0;
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  text-transform: uppercase;
  color: #000000;
  letter-spacing: -0.03em;
  line-height: 1;
}

.hero-subtitle-desktop {
  display: none;
  margin: 0 0 0.2em;
  max-width: 300px;
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: clamp(10px, 0.95vw, 14px);
  line-height: 1.6;
  letter-spacing: 0.02em;
  text-align: right;
  color: #000000;
  opacity: 0.7;
}

.hero-subtitle-mobile {
  display: block;
  margin: 0.9em 0 0;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  font-family: 'Syne', sans-serif;
  font-weight: 600;
  font-size: clamp(12px, 3vw, 15px);
  line-height: 1.5;
  color: #000000;
  opacity: 0.65;
}

.s2-section {
  position: sticky;
  top: 0;
  height: 100vh;
  background: #1a1a1a;
  overflow: hidden;
}

.s2-content {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding-top: clamp(30px, 4vw, 60px);
  padding-bottom: clamp(60px, 8vw, 120px);
}

.s2-copy,
.s2-stats-row {
  box-sizing: border-box;
  width: 100%;
  max-width: 1200px;
  margin-right: auto;
  margin-left: auto;
  padding-left: 25%;
}

.s2-statement {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-weight: 300;
  font-size: clamp(22px, 2.6vw, 42px);
  line-height: 1.35;
  letter-spacing: -0.02em;
  color: #e8e4df;
  white-space: nowrap;
}

.s2-stats-row {
  display: flex;
  margin-top: clamp(48px, 6vw, 80px);
}

.s2-stat {
  flex: 1;
  min-width: 0;
}

.s2-stat + .s2-stat {
  padding-left: clamp(20px, 2.5vw, 40px);
  border-left: 1px solid rgba(255, 255, 255, 0.2);
}

.s2-num {
  font-family: 'Inter', sans-serif;
  font-weight: 300;
  font-size: clamp(36px, 4.5vw, 72px);
  line-height: 1.1;
  color: #ffffff;
}

.s2-label {
  margin-top: clamp(4px, 0.5vw, 8px);
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: clamp(12px, 1.1vw, 16px);
  line-height: 1.3;
  letter-spacing: 0.01em;
  color: rgba(255, 255, 255, 0.6);
}

.s3-gallery-section {
  position: relative;
  z-index: 25;
  height: 100vh;
  margin-top: -100vh;
  overflow: hidden;
  background: #1a1a1a;
}

.s3-ticker-wrap {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  pointer-events: none;
}

.ticker-track {
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.ticker-track span {
  padding-right: 0.3em;
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: clamp(100px, 14vw, 220px);
  line-height: 0.85;
  letter-spacing: -0.02em;
  color: #ffffff;
  white-space: nowrap;
  user-select: none;
  opacity: 0.1;
}

.s3-gallery-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: 100%;
  padding: clamp(24px, 4vw, 60px);
}

.gallery-expand-row {
  display: flex;
  gap: 6px;
  width: 100%;
  max-width: 1200px;
  height: 70%;
}

.gallery-expand-item {
  position: relative;
  flex: 1 1 0%;
  min-width: 0;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
  background: #111111;
  border-radius: 12px;
  transition: flex 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.gallery-expand-item:hover {
  flex: 4;
}

.gallery-expand-item video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 639px) {
  .hero-subtitle-desktop { display: none !important; }
  .hero-subtitle-mobile  { display: block !important; }
  .hero-text-block { padding-top: 90px !important; }
  .hero-heading-top { justify-content: flex-start !important; }
  .hero-own-the { font-size: 7.5vw !important; }
  .hero-extraordinary { font-size: 14.5vw !important; white-space: normal !important; word-break: break-word !important; line-height: 0.9 !important; }
}

@media (min-width: 640px) and (max-width: 1023px) {
  .hero-subtitle-desktop { display: none !important; }
  .hero-subtitle-mobile  { display: block !important; }
  .hero-text-block { padding-top: 110px !important; }
  .hero-heading-top { justify-content: flex-start !important; }
  .hero-own-the { font-size: 5.5vw !important; }
  .hero-extraordinary { font-size: 11vw !important; white-space: normal !important; word-break: break-word !important; line-height: 0.9 !important; }
}

@media (min-width: 1024px) {
  .hero-subtitle-desktop { display: block !important; }
  .hero-subtitle-mobile  { display: none !important; }
  .hero-text-block { padding-top: calc(28vh - 50px) !important; }
  .hero-own-the { font-size: 3vw !important; }
  .hero-extraordinary { font-size: clamp(52px, 6.5vw, 9vw) !important; white-space: nowrap !important; line-height: 0.88 !important; }
}

@media (max-width: 767px) {
  .s2-copy,
  .s2-stats-row {
    padding-left: 0;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .s2-copy,
  .s2-stats-row {
    padding-left: 15%;
  }

  .s2-section {
    min-height: 70vh;
  }

  .s2-content {
    padding-top: clamp(24px, 3vw, 40px);
    padding-bottom: clamp(40px, 6vw, 72px);
  }
}

@media (max-width: 1023px) {
  .s3-gallery-section { height: auto; min-height: 100vh; overflow: visible; }
  .s3-ticker-wrap { position: sticky; top: 0; height: 100vh; width: 100%; margin-bottom: -100vh; }
  .s3-gallery-content { height: auto; align-items: flex-start; padding: 80px 16px 60px; }
  .gallery-expand-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; height: auto; width: 100%; max-width: 700px; }
  .gallery-expand-item { flex: none; height: auto; aspect-ratio: 4/5; border-radius: 10px; transition: transform 0.3s ease; }
  .gallery-expand-item:hover { flex: none; transform: scale(1.02); }
  .gallery-expand-item:last-child:nth-child(odd) { grid-column: 1 / -1; max-width: calc(50% - 4px); justify-self: center; }
}

@media (max-width: 479px) {
  .s3-gallery-content { padding: 60px 12px 48px; }
  .gallery-expand-row { gap: 6px; }
}
`;

export default function App() {
  const [typedCount, setTypedCount] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [lifting, setLifting] = useState(false);
  const [heroIn, setHeroIn] = useState(false);
  const [liftDone, setLiftDone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navOnDark, setNavOnDark] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const darkRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const houseRef = useRef<HTMLDivElement>(null);
  const houseImgRef = useRef<HTMLImageElement>(null);
  const liftDoneRef = useRef(false);

  const navColor = menuOpen ? GRASS_GREEN : navOnDark ? "#ffffff" : GRASS_GREEN;

  const updateHousePosition = useCallback(() => {
    const house = houseRef.current;
    const hero = heroRef.current;
    const dark = darkRef.current;
    const img = houseImgRef.current;
    if (!house || !hero || !dark || !img || !liftDoneRef.current) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const baseW = Math.max(vw, 1400);
    const imgH =
      img.offsetHeight ||
      (img.naturalWidth
        ? baseW * (img.naturalHeight / img.naturalWidth)
        : 0);
    if (imgH <= 0) return;

    const heroRect = hero.getBoundingClientRect();
    const darkRect = dark.getBoundingClientRect();
    const heroH = heroRect.height;

    const triggerPoint = -(heroH * 0.3);
    const endPoint = heroRect.top - (darkRect.bottom - vh);
    const denom = endPoint - triggerPoint;
    const progress =
      Number.isFinite(denom) && denom !== 0
        ? clamp((heroRect.top - triggerPoint) / denom, 0, 1)
        : 0;

    if (progress <= 0) {
      house.style.top = "";
      house.style.left = "";
      house.style.bottom = "";
      house.style.transform = "";
      house.style.transformOrigin = "";
      return;
    }

    const t = smoothstep(smoothstep(progress));
    const startX = (vw - baseW) / 2;
    const startY = vh - imgH;
    const finalScale = 1.45;
    const finalX = (vw - baseW * finalScale) / 2;
    const mobileOffset = vw < 1024 ? -250 : 4;
    const finalY = darkRect.bottom - imgH * finalScale + 500 + mobileOffset;
    const currentX = startX + (finalX - startX) * t;
    const currentY = startY + (finalY - startY) * t;
    const currentScale = 1 + (finalScale - 1) * t;

    house.style.top = "0";
    house.style.bottom = "";
    house.style.left = "0";
    house.style.transformOrigin = "top left";
    house.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale})`;
  }, []);

  const updateNav = useCallback(() => {
    const onDark = [darkRef.current, galleryRef.current].some((el) => {
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return rect.top <= 0 && rect.bottom > 0;
    });
    setNavOnDark(onDark);
  }, []);

  useEffect(() => {
    liftDoneRef.current = liftDone;
  }, [liftDone]);

  useEffect(() => {
    setTypedCount(0);
    setShowCursor(true);
    setLifting(false);
    setHeroIn(false);
    setLiftDone(false);

    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms));
    };

    for (let i = 0; i < FULL_TEXT.length; i += 1) {
      later(() => setTypedCount(i + 1), TYPE_START + i * CHAR_INTERVAL);
    }

    later(() => setShowCursor(false), LIFT_AT - 150);
    later(() => setLifting(true), LIFT_AT);
    later(() => setHeroIn(true), LIFT_AT + 1300);
    later(() => setLiftDone(true), LIFT_AT + 2100);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  useEffect(() => {
    updateNav();
    window.addEventListener("scroll", updateNav, { passive: true });
    window.addEventListener("resize", updateNav);
    return () => {
      window.removeEventListener("scroll", updateNav);
      window.removeEventListener("resize", updateNav);
    };
  }, [updateNav]);

  useEffect(() => {
    if (!liftDone) return;

    updateHousePosition();
    window.addEventListener("scroll", updateHousePosition, { passive: true });
    window.addEventListener("resize", updateHousePosition);
    return () => {
      window.removeEventListener("scroll", updateHousePosition);
      window.removeEventListener("resize", updateHousePosition);
    };
  }, [liftDone, updateHousePosition]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    const videos = document.querySelectorAll<HTMLVideoElement>(
      ".gallery-expand-item video",
    );
    videos.forEach((video) => {
      video.muted = true;
      video.play().catch(() => {});
    });
  }, []);

  return (
    <div style={{ overflowX: "clip", background: "#f5f0ea", minHeight: "100vh" }}>
      <style>{PAGE_CSS}</style>

      <header className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-6 py-5 md:px-10 md:py-6 lg:px-16">
        <a
          href="#residences"
          aria-label="Velar. home"
          onClick={() => setMenuOpen(false)}
          style={{ color: navColor, transition: "color 0.35s ease" }}
        >
          <VelarMark className="text-xl" />
        </a>
        <button
          type="button"
          className="group relative z-50 flex w-7 flex-col items-end justify-center gap-[7px]"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
          style={{ color: navColor, transition: "color 0.35s ease" }}
        >
          {menuOpen ? (
            <X size={24} />
          ) : (
            <>
              <span className="block h-px w-7 bg-current transition-all duration-300 group-hover:w-5" />
              <span className="block h-px w-7 bg-current" />
            </>
          )}
        </button>
      </header>

      {menuOpen ? (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 flex items-center justify-center"
          style={{ background: "#f5f0ea" }}
        >
          <nav className="flex flex-col items-center gap-8" aria-label="Mobile">
            {MENU_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-4xl font-light tracking-widest text-black uppercase transition-colors hover:text-gray-500"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      ) : null}

      <main>
        <section
          id="residences"
          ref={heroRef}
          aria-label="Live in irreplaceable"
          style={{
            position: "relative",
            minHeight: "100vh",
            overflow: "visible",
            backgroundColor: "#e6dfd6",
            backgroundImage: `url(${BG_IMG})`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className={`hero-text-block${heroIn ? " is-in" : ""}`}>
            <div className="hero-heading-top flex items-end justify-between px-6 md:px-10 lg:px-16">
              <p className="hero-own-the">LIVE IN</p>
              <p className="hero-subtitle-desktop">
                Stately homes built with vision,
                <br />
                scope, and architectural finesse.
              </p>
            </div>
            <div style={{ overflow: "hidden" }}>
              <h1 className="hero-extraordinary px-6 md:px-10 lg:px-16">
                IRREPLACEABLE
              </h1>
            </div>
            <p className="hero-subtitle-mobile">
              Premium real estate with vision,
              <br />
              depth, and architectural clarity.
            </p>
          </div>
        </section>

        <div ref={houseRef} className="house-wrap" aria-hidden="true">
          <div
            style={{
              width: "100%",
              transform: lifting ? "translateY(0)" : "translateY(102vh)",
              transition: liftDone
                ? "none"
                : "transform 1.5s cubic-bezier(0.45, 0, 0.15, 1) 0.4s",
            }}
          >
            <img
              ref={houseImgRef}
              src={HOUSE_IMG}
              alt=""
              aria-hidden="true"
              onLoad={updateHousePosition}
              style={{ display: "block", width: "100%" }}
            />
          </div>
        </div>

        <section
          id="story"
          ref={darkRef}
          aria-label="Standards"
          style={{ position: "relative", height: "200vh", zIndex: 20, background: "#1a1a1a" }}
        >
          <div aria-hidden="true" style={{ height: "4vh", background: "#1a1a1a" }} />
          <div className="s2-section">
            <div className="s2-content px-6 md:px-10 lg:px-16">
              <div className="s2-copy">
                <p className="s2-statement">
                  Every estate we present is hand-chosen
                  <br />
                  through a frame of permanence, refinement,
                  <br />
                  and timeless detail. Standards are not
                  <br />
                  a flourish. It is our discipline.
                </p>
              </div>
              <div className="s2-stats-row" id="inquire">
                {STATS.map((stat) => (
                  <div className="s2-stat" key={stat.label}>
                    <div className="s2-num">
                      <CountUp end={stat.end} suffix={stat.suffix} />
                    </div>
                    <div className="s2-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="listings"
          ref={galleryRef}
          className="s3-gallery-section"
          aria-label="Residences"
        >
          <div className="s3-ticker-wrap" aria-hidden="true">
            <div className="ticker-track">
              <span>{TICKER_TEXT}</span>
              <span>{TICKER_TEXT}</span>
            </div>
          </div>
          <div className="s3-gallery-content">
            <div className="gallery-expand-row">
              {GALLERY_VIDEOS.map((src, index) => (
                <div className="gallery-expand-item" key={src}>
                  <video
                    src={src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    aria-label={`Residence ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <div
        aria-hidden={lifting}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: GRASS_GREEN,
          transform: lifting ? "translateY(-100%)" : "translateY(0)",
          transition: liftDone
            ? "none"
            : "transform 1.5s cubic-bezier(0.45, 0, 0.15, 1)",
          pointerEvents: lifting ? "none" : "auto",
        }}
      >
        <p className="preloader-word">
          {FULL_TEXT.slice(0, typedCount)
            .split("")
            .map((char, index) => (
              <span key={`${char}-${index}`} style={{ fontWeight: char === "." ? 900 : 700 }}>
                {char}
              </span>
            ))}
          {showCursor ? <span className="type-cursor" /> : null}
        </p>
      </div>
    </div>
  );
}
