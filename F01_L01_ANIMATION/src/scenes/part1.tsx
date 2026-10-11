import React from "react";
import { C } from "../theme";
import { ramp, span, useT } from "../lib/timeline";
import { SceneShell } from "../components/SceneShell";
import { Character } from "../components/characters/Character";
import { Bubble, Chip, Keyword, Pop, Sign } from "../components/ui";
import { Icon, KeyItem, Kite, Lantern, MagnifierItem, PhoneItem } from "../components/props";
import { GROUND, HOST_H, meta, Medallion, QuoteText } from "./common";

// S01 — « Imaginez, un client vous appelle… »
export const S01: React.FC = () => {
  const m = meta("S01-appel");
  const t = useT();
  return (
    <SceneShell
      start={m.startSec}
      enter={m.transitionIn}
      backdrop="hillside"
      camera={[[0, 1, 0, 0], [8.2, 1.12, -140, 40]]}
      world={
        <>
          <Character who="HUGO" t={t} x={1330} y={1010} h={540} pose={[{ at: 0.9, pose: "phone" }]} mood={[{ at: 0, mood: "surprised" }, { at: 2.4, mood: "smile" }, { at: 6.4, mood: "worried" }]} look={-0.5} rightItem={<PhoneItem />} />
        </>
      }
      ui={
        <>
          {/* ringing waves */}
          {span(t, 0.2, 1.6) > 0 &&
            [0, 1, 2].map((i) => (
              <div key={i} style={{ position: "absolute", left: 1400, top: 470, width: 60 + ((t * 120 + i * 40) % 120), height: 60 + ((t * 120 + i * 40) % 120), translate: "-50% -50%", borderRadius: 999, border: `5px solid ${C.gold}`, opacity: span(t, 0.2, 1.6) * (1 - ((t * 120 + i * 40) % 120) / 120) }} />
            ))}
          <Medallion who="DELMAS" t={t} x={420} y={330} r={130} at={1.0} until={8.4} label="Un client" />
          <Bubble t={t} x={930} y={300} w={760} at={3.0} until={8.4} tail="left" size={46} font="title" italic>
            <QuoteText t={t} a={3.2} b={5.9} text="« Vous êtes dans l'immobilier, occupez-vous de mon appartement. »" size={46} />
          </Bubble>
        </>
      }
    />
  );
};

// S02 — « Ah bon ? Vraiment ? » / « plein de pièges »
export const S02: React.FC = () => {
  const m = meta("S02-pieges");
  const t = useT();
  const shake = t > 14.6 && t < 15.4 ? Math.sin(t * 60) * 4 : 0;
  return (
    <SceneShell
      start={m.startSec}
      enter={m.transitionIn}
      origin={[1330, 450]}
      backdrop="office"
      camera={[[8.2, 1, 0, 0], [13.6, 1, 0, 0], [15.2, 1.14, 220, -10], [17, 1.16, 230, -10]]}
      world={
        <>
          <Character who="LEA" t={t} x={600} y={GROUND} h={HOST_H} pose={[{ at: 8, pose: "rest" }, { at: 12, pose: "explain" }, { at: 14.4, pose: "fingerUp" }]} mood={[{ at: 8, mood: "smile" }, { at: 14.6, mood: "focused" }]} look={0.6} />
          <Character who="HUGO" t={t} x={1330} y={GROUND} h={HOST_H} pose={[{ at: 8, pose: "rest" }, { at: 8.4, pose: "shrug" }, { at: 10.6, pose: "open" }, { at: 11.8, pose: "rest" }]} mood={[{ at: 8, mood: "surprised" }, { at: 10, mood: "happy" }, { at: 14.8, mood: "worried" }]} look={-0.6} />
        </>
      }
      ui={
        <>
          <div style={{ position: "absolute", left: 960, top: 210, translate: `-50% -50%`, rotate: `${shake * 0.4}deg`, opacity: span(t, 8.5, 15.3, 0.4, 0.3) }}>
            <Bubble t={t} x={0} y={0} w={820} at={8.5} until={15.4} tail="none" size={44} font="title" italic>
              « Occupez-vous de mon appartement. »
            </Bubble>
          </div>
          <Keyword t={t} at={15.3} until={17.1} x={960} y={210} text="PIÈGES" size={120} color={C.red} underline={C.amber} sub="derrière une phrase simple" />
        </>
      }
    />
  );
};

// S03 — forest path with hidden holes: legal & field stakes, responsibilities for everyone
export const S03: React.FC = () => {
  const m = meta("S03-foret");
  const t = useT();
  return (
    <SceneShell
      start={m.startSec}
      enter={m.transitionIn}
      backdrop="forest"
      camera={[[17, 1.06, 70, 0], [33.6, 1.06, -70, 0]]}
      world={
        <>
          <Character who="LEA" t={t} x={[[17, 600], [24, 720], [33.6, 760]]} walk={[[17, 24]]} y={1000} h={430} pose={[{ at: 17, pose: "explain" }, { at: 24.5, pose: "rest" }, { at: 32.6, pose: "fingerUp" }]} look={0.5} mood={[{ at: 17, mood: "focused" }, { at: 32.6, mood: "smile" }]} />
          <Character who="HUGO" t={t} x={[[17, 1120], [24, 1230], [33.6, 1240]]} walk={[[17, 24]]} y={1000} h={430} pose={[{ at: 17, pose: "rest" }, { at: 25, pose: "explain" }, { at: 29.8, pose: "open" }]} look={-0.5} mood={[{ at: 17, mood: "worried" }, { at: 26, mood: "focused" }]} />
        </>
      }
      warmth={0.04}
      ui={
        <>
          <Sign t={t} at={22.9} until={26.0} x={520} y={420} text="Légalement ?" rot={-6} size={36} w={360} post />
          <Sign t={t} at={23.7} until={26.0} x={1400} y={400} text="Sur le terrain ?" rot={5} size={36} w={380} post />
          <Keyword t={t} at={26.3} until={33.5} x={960} y={160} text="RESPONSABILITÉS" size={84} sub="risques juridiques & financiers" />
          {t > 27.5 && (
            <>
              <Lantern x={560} y={520} on={ramp(t, 29.6, 30.1)} label="Le pro" icon={<Icon kind="badge" size={70} />} />
              <Lantern x={960} y={500} on={ramp(t, 30.3, 30.8)} label="Le client" icon={<Icon kind="people" size={70} />} />
              <Lantern x={1360} y={520} on={ramp(t, 31.3, 31.8)} label="L'opération" icon={<Icon kind="house" size={70} />} />
            </>
          )}
        </>
      }
    />
  );
};

// S04 — the episode plan on two kites + the golden key
export const S04: React.FC = () => {
  const m = meta("S04-episode");
  const t = useT();
  return (
    <SceneShell
      start={m.startSec}
      enter={m.transitionIn}
      backdrop="hillside"
      camera={[[33.6, 1, 0, 40], [36, 1.04, 0, 120], [40.5, 1.02, 0, 60], [42.3, 1, 0, 30]]}
      world={
        <>
          <Character who="LEA" t={t} x={760} y={1000} h={480} pose={[{ at: 33.6, pose: "explain" }, { at: 35.4, pose: "pointUpR" }, { at: 39.4, pose: "open" }]} look={0.3} mood="happy" />
          <Character who="HUGO" t={t} x={1160} y={1000} h={480} pose={[{ at: 33.6, pose: "rest" }, { at: 38, pose: "handsHips" }]} look={-0.4} mood={[{ at: 33.6, mood: "smile" }, { at: 38.4, mood: "happy" }]} />
        </>
      }
      ui={
        <>
          {span(t, 35.6, 42.6) > 0 && (
            <div style={{ opacity: span(t, 35.6, 42.6, 0.4, 0.4), translate: `0px ${(1 - ramp(t, 35.6, 36.6)) * 300}px` }}>
              <Kite x={560} y={270} t={t} color={C.emerald} label="① Qualifier la demande" w={520} />
            </div>
          )}
          {span(t, 38.1, 42.6) > 0 && (
            <div style={{ opacity: span(t, 38.1, 42.6, 0.4, 0.4), translate: `0px ${(1 - ramp(t, 38.1, 39.1)) * 300}px` }}>
              <Kite x={1380} y={250} t={t} color={C.gold} label="② Comprendre les documents légaux" w={600} />
            </div>
          )}
          <Pop t={t} x={960} y={560} at={40.0} until={42.4} s={1.6}>
            <svg width={160} height={160} viewBox="-60 -80 120 160" style={{ overflow: "visible" }}>
              <circle cx={0} cy={-10} r={70} fill="#fff1b8" opacity={0.6} />
              <KeyItem />
            </svg>
          </Pop>
          <Chip t={t} at={40.5} until={42.4} x={960} y={720} text="Éviter des erreurs graves" color={C.navy} />
        </>
      }
    />
  );
};

// S05 — qualify the request: don't trust the words alone
export const S05: React.FC = () => {
  const m = meta("S05-qualifier");
  const t = useT();
  const hl = ramp(t, 50.4, 51.2);
  return (
    <SceneShell
      start={m.startSec}
      enter={m.transitionIn}
      backdrop="office"
      camera={[[42.3, 1, 0, 0], [48, 1, 0, 0], [50, 1.08, -40, 30], [53.4, 1.1, -50, 30]]}
      world={
        <>
          <Character who="LEA" t={t} x={600} y={GROUND} h={HOST_H} pose={[{ at: 42, pose: "rest" }, { at: 48.4, pose: "holdR" }]} look={0.5} mood={[{ at: 42, mood: "smile" }, { at: 49, mood: "focused" }]} rightItem={t > 48.6 ? <MagnifierItem /> : undefined} />
          <Character who="HUGO" t={t} x={1330} y={GROUND} h={HOST_H} pose={[{ at: 42, pose: "explain" }, { at: 46.2, pose: "think" }]} look={-0.6} mood={[{ at: 42, mood: "smile" }, { at: 46.4, mood: "focused" }]} />
        </>
      }
      ui={
        <>
          <Keyword t={t} at={44.3} until={46.7} x={960} y={220} text="QUALIFIER LA DEMANDE" size={84} />
          <Bubble t={t} x={960} y={250} w={900} at={46.6} until={53.5} tail="none" size={50} font="title" italic>
            «{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              <span style={{ position: "absolute", left: -6, right: -6, top: "55%", height: "45%", background: C.amber, opacity: 0.55, transformOrigin: "left", scale: `${hl} 1`, borderRadius: 6 }} />
              <span style={{ position: "relative" }}>Occupez</span>
            </span>
            -vous de mon appartement. »
          </Bubble>
          <Pop t={t} x={760 + ramp(t, 49.8, 51.2) * 120} y={250} at={49.8} until={53.3} s={1.4}>
            <svg width={160} height={200} viewBox="-60 -110 120 200" style={{ overflow: "visible" }}>
              <MagnifierItem />
            </svg>
          </Pop>
          <Chip t={t} at={50.6} until={53.4} x={960} y={420} text="Ne pas se fier aux mots seuls" color={C.red} />
        </>
      }
    />
  );
};

// S06 — « Occuper », a vague word: five possible missions
export const S06: React.FC = () => {
  const m = meta("S06-occuper");
  const t = useT();
  const qs: [string, number, number, number][] = [
    ["Vendre ?", 56.6, 380, 250],
    ["Trouver un locataire ?", 58.0, 960, 210],
    ["Louer de façon autonome ?", 59.5, 1500, 270],
    ["Faire gérer les loyers ?", 61.6, 700, 420],
    ["Gestion de copropriété ?", 63.6, 1270, 440],
  ];
  return (
    <SceneShell
      start={m.startSec}
      enter={m.transitionIn}
      backdrop="street"
      camera={[[53.4, 1, 0, 0], [60, 1.05, 40, 20], [68.9, 1, 0, 0]]}
      world={
        <>
          <Character who="DELMAS" t={t} x={520} y={1010} h={520} pose={[{ at: 53, pose: "rest" }, { at: 54.6, pose: "think" }, { at: 63, pose: "shrug" }]} mood={[{ at: 53, mood: "worried" }, { at: 64, mood: "surprised" }]} look={0.5} />
          <Character who="LEA" t={t} x={1080} y={1010} h={540} pose={[{ at: 53, pose: "explain" }, { at: 56.4, pose: "pointUpR" }, { at: 61.4, pose: "pointUpL" }, { at: 65.6, pose: "open" }]} look={-0.4} mood="smile" />
        </>
      }
      ui={
        <>
          <Keyword t={t} at={53.6} until={56.4} x={960} y={220} text="OCCUPER ?" size={130} color={C.navy} sub="un mot très vague" />
          {qs.map(([q, at, x, y]) => (
            <Bubble key={q} t={t} at={at} until={66.2} x={x} y={y} w={Math.max(300, q.length * 22)} size={38} tail="down">
              {q}
            </Bubble>
          ))}
          <Keyword t={t} at={66.3} until={69.0} x={960} y={260} text="DIFFÉRENCIER" size={100} color={C.emerald} underline={C.gold} sub="chaque activité est distincte" />
        </>
      }
    />
  );
};

// S07 — five great activities: five paths in the valley
export const S07: React.FC = () => {
  const m = meta("S07-activites");
  const t = useT();
  const signs: [string, number, number, number, number][] = [
    ["La vente", 72.5, 330, 650, 260],
    ["Recherche d'acquéreurs ou de locataires", 73.3, 640, 545, 330],
    ["Location autonome", 75.3, 1000, 495, 300],
    ["Gestion immobilière", 76.8, 1350, 555, 300],
    ["Syndic de copropriété", 78.2, 1650, 665, 300],
  ];
  return (
    <SceneShell
      start={m.startSec}
      enter={m.transitionIn}
      backdrop="valley"
      camera={[[68.9, 1.15, 0, 60], [72, 1.02, 0, 10], [80.3, 1, 0, 0]]}
      world={
        <>
          <Character who="LEA" t={t} x={860} y={1040} h={300} pose={[{ at: 68.9, pose: "explain" }, { at: 72.4, pose: "pointL" }, { at: 76.6, pose: "pointR" }]} look={0} mood="smile" />
          <Character who="HUGO" t={t} x={1070} y={1040} h={310} pose="rest" look={[[72, -0.8], [76.5, 0.8]]} mood="happy" />
        </>
      }
      ui={
        <>
          <Keyword t={t} at={69.6} until={72.3} x={960} y={160} text="5 GRANDES ACTIVITÉS" size={88} />
          {signs.map(([label, at, x, y, w], i) => (
            <Sign key={label} t={t} at={at} x={x} y={y} text={label} w={w} size={label.length > 25 ? 22 : 27} rot={(i % 2 ? 3 : -3)} color={["#f6e2b8", "#e9f1c9", "#f3e3c2", "#dcefd9", "#efe0f3"][i]} />
          ))}
        </>
      }
    />
  );
};

