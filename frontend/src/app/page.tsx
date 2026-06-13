"use client";

import { useRef, memo, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useScroll,
  useSpring,
} from "framer-motion";
import {
  ArrowRight,
  Terminal,
  Users,
  Layout,
  TrendingUp,
  Database,
  ShieldCheck,
  Sparkles,
  Zap,
  Star,
} from "lucide-react";
import type { ElementType, MouseEvent as ReactMouseEvent } from "react";

/* ═══════════════════════════════════════════
   HERO CURSOR ORB (SVG-based follow animation)
   ═══════════════════════════════════════════ */

function HeroCursorOrb() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 80, damping: 30, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 30, mass: 0.5 });

  const handleMouseMove = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  return (
    <div
      onMouseMove={handleMouseMove}
      className="absolute inset-0 overflow-hidden pointer-events-auto"
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="orb-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(128,128,128,0.12)" />
            <stop offset="50%" stopColor="rgba(128,128,128,0.05)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>
        <motion.circle
          cx={springX}
          cy={springY}
          r="220"
          fill="url(#orb-gradient)"
          style={{ willChange: "cx, cy" }}
        />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════
   FEATURE CARD (Bento grid item)
   ═══════════════════════════════════════════ */

const FeatureCard = memo(function FeatureCard({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: ElementType;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="gradient-border group p-7 md:p-8 bg-white dark:bg-[#0f0f1a]/80 backdrop-blur-sm flex flex-col gap-5 cursor-default"
    >
      <div className="w-11 h-11 rounded-xl bg-zinc-500/10 dark:bg-zinc-500/15 flex items-center justify-center group-hover:bg-zinc-500/20 transition-colors duration-300">
        <Icon
          className="text-zinc-800 dark:text-zinc-200 group-hover:scale-110 transition-transform duration-300"
          size={22}
          strokeWidth={1.8}
        />
      </div>
      <h3 className="text-[17px] font-semibold tracking-tight text-slate-800 dark:text-white">
        {title}
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
});

/* ═══════════════════════════════════════════
   TESTIMONIAL CARD
   ═══════════════════════════════════════════ */

const TestimonialCard = memo(function TestimonialCard({
  quote,
  author,
  role,
  index,
}: {
  quote: string;
  author: string;
  role: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className="relative p-8 rounded-2xl bg-white dark:bg-white/[0.03] backdrop-blur-md border border-slate-200 dark:border-white/[0.06] shadow-sm dark:shadow-none flex flex-col gap-6 min-w-0"
    >
      {/* Decorative quote mark */}
      <span className="absolute top-5 right-6 text-6xl font-serif text-zinc-500/15 dark:text-zinc-400/10 leading-none select-none pointer-events-none">
        &ldquo;
      </span>
      <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-300 relative z-10 font-medium">
        {quote}
      </p>
      <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-white/[0.06]">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 dark:from-zinc-300 dark:to-zinc-500 flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-white">
            {author.charAt(0)}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
            {author}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
            {role}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

/* ═══════════════════════════════════════════
   FEATURES DATA
   ═══════════════════════════════════════════ */

const FEATURES = [
  {
    icon: Layout,
    title: "Multi-tenant Workspaces",
    description:
      "Switch between organizations and projects instantly without losing context or state.",
  },
  {
    icon: Users,
    title: "Real-time Collaboration",
    description:
      "Every change is broadcast instantly. Collaborative editing as fast as your thoughts.",
  },
  {
    icon: Terminal,
    title: "Keyboard-first UX",
    description:
      "A command palette for everything. Navigate, search, and act without touching the mouse.",
  },
  {
    icon: TrendingUp,
    title: "Built-in Analytics",
    description:
      "Velocity tracking, burndown charts, and cycle time metrics — zero configuration.",
  },
  {
    icon: Database,
    title: "Powerful API",
    description:
      "Robust REST APIs to connect Forge with every tool in your engineering stack.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    description:
      "SSO, audit logs, and granular role-based permissions. Peace of mind at any scale.",
  },
] as const;

const TESTIMONIALS = [
  {
    quote:
      "Forge changed the way we build. The speed of the interface is unmatched — it feels like it's reading our minds.",
    author: "David Chen",
    role: "CTO at Lumen",
  },
  {
    quote:
      "Finally, a tool that respects our workflow instead of forcing a new one. Our team velocity jumped 40%.",
    author: "Sarah Jenkins",
    role: "Design Lead at Acme",
  },
  {
    quote:
      "Keyboard shortcuts alone saved us hours every week. It's genuinely built for power users.",
    author: "Marcus Thorne",
    role: "Staff Engineer at Stark",
  },
] as const;

const LOGOS = [
  "STARK",
  "LUMEN",
  "ACME",
  "GLOBEX",
  "OCP",
  "SOYLENT",
  "AXIOM",
  "NOVA",
] as const;

const SHOWCASE_BLOCKS = [
  {
    tag: "ARCHITECTURE",
    title: "Organize with Kanban.",
    desc: "Visualize your workflow with highly customizable boards. Drag, drop, and automate your way to the finish line.",
    reverse: false,
  },
  {
    tag: "COLLABORATION",
    title: "Manage Members.",
    desc: "Unified member management for multi-tenant environments. Assign roles, teams, and departments with ease.",
    reverse: true,
  },
  {
    tag: "TRANSPARENCY",
    title: "Activity Logs.",
    desc: "Track every change with granular activity logs. See who did what, when, and revert to any state in seconds.",
    reverse: false,
  },
] as const;

/* ═══════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════ */

export default function HomePage() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  /* Stagger helpers */
  const headlineWords = "Ship projects faster. Your whole team, one workspace.".split(" ");

  return (
    <div className="min-h-screen overflow-x-hidden grid-bg relative">
      <main>
        {/* ──────────────────── HERO ──────────────────── */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Background aurora blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <div className="animate-aurora absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-zinc-400/10 dark:bg-zinc-800/10 blur-[128px]" />
            <div
              className="animate-aurora absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-zinc-500/10 dark:bg-zinc-800/5 blur-[128px]"
              style={{ animationDelay: "2s" }}
            />
            <div
              className="animate-aurora absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-zinc-350/5 dark:bg-zinc-900/5 blur-[100px]"
              style={{ animationDelay: "4s" }}
            />
          </div>

          {/* SVG Cursor-follow orb */}
          <HeroCursorOrb />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(rgba(128,128,128,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.03) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />

          <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20 md:pt-40 md:pb-28 text-center flex flex-col items-center gap-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-800 dark:text-zinc-300">
                <Sparkles size={13} />
                Now in public beta
              </span>
            </motion.div>

            {/* Headline — staggered word reveal */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white">
              {headlineWords.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.5,
                    delay: 0.15 + i * 0.06,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="inline-block mr-[0.28em]"
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed"
            >
              A high-performance project management tool built for modern teams.
              Stop juggling tabs and start building.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.85 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <button className="btn-shimmer bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-900 dark:hover:bg-zinc-100 font-semibold px-8 py-4 rounded-xl flex items-center justify-center gap-2.5 group transition-all duration-300 active:scale-[0.97] shadow-lg shadow-black/10 dark:shadow-white/5 cursor-pointer">
                Start for free
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </button>
              <button className="bg-white dark:bg-white/[0.06] backdrop-blur-sm border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 font-semibold px-8 py-4 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.1] transition-all duration-300 active:scale-[0.97] shadow-sm dark:shadow-none cursor-pointer">
                See how it works
              </button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="flex items-center gap-4 mt-4"
            >
              <div className="flex -space-x-2.5">
                {[1, 2, 3, 4, 5].map((i) => {
                  const grays = [
                    "from-zinc-900 to-zinc-700",
                    "from-zinc-800 to-zinc-650",
                    "from-zinc-700 to-zinc-500",
                    "from-zinc-600 to-zinc-400",
                    "from-zinc-500 to-zinc-300"
                  ];
                  return (
                    <div
                      key={i}
                      className={`w-9 h-9 rounded-full border-2 border-white dark:border-[#0a0a0f] bg-gradient-to-br ${grays[i - 1]} flex items-center justify-center`}
                    >
                      <span className="text-[10px] font-bold text-white">
                        {String.fromCharCode(64 + i)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      size={12}
                      className="text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Joined by 10,000+ builders
                </span>
              </div>
            </motion.div>
          </div>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface dark:from-[#0a0a0f] to-transparent pointer-events-none" />
        </section>

        {/* ──────────────────── LOGO TICKER ──────────────────── */}
        <section className="border-y border-slate-200 dark:border-white/[0.04] bg-white/60 dark:bg-white/[0.01] py-8 overflow-hidden">
          <div className="flex items-center">
            <div className="animate-marquee flex shrink-0 items-center gap-16 px-8">
              {[...LOGOS, ...LOGOS].map((logo, i) => (
                <span
                  key={`${logo}-${i}`}
                  className="text-xl md:text-2xl font-black tracking-tighter text-slate-300/80 dark:text-slate-700 whitespace-nowrap select-none"
                >
                  {logo}
                </span>
              ))}
            </div>
            <div
              className="animate-marquee flex shrink-0 items-center gap-16 px-8"
              aria-hidden="true"
            >
              {[...LOGOS, ...LOGOS].map((logo, i) => (
                <span
                  key={`${logo}-dup-${i}`}
                  className="text-xl md:text-2xl font-black tracking-tighter text-slate-300 dark:text-slate-700 whitespace-nowrap select-none"
                >
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────── FEATURES BENTO GRID ──────────────────── */}
        <section id="product" className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-650 dark:text-zinc-400 mb-4">
              <Zap size={13} />
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">
              Everything you need to ship.
            </h2>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              No fluff. Just the essentials, refined for maximum performance.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feat, i) => (
              <FeatureCard key={feat.title} {...feat} index={i} />
            ))}
          </div>
        </section>

        {/* ──────────────────── PRODUCT SHOWCASE (parallax) ──────────────────── */}
        <section
          ref={parallaxRef}
          className="relative bg-slate-50/80 dark:bg-white/[0.01] border-y border-slate-200 dark:border-white/[0.04]"
        >
          {/* Floating decorative shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <motion.div
              style={{ y: parallaxY }}
              className="absolute top-20 right-[10%] w-40 h-40 rounded-full border border-zinc-450/10 dark:border-zinc-800/5"
            />
            <motion.div
              style={{ y: parallaxY }}
              className="absolute bottom-32 left-[8%] w-24 h-24 rounded-lg border border-zinc-500/10 dark:border-zinc-800/5 rotate-12"
            />
          </div>

          <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 flex flex-col gap-24 md:gap-32">
            {SHOWCASE_BLOCKS.map((block, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
              >
                <div
                  className={`flex flex-col gap-5 ${block.reverse ? "lg:order-2" : ""}`}
                >
                  <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 dark:text-zinc-400 uppercase">
                    {block.tag}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {block.title}
                  </h2>
                  <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
                    {block.desc}
                  </p>
                </div>
                <div
                  className={`rounded-2xl bg-white dark:bg-[#0f0f1a] border border-slate-200 dark:border-white/[0.06] p-4 shadow-xl shadow-slate-300/40 dark:shadow-black/20 ${
                    block.reverse ? "lg:order-1" : ""
                  }`}
                >
                  {/* Abstract UI mockup */}
                  <div className="rounded-xl bg-slate-50 dark:bg-[#0a0a14] p-6 aspect-video flex flex-col gap-4">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                      <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                      <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                    </div>
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      {["To Do", "In Progress", "Done"].map((col) => (
                        <div key={col} className="flex flex-col gap-2">
                          <span className="text-[8px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-600">
                            {col}
                          </span>
                          <div
                            className={`flex-1 rounded-lg p-3 flex flex-col gap-2 ${
                              col === "In Progress"
                                ? "border border-zinc-400/40 bg-zinc-500/[0.05] dark:border-zinc-700/50 dark:bg-zinc-500/10"
                                : "border border-slate-200 dark:border-white/[0.04]"
                            }`}
                          >
                            <div
                              className={`h-1.5 rounded w-3/4 ${
                                col === "In Progress"
                                  ? "bg-zinc-450 dark:bg-zinc-500"
                                  : "bg-slate-200 dark:bg-slate-800"
                              }`}
                            />
                            <div
                              className={`h-1.5 rounded w-1/2 ${
                                col === "In Progress"
                                  ? "bg-zinc-350 dark:bg-zinc-650"
                                  : "bg-slate-100 dark:bg-slate-800/50"
                              }`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ──────────────────── TESTIMONIALS ──────────────────── */}
        <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-4">
              <Star size={13} />
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">
              Loved by builders everywhere.
            </h2>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Teams of all sizes trust Forge to ship faster and stay in sync.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <TestimonialCard key={t.author} {...t} index={i} />
            ))}
          </div>
        </section>

        {/* ──────────────────── CTA ──────────────────── */}
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black border border-zinc-200/10 dark:border-white/5" />

            {/* Animated dot grid */}
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage: "radial-gradient(white 1.5px, transparent 1.5px)",
                backgroundSize: "28px 28px",
              }}
            />

            {/* Glow accents */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-zinc-400/10 rounded-full blur-[60px]" />

            <div className="relative z-10 p-10 md:p-20 flex flex-col items-center text-center gap-7">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight max-w-2xl leading-[1.15]">
                Ready to build the future? Create your workspace today.
              </h2>
              <p className="text-zinc-200/70 text-base md:text-lg max-w-lg">
                Join 10,000+ teams shipping faster with Forge.
              </p>
              <button className="btn-shimmer bg-white text-black hover:bg-zinc-100 font-bold px-10 py-4 rounded-xl flex items-center gap-2.5 group transition-all duration-300 active:scale-[0.97] shadow-lg shadow-black/10 cursor-pointer">
                Create your workspace
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </button>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
