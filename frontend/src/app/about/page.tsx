"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500"] });

const PRIMARY = "#3C3489";
const TEAL = "#0D9488";
const BORDER = "#E4E4E7";
const TEXT_MAIN = "#09090B";
const TEXT_MUTED = "#71717A";
const BG_CARD = "#FFFFFF";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut" } as any,
};

const stats = [
  { value: "10,000+", label: "Teams worldwide" },
  { value: "50M+", label: "Tasks managed" },
  { value: "99.99%", label: "Uptime SLA" },
  { value: "140+", label: "Countries" },
];

const values = [
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    title: "Transparency",
    desc: "Radical openness in everything we build. Visibility into progress breeds trust across teams and stakeholders.",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: "Speed",
    desc: "Optimized for velocity. Our interface is designed for keyboard-first navigation and instant feedback loops.",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    title: "Developer First",
    desc: "Built by engineers, for engineers. Deep integrations, robust APIs, and full markdown support out of the box.",
  },
];

const team = [
  { name: "Elena Vance", role: "Co-founder & CEO", initials: "EV" },
  { name: "Mark Scout", role: "Co-founder & CTO", initials: "MS" },
  { name: "Helly R.", role: "Head of Design", initials: "HR" },
  { name: "Irving B.", role: "Head of Engineering", initials: "IB" },
];

const timeline = [
  {
    year: "2022",
    title: "Founding",
    desc: "Forge was conceptualized in a small San Francisco garage with a vision to fix fractured engineering workflows.",
  },
  {
    year: "2023 Q1",
    title: "Series A",
    desc: "Raised $15 M led by visionary investors who believe in architectural productivity at scale.",
  },
  {
    year: "2023 Q3",
    title: "Public Beta",
    desc: "Opened the platform to 500 waitlisted engineering teams for rigorous real-world testing.",
  },
  {
    year: "2024",
    title: "10 k Teams",
    desc: "Now proudly supporting some of the world's most innovative tech companies — and growing.",
  },
];

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 12px",
        borderRadius: 9999,
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: "0.02em",
        color: TEAL,
        background: "#F0FDFA",
        border: `1px solid ${TEAL}33`,
      }}
    >
      {children}
    </span>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Pill>
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: TEAL,
          display: "inline-block",
        }}
      />
      {children}
    </Pill>
  );
}

export default function AboutPage() {
  return (
    <main
      className={inter.className}
      style={{
        color: TEXT_MAIN,
        backgroundColor: "#FFFFFF",
        minHeight: "100vh",
        backgroundImage: `radial-gradient(circle, rgba(0, 0, 0, 0.56) 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
      }}
    >
      <section
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "96px 24px 80px",
          textAlign: "center",
        }}
      >
        <motion.div {...fadeUp}>
          <SectionLabel>About Forge</SectionLabel>

          <h1
            style={{
              marginTop: 24,
              fontSize: "clamp(36px, 5vw, 64px)",
              fontWeight: 500,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: TEXT_MAIN,
            }}
          >
            We&apos;re building the future of
            <br />
            <span style={{ color: PRIMARY }}>team collaboration.</span>
          </h1>

          <p
            style={{
              marginTop: 20,
              fontSize: 18,
              color: TEXT_MUTED,
              lineHeight: 1.7,
              maxWidth: 560,
              margin: "20px auto 0",
            }}
          >
            Forge is the operating system for high-performance engineering
            teams. We strip away the noise so you can focus on building what
            matters most.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              marginTop: 36,
            }}
          >
            <Link
              href="/signup"
              style={{
                padding: "10px 24px",
                borderRadius: 4,
                fontSize: 14,
                fontWeight: 500,
                background: PRIMARY,
                color: "#fff",
                textDecoration: "none",
                border: `1px solid ${PRIMARY}`,
                transition: "opacity .15s",
              }}
            >
              Get started free
            </Link>
            <Link
              href="/careers"
              style={{
                padding: "10px 24px",
                borderRadius: 4,
                fontSize: 14,
                fontWeight: 500,
                background: "transparent",
                color: TEXT_MAIN,
                textDecoration: "none",
                border: `1px solid ${BORDER}`,
                transition: "background .15s",
              }}
            >
              See open roles →
            </Link>
          </div>
        </motion.div>
      </section>

      <section
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px 96px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            alignItems: "start",
          }}
          className="about-mission-grid"
        >
          <motion.div {...fadeUp}>
            <SectionLabel>Our Mission</SectionLabel>
            <h2
              style={{
                marginTop: 16,
                fontSize: 32,
                fontWeight: 500,
                lineHeight: 1.3,
                letterSpacing: "-0.015em",
              }}
            >
              Ship faster,
              <br />
              without the chaos.
            </h2>
            <p
              style={{
                marginTop: 16,
                fontSize: 15,
                lineHeight: 1.8,
                color: TEXT_MUTED,
              }}
            >
              We believe that the best work happens when teams are in sync, not
              in meetings. Our mission is to empower developers and architects
              to deliver exceptional products through a disciplined,
              architectural approach to project management.
            </p>
            <p
              style={{
                marginTop: 12,
                fontSize: 15,
                lineHeight: 1.8,
                color: TEXT_MUTED,
              }}
            >
              Every task has a purpose. Every milestone is achievable. Every
              team deserves clarity.
            </p>
          </motion.div>

          {/* Right — stats grid */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1,
              border: `1px solid ${BORDER}`,
              borderRadius: 4,
              overflow: "hidden",
              background: BORDER,
            }}
          >
            {stats.map((s) => (
              <div
                key={s.label}
                style={{
                  background: BG_CARD,
                  padding: "32px 24px",
                }}
              >
                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    color: PRIMARY,
                  }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: 13, color: TEXT_MUTED, marginTop: 4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 3. VALUES ──────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "#FAFAFA",
          borderTop: `1px solid ${BORDER}`,
          borderBottom: `1px solid ${BORDER}`,
          padding: "80px 24px",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <motion.div
            {...fadeUp}
            style={{ textAlign: "center", marginBottom: 48 }}
          >
            <SectionLabel>Core Values</SectionLabel>
            <h2
              style={{
                marginTop: 14,
                fontSize: 32,
                fontWeight: 500,
                letterSpacing: "-0.015em",
              }}
            >
              What drives us every day.
            </h2>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1,
              border: `1px solid ${BORDER}`,
              borderRadius: 4,
              overflow: "hidden",
              background: BORDER,
            }}
          >
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{
                  background: BG_CARD,
                  padding: "40px 32px",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 4,
                    background: "#F4F0FF",
                    color: PRIMARY,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  {v.icon}
                </div>
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 500,
                    marginBottom: 10,
                  }}
                >
                  {v.title}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_MUTED }}>
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. TEAM ────────────────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "80px 24px",
        }}
      >
        <motion.div
          {...fadeUp}
          style={{ marginBottom: 48, textAlign: "center" }}
        >
          <SectionLabel>The Architects</SectionLabel>
          <h2
            style={{
              marginTop: 14,
              fontSize: 32,
              fontWeight: 500,
              letterSpacing: "-0.015em",
            }}
          >
            The minds behind the platform.
          </h2>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              style={{
                border: `1px solid ${BORDER}`,
                borderRadius: 4,
                padding: "32px 24px",
                textAlign: "center" as const,
                background: BG_CARD,
              }}
              whileHover={{ backgroundColor: "#F9F9FB" }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: PRIMARY,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: 500,
                  margin: "0 auto 20px",
                  letterSpacing: "0.02em",
                }}
              >
                {member.initials}
              </div>
              <div style={{ fontWeight: 500, fontSize: 15 }}>{member.name}</div>
              <div
                style={{
                  fontSize: 13,
                  color: TEXT_MUTED,
                  marginTop: 4,
                }}
              >
                {member.role}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 5. TIMELINE ────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "#FAFAFA",
          borderTop: `1px solid ${BORDER}`,
          borderBottom: `1px solid ${BORDER}`,
          padding: "80px 24px",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <motion.div
            {...fadeUp}
            style={{ textAlign: "center", marginBottom: 56 }}
          >
            <SectionLabel>Our Journey</SectionLabel>
            <h2
              style={{
                marginTop: 14,
                fontSize: 32,
                fontWeight: 500,
                letterSpacing: "-0.015em",
              }}
            >
              From garage to global.
            </h2>
          </motion.div>

          <div style={{ position: "relative" }}>
            {/* Vertical line */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: 0,
                bottom: 0,
                width: 1,
                background: BORDER,
                transform: "translateX(-50%)",
              }}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
              {timeline.map((item, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <motion.div
                    key={item.title}
                    {...fadeUp}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 40px 1fr",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    {/* Left column */}
                    <div
                      style={{
                        textAlign: isLeft ? "right" : "left",
                        gridColumn: "1",
                      }}
                    >
                      {isLeft && (
                        <TimelineCard
                          year={item.year}
                          title={item.title}
                          desc={item.desc}
                        />
                      )}
                    </div>

                    {/* Dot */}
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: PRIMARY,
                        border: `2px solid #fff`,
                        boxShadow: `0 0 0 2px ${PRIMARY}`,
                        margin: "0 auto",
                        gridColumn: "2",
                        flexShrink: 0,
                      }}
                    />

                    {/* Right column */}
                    <div style={{ gridColumn: "3" }}>
                      {!isLeft && (
                        <TimelineCard
                          year={item.year}
                          title={item.title}
                          desc={item.desc}
                        />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. CTA BANNER ──────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 24px" }}>
        <motion.div
          {...fadeUp}
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            background: PRIMARY,
            borderRadius: 4,
            padding: "72px 48px",
            textAlign: "center",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: 9999,
              fontSize: 12,
              fontWeight: 500,
              color: "#C5C0FF",
              border: "1px solid rgba(197,192,255,0.3)",
              marginBottom: 20,
            }}
          >
            Get started today
          </span>

          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: "#fff",
              lineHeight: 1.2,
            }}
          >
            Start building with Forge today.
          </h2>

          <p
            style={{
              marginTop: 16,
              fontSize: 16,
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.7,
            }}
          >
            Join thousands of teams who have found their focus.
            <br />
            No credit card required.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              marginTop: 36,
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/signup"
              style={{
                padding: "11px 28px",
                borderRadius: 4,
                fontSize: 14,
                fontWeight: 500,
                background: "#fff",
                color: PRIMARY,
                textDecoration: "none",
                border: "1px solid #fff",
                transition: "opacity .15s",
              }}
            >
              Get started free
            </Link>
            <Link
              href="/contact"
              style={{
                padding: "11px 28px",
                borderRadius: 4,
                fontSize: 14,
                fontWeight: 500,
                background: "transparent",
                color: "#fff",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.4)",
                transition: "background .15s",
              }}
            >
              Talk to sales
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 900px) {
          .about-mission-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 700px) {
          .about-team-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .about-values-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}

// ─── Timeline card helper ─────────────────────────────────────────────────────
function TimelineCard({
  year,
  title,
  desc,
}: {
  year: string;
  title: string;
  desc: string;
}) {
  return (
    <div
      style={{
        border: `1px solid ${BORDER}`,
        borderRadius: 4,
        padding: "20px 24px",
        background: BG_CARD,
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: TEAL,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {year}
      </span>
      <div
        style={{
          marginTop: 8,
          fontSize: 15,
          fontWeight: 500,
        }}
      >
        {title}
      </div>
      <p
        style={{
          marginTop: 6,
          fontSize: 13,
          lineHeight: 1.7,
          color: TEXT_MUTED,
        }}
      >
        {desc}
      </p>
    </div>
  );
}
