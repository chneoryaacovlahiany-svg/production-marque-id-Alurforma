import React from "react";
import { interpolate } from "remotion";
import { C, ease, fonts, shadow } from "../theme";
import { pop, ramp, span } from "../lib/timeline";

// Storybook UI kit: every element animates from lesson time t, with explicit in/out times.

type Pos = { x: number; y: number };

/** Big kinetic keyword on a torn-paper ribbon, letters rising one by one, brush underline. */
export const Keyword: React.FC<
  Pos & { t: number; at: number; until: number; text: string; size?: number; color?: string; ribbon?: string; rotate?: number; sub?: string; underline?: string; maxWidth?: number }
> = ({ t, at, until, text, x, y, size = 92, color = C.navy, ribbon = C.paper, rotate = -2, sub, underline = C.emerald, maxWidth = 1500 }) => {
  const vis = span(t, at, until, 0.35, 0.35);
  if (vis <= 0) return null;
  const out = ramp(t, until - 0.35, until, ease.in);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: "-50% -50%",
        rotate: `${rotate}deg`,
        scale: String(interpolate(pop(t, at, 0.5), [0, 1], [0.7, 1]) - out * 0.08),
        opacity: vis,
        maxWidth,
        textAlign: "center",
      }}
    >
      <div
        style={{
          background: ribbon,
          padding: `${size * 0.22}px ${size * 0.5}px ${size * 0.28}px`,
          borderRadius: 18,
          boxShadow: shadow,
          clipPath: "polygon(0% 6%, 3% 0%, 22% 4%, 48% 0%, 74% 5%, 97% 0%, 100% 8%, 98% 50%, 100% 92%, 96% 100%, 70% 96%, 45% 100%, 20% 95%, 2% 100%, 0% 90%, 2% 50%)",
        }}
      >
        <div style={{ fontFamily: fonts.title, fontWeight: 800, fontSize: size, lineHeight: 1.05, color, letterSpacing: 1 }}>
          {(() => {
            let idx = 0;
            return text.split(" ").map((word, wi) => (
              <React.Fragment key={wi}>
                {wi > 0 && " "}
                <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
                  {Array.from(word).map((ch) => {
                    const i = idx++;
                    const k = ramp(t, at + 0.05 + i * 0.025, at + 0.45 + i * 0.025, ease.back);
                    return (
                      <span key={i} style={{ display: "inline-block", translate: `0px ${(1 - k) * size * 0.4}px`, opacity: Math.min(1, k * 1.5) }}>
                        {ch}
                      </span>
                    );
                  })}
                </span>
              </React.Fragment>
            ));
          })()}
        </div>
        <svg width="100%" height={size * 0.22} viewBox="0 0 100 10" preserveAspectRatio="none" style={{ display: "block", marginTop: 4 }}>
          <path
            d="M 2 6 C 25 2 50 9 75 4 S 95 6 98 5"
            fill="none"
            stroke={underline}
            strokeWidth={3.2}
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={100}
            strokeDashoffset={100 - ramp(t, at + 0.35, at + 0.9) * 100}
          />
        </svg>
        {sub && (
          <div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: size * 0.34, color: C.inkSoft, marginTop: 6, opacity: ramp(t, at + 0.6, at + 1) }}>{sub}</div>
        )}
      </div>
    </div>
  );
};

/** Speech / thought bubble. */
export const Bubble: React.FC<
  Pos & { t: number; at: number; until: number; children: React.ReactNode; w?: number; tail?: "left" | "right" | "down" | "none"; size?: number; bg?: string; color?: string; font?: "title" | "body"; italic?: boolean }
> = ({ t, at, until, x, y, children, w = 560, tail = "down", size = 40, bg = "#fffdf6", color = C.ink, font = "body", italic }) => {
  const vis = span(t, at, until, 0.3, 0.3);
  if (vis <= 0) return null;
  const s = interpolate(pop(t, at, 0.45), [0, 1], [0.4, 1]);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, translate: "-50% -50%", scale: String(s), opacity: vis }}>
      <div
        style={{
          position: "relative",
          background: bg,
          border: `4px solid ${C.ink}`,
          borderRadius: 40,
          padding: "22px 30px",
          fontFamily: font === "title" ? fonts.title : fonts.body,
          fontWeight: font === "title" ? 600 : 700,
          fontStyle: italic ? "italic" : undefined,
          fontSize: size,
          lineHeight: 1.2,
          color,
          textAlign: "center",
          boxShadow: shadow,
        }}
      >
        {children}
        {tail !== "none" && (
          <svg
            width={60}
            height={50}
            viewBox="0 0 60 50"
            style={{
              position: "absolute",
              ...(tail === "down" ? { left: "50%", bottom: -44, translate: "-50% 0" } : tail === "left" ? { left: 30, bottom: -44 } : { right: 30, bottom: -44 }),
              scale: tail === "right" ? "-1 1" : undefined,
            }}
          >
            <path d="M 4 0 L 20 46 L 44 0" fill={bg} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
            <rect x={0} y={-6} width={52} height={10} fill={bg} />
          </svg>
        )}
      </div>
    </div>
  );
};

/** Wooden sign board on a post. */
export const Sign: React.FC<Pos & { t: number; at: number; until?: number; text: string; w?: number; size?: number; rot?: number; color?: string; post?: boolean }> = ({
  t,
  at,
  until = 1e9,
  x,
  y,
  text,
  w = 320,
  size = 30,
  rot = 0,
  color = "#f6e2b8",
  post = false,
}) => {
  const k = pop(t, at, 0.5);
  const vis = span(t, at, until, 0.25, 0.4);
  if (vis <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", rotate: `${rot + (1 - k) * -25}deg`, scale: String(Math.max(0, k)), opacity: vis, transformOrigin: "50% 100%" }}>
      {post && <div style={{ position: "absolute", left: "50%", top: "50%", width: 16, height: 140, translate: "-50% 0", background: "#7a5236", border: `3px solid ${C.ink}`, borderRadius: 4 }} />}
      <div
        style={{
          position: "relative",
          width: w,
          padding: "14px 18px",
          background: `linear-gradient(180deg, ${color}, #e3c48e)`,
          border: `4px solid ${C.ink}`,
          borderRadius: 14,
          fontFamily: fonts.body,
          fontWeight: 800,
          fontSize: size,
          color: "#4a2f1d",
          textAlign: "center",
          lineHeight: 1.1,
          boxShadow: "0 8px 16px rgba(40,25,10,0.25)",
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** Rounded label pill. */
export const Chip: React.FC<Pos & { t: number; at: number; until?: number; text: string; on?: number; color?: string; size?: number; icon?: React.ReactNode; dim?: number }> = ({
  t,
  at,
  until = 1e9,
  x,
  y,
  text,
  color = C.emerald,
  size = 34,
  icon,
  dim = 0,
}) => {
  const vis = span(t, at, until, 0.25, 0.3);
  if (vis <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: "-50% -50%",
        scale: String(interpolate(pop(t, at, 0.4), [0, 1], [0.3, 1])),
        opacity: vis * (1 - dim * 0.55),
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: `${size * 0.3}px ${size * 0.7}px`,
        borderRadius: 999,
        background: dim > 0.5 ? "#d9d2c4" : color,
        color: "#fff",
        fontFamily: fonts.body,
        fontWeight: 800,
        fontSize: size,
        whiteSpace: "nowrap",
        border: `3px solid ${C.ink}`,
        boxShadow: "0 6px 14px rgba(40,25,10,0.25)",
        filter: dim > 0.5 ? "grayscale(1)" : undefined,
      }}
    >
      {icon}
      {text}
    </div>
  );
};

/** Hand-drawn check / cross / question mark, drawn on with a pen stroke. */
export const Mark: React.FC<{ t: number; at: number; kind: "check" | "cross" | "question"; size?: number; color?: string }> = ({ t, at, kind, size = 46, color }) => {
  const k = ramp(t, at, at + 0.35);
  const col = color ?? (kind === "check" ? C.emerald : kind === "cross" ? C.red : C.amber);
  if (kind === "question")
    return (
      <span style={{ display: "inline-block", width: size, height: size, borderRadius: 999, background: col, color: "#fff", fontFamily: fonts.title, fontWeight: 800, fontSize: size * 0.75, lineHeight: `${size}px`, textAlign: "center", scale: String(pop(t, at, 0.4)), border: `3px solid ${C.ink}` }}>
        ?
      </span>
    );
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" style={{ display: "inline-block", verticalAlign: "middle", overflow: "visible" }}>
      <rect x={3} y={3} width={44} height={44} rx={10} fill="#fffdf6" stroke={C.ink} strokeWidth={3.5} />
      <path
        d={kind === "check" ? "M 11 26 L 21 37 L 41 10" : "M 13 13 L 37 37 M 37 13 L 13 37"}
        fill="none"
        stroke={col}
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={100}
        strokeDasharray={100}
        strokeDashoffset={100 - k * 100}
      />
    </svg>
  );
};

/** One line of a checklist. */
export const CheckLine: React.FC<{ t: number; at: number; text: string; kind?: "check" | "cross" | "question"; size?: number; until?: number; strike?: boolean }> = ({
  t,
  at,
  text,
  kind = "check",
  size = 40,
  until = 1e9,
  strike,
}) => {
  const vis = span(t, at - 0.2, until, 0.3, 0.3);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: vis, translate: `${(1 - ramp(t, at - 0.2, at + 0.2)) * -30}px 0px`, margin: "10px 0" }}>
      <Mark t={t} at={at} kind={kind} size={size * 1.15} />
      <span style={{ fontFamily: fonts.body, fontWeight: 800, fontSize: size, color: C.ink, position: "relative" }}>
        {text}
        {strike && <span style={{ position: "absolute", left: 0, top: "55%", height: 5, width: `${ramp(t, at + 0.2, at + 0.6) * 100}%`, background: C.red, borderRadius: 4 }} />}
      </span>
    </div>
  );
};

/** Cream paper card with a title band. */
export const PaperCard: React.FC<Pos & { t: number; at: number; until?: number; w: number; title?: string; band?: string; children?: React.ReactNode; rot?: number; from?: "bottom" | "right" | "left" | "top" | "pop"; pad?: number }> = ({
  t,
  at,
  until = 1e9,
  x,
  y,
  w,
  title,
  band = C.navy,
  children,
  rot = 0,
  from = "bottom",
  pad = 30,
}) => {
  const k = ramp(t, at, at + 0.6);
  const vis = span(t, at, until, 0.2, 0.4);
  if (vis <= 0) return null;
  const off = (1 - k) * 700;
  const tr = from === "bottom" ? `0px ${off}px` : from === "top" ? `0px ${-off}px` : from === "right" ? `${off * 1.6}px 0px` : from === "left" ? `${-off * 1.6}px 0px` : "0px 0px";
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        translate: `calc(-50% + ${tr.split(" ")[0]}) calc(-50% + ${tr.split(" ")[1]})`,
        rotate: `${rot + (1 - k) * (from === "pop" ? 0 : 8)}deg`,
        scale: from === "pop" ? String(interpolate(pop(t, at, 0.5), [0, 1], [0.3, 1])) : undefined,
        opacity: vis,
        background: C.paper,
        borderRadius: 22,
        border: `4px solid ${C.ink}`,
        boxShadow: shadow,
        overflow: "hidden",
      }}
    >
      {title && (
        <div style={{ background: band, color: "#fff", fontFamily: fonts.body, fontWeight: 800, fontSize: 34, letterSpacing: 2, padding: "14px 26px", textTransform: "uppercase" }}>{title}</div>
      )}
      <div style={{ padding: pad }}>{children}</div>
    </div>
  );
};

/** Rubber stamp slamming onto the page. */
export const Stamp: React.FC<Pos & { t: number; at: number; until?: number; text: string; color?: string; size?: number; rot?: number }> = ({ t, at, until = 1e9, x, y, text, color = C.red, size = 56, rot = -10 }) => {
  const k = ramp(t, at, at + 0.22, ease.in);
  const vis = span(t, at, until, 0.05, 0.3);
  if (vis <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: "-50% -50%",
        rotate: `${rot}deg`,
        scale: String(interpolate(k, [0, 1], [2.4, 1])),
        opacity: vis * Math.min(1, k * 2) * 0.92,
        border: `7px solid ${color}`,
        borderRadius: 14,
        padding: "8px 26px",
        color,
        fontFamily: fonts.title,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: 3,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        mixBlendMode: "multiply",
      }}
    >
      {text}
    </div>
  );
};

/** Absolutely positioned wrapper with a pop-in. */
export const Pop: React.FC<Partial<Pos> & { t: number; at: number; until?: number; children: React.ReactNode; s?: number; rot?: number; inline?: boolean }> = ({
  t,
  at,
  until = 1e9,
  x = 0,
  y = 0,
  children,
  s = 1,
  rot = 0,
  inline,
}) => {
  const vis = span(t, at, until, 0.25, 0.35);
  if (vis <= 0) return inline ? <div style={{ visibility: "hidden" }}>{children}</div> : null;
  const place: React.CSSProperties = inline ? { position: "relative" } : { position: "absolute", left: x, top: y, translate: "-50% -50%" };
  return (
    <div style={{ ...place, scale: String(s * interpolate(pop(t, at, 0.5), [0, 1], [0.2, 1])), rotate: `${rot}deg`, opacity: vis }}>
      {children}
    </div>
  );
};

/** Small caption-style title used inside cards. */
export const Label: React.FC<{ children: React.ReactNode; size?: number; color?: string; weight?: number; serif?: boolean; style?: React.CSSProperties }> = ({ children, size = 36, color = C.ink, weight = 800, serif, style }) => (
  <div style={{ fontFamily: serif ? fonts.title : fonts.body, fontWeight: weight, fontSize: size, color, lineHeight: 1.15, ...style }}>{children}</div>
);
