import React from "react";
import { interpolate } from "remotion";
import { C, fonts, shadow } from "../theme";
import { pop, ramp, span, useT } from "../lib/timeline";
import { SceneShell } from "../components/SceneShell";
import { Character } from "../components/characters/Character";
import { CardItem, Icon, KeyItem, PaperItem, Truck } from "../components/props";
import { Bubble, CheckLine, Chip, Keyword, Label, Mark, PaperCard, Pop, Sign, Stamp } from "../components/ui";
import { GROUND, HOST_H, meta, Medallion } from "./common";

// S08 — Example A vs B: same words, different missions
export const S08: React.FC = () => {
  const m = meta("S08-exemple");
  const t = useT();
  const close = ramp(t, 93.4, 94.4);
  const coins = Array.from({ length: 12 }, (_, i) => i);
  return (
    <SceneShell
      start={m.startSec}
      enter={m.transitionIn}
      backdrop="office"
      world={
        <>
          <Character who="LEA" t={t} x={600} y={GROUND} h={HOST_H} pose={[{ at: 80, pose: "rest" }, { at: 82.9, pose: "explain" }, { at: 93.6, pose: "fingerUp" }]} look={0.6} mood="smile" />
          <Character who="HUGO" t={t} x={1330} y={GROUND} h={HOST_H} pose={[{ at: 80, pose: "explain" }, { at: 83, pose: "think" }]} look={-0.6} mood={[{ at: 80, mood: "smile" }, { at: 84, mood: "focused" }]} />
        </>
      }
      ui={
        <>
          <PaperCard t={t} at={84.5} until={95.0} from="left" x={interpolate(close, [0, 1], [500, 800])} y={430} w={820} title="Demande A" band={C.emerald}>
            <Label serif size={42} color={C.navy} style={{ fontStyle: "italic", textAlign: "center" }}>
              « Trouvez-moi un locataire, je gérerai ensuite. »
            </Label>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 30, marginTop: 26 }}>
              <Pop t={t} at={85.6} inline>
                <Icon kind="house" size={120} />
              </Pop>
              <div style={{ width: 120 }} />
              <div style={{ position: "relative", width: 120, height: 120 }}>
                <div style={{ position: "absolute", left: interpolate(ramp(t, 86.4, 87.6), [0, 1], [-170, 0]), top: 0 }}>
                  <svg width={120} height={120} viewBox="-60 -70 120 120" style={{ overflow: "visible" }}>
                    <KeyItem />
                  </svg>
                </div>
              </div>
              <Pop t={t} at={87.4} inline>
                <Icon kind="people" size={120} />
              </Pop>
            </div>
            <div style={{ textAlign: "center", marginTop: 10, opacity: ramp(t, 87.8, 88.2) }}>
              <Label size={30} color={C.inkSoft}>Mission : trouver un locataire</Label>
            </div>
          </PaperCard>
          <PaperCard t={t} at={88.8} until={95.0} from="right" x={interpolate(close, [0, 1], [1420, 1120])} y={430} w={820} title="Demande B" band={C.navy}>
            <Label serif size={42} color={C.navy} style={{ fontStyle: "italic", textAlign: "center" }}>
              « Louez-le et faites la gestion complète des loyers. »
            </Label>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 24, marginTop: 20 }}>
              <Pop t={t} at={89.8} inline>
                <Icon kind="ledger" size={130} />
              </Pop>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 44px)", gap: 8 }}>
                {coins.map((i) => (
                  <div key={i} style={{ scale: String(pop(t, 90.4 + i * 0.12, 0.3)), opacity: ramp(t, 90.4 + i * 0.12, 90.6 + i * 0.12) }}>
                    <Icon kind="coin" size={44} />
                  </div>
                ))}
              </div>
            </div>
            <div style={{ textAlign: "center", marginTop: 10, opacity: ramp(t, 91.4, 91.8) }}>
              <Label size={30} color={C.inkSoft}>Mission : louer + gérer les loyers chaque mois</Label>
            </div>
          </PaperCard>
          <Stamp t={t} at={93.8} until={95.0} x={960} y={430} text="≠" size={150} color={C.red} rot={0} />
          <Keyword t={t} at={94.9} until={97.9} x={960} y={300} text="MISSION DIFFÉRENTE" size={92} sub="= documents et autorisations différents" />
        </>
      }
    />
  );
};

// S09 — ask the right questions; a commercial name changes nothing; what act / for whom / which context
export const S09: React.FC = () => {
  const m = meta("S09-questions");
  const t = useT();
  const signDrop = ramp(t, 104.4, 105.3);
  return (
    <SceneShell
      start={m.startSec}
      enter={m.transitionIn}
      origin={[600, 450]}
      backdrop="office"
      camera={[[97.8, 1.05, -60, 20], [103.5, 1, 0, 0], [110, 1, 0, 0], [118.1, 1.06, 0, 20]]}
      world={
        <>
          <Character who="LEA" t={t} x={600} y={GROUND} h={HOST_H} pose={[{ at: 97, pose: "rest" }, { at: 103.8, pose: "explain" }, { at: 107.2, pose: "pointUpR" }, { at: 110, pose: "rest" }, { at: 116.2, pose: "open" }]} look={0.6} mood={[{ at: 97, mood: "smile" }, { at: 116.2, mood: "happy" }]} />
          <Character who="HUGO" t={t} x={1330} y={GROUND} h={HOST_H} pose={[{ at: 97, pose: "explain" }, { at: 103, pose: "rest" }, { at: 110.2, pose: "fingerUp" }, { at: 116.3, pose: "cheer" }]} look={-0.6} mood={[{ at: 97, mood: "focused" }, { at: 116.3, mood: "happy" }]} />
        </>
      }
      ui={
        <>
          {[0, 1, 2, 3].map((i) => (
            <Pop key={i} t={t} at={98.6 + i * 0.7} until={103.4} x={1150 + i * 120} y={250 + (i % 2) * 70} rot={(i % 2 ? 12 : -10)}>
              <Mark t={t} at={98.6 + i * 0.7} kind="question" size={80} />
            </Pop>
          ))}
          <Chip t={t} at={100.6} until={103.4} x={760} y={300} text="Pas juste reprendre ses mots" color={C.navy} />
          {span(t, 104.3, 110.0) > 0 && (
            <div style={{ position: "absolute", left: 960, top: interpolate(signDrop, [0, 1], [-200, 250]), translate: "-50% -50%", rotate: `${Math.sin(t * 3) * 2 * (1 - ramp(t, 105, 107))}deg`, opacity: span(t, 104.3, 110.0, 0.2, 0.4) }}>
              <div style={{ position: "absolute", left: 120, top: -400, width: 4, height: 330, background: C.ink }} />
              <div style={{ position: "absolute", right: 120, top: -400, width: 4, height: 330, background: C.ink }} />
              <Sign t={t} at={104.3} x={0} y={0} text="Accompagnateur immobilier" w={720} size={44} color="#f3e3c2" />
            </div>
          )}
          <Stamp t={t} at={107.4} until={110.0} x={960} y={360} text="Mêmes actes · même cadre légal" size={46} color={C.emerald} rot={-6} />
          <Chip t={t} at={112.2} until={118.4} x={560} y={260} text="Quel acte ?" color={C.emerald} size={44} />
          <Chip t={t} at={113.6} until={118.4} x={960} y={220} text="Pour qui ?" color={C.navy} size={44} />
          <Chip t={t} at={114.6} until={118.4} x={1360} y={260} text="Quel contexte ?" color={C.gold} size={44} />
          <Pop t={t} x={960} y={370} at={116.3} until={118.4}>
            <Label serif size={54} color={C.navy} style={{ background: C.paper, padding: "8px 26px", borderRadius: 16, boxShadow: shadow }}>
              = qualifier la demande
            </Label>
          </Pop>
        </>
      }
    />
  );
};

// S10 — three key documents on the desk
export const S10: React.FC = () => {
  const m = meta("S10-documents");
  const t = useT();
  const doc = (title: string, at: number, x: number, rot: number, band: string, icon: React.ReactNode) => (
    <PaperCard t={t} at={at} x={x} y={500} w={400} title={title} band={band} rot={rot} from="top" pad={26}>
      <div style={{ display: "flex", justifyContent: "center" }}>{icon}</div>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ height: 10, borderRadius: 5, background: "#d8cfbf", margin: "14px 10px 0", width: `${80 - i * 15}%` }} />
      ))}
    </PaperCard>
  );
  const thread = ramp(t, 126.4, 127.6);
  return (
    <SceneShell
      start={m.startSec}
      enter={m.transitionIn}
      backdrop="desk"
      camera={[[118.1, 1.0, 0, 0], [128.6, 1.06, 0, 0]]}
      world={null}
      ui={
        <>
          <Keyword t={t} at={118.6} until={120.6} x={960} y={160} text="3 DOCUMENTS CLÉS" size={88} />
          {doc("Carte professionnelle", 120.9, 500, -5, C.navy, <Icon kind="badge" size={130} color={C.navy} />)}
          {doc("Attestation d'habilitation", 122.6, 960, 2, C.emerald, <Icon kind="people" size={130} />)}
          {doc("Mandat écrit", 123.4, 1420, -3, C.gold, <Icon kind="signature" size={130} />)}
          <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <path d="M 620 340 C 760 250 840 250 900 330 M 1020 330 C 1080 250 1180 250 1300 340" fill="none" stroke={C.gold} strokeWidth={8} strokeLinecap="round" pathLength={100} strokeDasharray={100} strokeDashoffset={100 - thread * 100} />
          </svg>
          <Chip t={t} at={126.8} x={960} y={790} text="Distincts & complémentaires" color={C.navy} size={40} />
          <Medallion who="LEA" t={t} x={170} y={830} r={100} at={118.2} />
          <Medallion who="HUGO" t={t} x={1750} y={830} r={100} at={118.4} />
        </>
      }
    />
  );
};

// S11 — the professional card: what it certifies, which activities
export const S11: React.FC = () => {
  const m = meta("S11-carte");
  const t = useT();
  const restrict = ramp(t, 160.0, 160.8);
  const acts: [string, number, number][] = [
    ["Transaction", 152.8, 0],
    ["Gestion", 153.7, 1],
    ["Syndic", 154.3, 1],
  ];
  return (
    <SceneShell
      start={m.startSec}
      enter={m.transitionIn}
      backdrop="office"
      camera={[[128.6, 1.0, 0, 0], [163.3, 1.03, 0, 0]]}
      world={
        <>
          <Character who="LEA" t={t} x={250} y={GROUND} h={HOST_H} pose={[{ at: 128, pose: "rest" }, { at: 137.4, pose: "explain" }, { at: 150, pose: "pointR" }, { at: 155, pose: "rest" }]} look={0.7} mood="smile" />
          <Character who="HUGO" t={t} x={1680} y={GROUND} h={HOST_H} pose={[{ at: 128, pose: "holdR" }, { at: 136, pose: "rest" }, { at: 155.6, pose: "explain" }, { at: 159.8, pose: "fingerUp" }]} look={-0.7} mood={[{ at: 128, mood: "smile" }, { at: 159.8, mood: "focused" }]} rightItem={t < 136 ? <CardItem /> : undefined} />
        </>
      }
      ui={
        <>
          <PaperCard t={t} at={129.2} until={163.4} from="pop" x={960} y={455} w={1060} title="Carte professionnelle" band={C.navy} pad={28}>
            <div style={{ display: "flex", gap: 34 }}>
              <div style={{ width: 230, flexShrink: 0 }}>
                <div style={{ width: 210, height: 250, borderRadius: 16, border: `4px solid ${C.ink}`, background: "linear-gradient(180deg,#e8f0f6,#cddbe8)", display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden" }}>
                  <svg width={170} height={200} viewBox="-60 -70 120 140">
                    <circle cx={0} cy={-18} r={30} fill={C.stone} stroke={C.ink} strokeWidth={3} />
                    <path d="M -54 70 C -54 20 54 20 54 70 Z" fill={C.navy} stroke={C.ink} strokeWidth={3} />
                  </svg>
                </div>
                <div style={{ position: "relative", height: 60, marginTop: 8 }}>
                  <Chip t={t} at={130.6} x={105} y={30} text="≈ carte d'identité du pro" color={C.emerald} size={22} />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <CheckLine t={t} at={138.6} text="Qualifications (diplômes ou expérience)" size={34} />
                <CheckLine t={t} at={142.6} text="Assurance RCP" size={34} />
                <CheckLine t={t} at={146.5} text="Garantie financière (si gestion de fonds)" size={34} />
                <div style={{ marginTop: 16, opacity: ramp(t, 150.0, 150.5) }}>
                  <Label size={30} color={C.inkSoft}>Activités autorisées :</Label>
                  <div style={{ position: "relative", height: 80 }}>
                    {acts.map(([a, at, lock], i) => (
                      <React.Fragment key={a}>
                        <Chip t={t} at={at} x={110 + i * 230} y={44} text={a} color={[C.emerald, C.navy, C.gold][i]} size={30} dim={lock ? restrict : 0} />
                        {lock === 1 && restrict > 0.5 && (
                          <div style={{ position: "absolute", left: 110 + i * 230 + 70, top: 4, scale: String(pop(t, 160.3 + i * 0.2)) }}>
                            <Icon kind="lock" size={52} />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </PaperCard>
          <Chip t={t} at={156.6} until={159.9} x={960} y={860} text="Plusieurs mentions possibles sur une seule carte" color={C.navy} size={36} />
          <Keyword t={t} at={160.2} until={163.4} x={960} y={860} text="1 MENTION ≠ TOUTES LES ACTIVITÉS" size={58} color={C.red} underline={C.amber} />
        </>
      }
    />
  );
};

// S12 — the habilitation certificate (Inès, collaborator)
export const S12: React.FC = () => {
  const m = meta("S12-habilitation");
  const t = useT();
  return (
    <SceneShell
      start={m.startSec}
      enter={m.transitionIn}
      backdrop="office"
      world={
        <>
          <Character who="LEA" t={t} x={260} y={GROUND} h={HOST_H} pose={[{ at: 163, pose: "explain" }, { at: 167.4, pose: "pointR" }, { at: 172, pose: "explain" }, { at: 183, pose: "rest" }]} look={0.7} mood="smile" />
          <Character who="INES" t={t} x={[[163.6, 2150], [166.6, 1660]]} walk={[[163.6, 166.6]]} y={GROUND} h={HOST_H} pose={[{ at: 166.8, pose: "wave" }, { at: 168.6, pose: "rest" }, { at: 178.4, pose: "explain" }, { at: 180.6, pose: "shrug" }, { at: 183.4, pose: "rest" }]} look={-0.6} mood={[{ at: 163, mood: "smile" }, { at: 180.6, mood: "worried" }, { at: 186.8, mood: "happy" }]} />
        </>
      }
      ui={
        <>
          <Keyword t={t} at={164.4} until={167.1} x={960} y={200} text="ATTESTATION D'HABILITATION" size={74} />
          <PaperCard t={t} at={167.2} until={177.0} x={940} y={470} w={900} title="Attestation d'habilitation" band={C.emerald}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, opacity: ramp(t, 167.4, 168) }}>
              <Icon kind="badge" size={90} />
              <Label size={34}>Salarié ou collaborateur qui agit pour le titulaire de la carte</Label>
            </div>
            <div style={{ height: 3, background: C.gold, margin: "16px 0" }} />
            <CheckLine t={t} at={172.6} text="Qui il est" size={38} />
            <CheckLine t={t} at={173.8} text="Pour qui il agit" size={38} />
            <CheckLine t={t} at={175.4} text="Jusqu'où vont ses pouvoirs" size={38} />
          </PaperCard>
          <PaperCard t={t} at={177.0} until={189.1} x={940} y={470} w={900} title="Exemple de pouvoirs" band={C.navy} from="right">
            <CheckLine t={t} at={178.6} text="Faire des visites" size={38} />
            <CheckLine t={t} at={179.6} text="Négocier" size={38} />
            <CheckLine t={t} at={180.8} kind="question" text="Accepter une offre : pas forcément" size={38} />
            <CheckLine t={t} at={181.6} kind="question" text="Recevoir un acompte : pas forcément" size={38} />
          </PaperCard>
          <Chip t={t} at={185.0} until={189.1} x={940} y={790} text="Le collaborateur n'invente pas ses pouvoirs" color={C.red} size={36} />
          <Stamp t={t} at={187.2} until={189.1} x={1180} y={360} text="Formalisé" size={64} color={C.emerald} rot={-12} />
        </>
      }
    />
  );
};

// S13 — the written mandate, in M. Delmas's garden
export const S13: React.FC = () => {
  const m = meta("S13-mandat");
  const t = useT();
  const handed = t > 194.6;
  const blow = ramp(t, 201.0, 202.4);
  return (
    <SceneShell
      start={m.startSec}
      enter={m.transitionIn}
      backdrop="garden"
      camera={[[189, 1, 0, 0], [196, 1.06, -40, 10], [202.5, 1.02, 0, 0]]}
      world={
        <>
          <Character who="DELMAS" t={t} x={760} y={1010} h={520} pose={[{ at: 189, pose: "rest" }, { at: 192.4, pose: "offerR" }, { at: 194.8, pose: "rest" }, { at: 200.2, pose: "shrug" }]} look={0.6} mood={[{ at: 189, mood: "smile" }, { at: 200.2, mood: "surprised" }]} rightItem={!handed && t > 192.4 ? <PaperItem sealed /> : undefined} />
          <Character who="HUGO" t={t} x={1180} y={1010} h={560} pose={[{ at: 189, pose: "rest" }, { at: 194.2, pose: "holdR" }]} look={-0.6} mood="happy" rightItem={handed ? <PaperItem sealed /> : undefined} />
        </>
      }
      ui={
        <>
          <Keyword t={t} at={189.6} until={192.2} x={960} y={190} text="MANDAT ÉCRIT" size={100} />
          <Chip t={t} at={192.5} until={195.6} x={960} y={200} text="La mission que le client confie au professionnel" color={C.navy} size={38} />
          <Pop t={t} at={195.9} until={199.8} x={1520} y={360} s={2.2}>
            <Icon kind="signature" size={120} />
          </Pop>
          <Stamp t={t} at={197.0} until={199.8} x={1520} y={520} text="Mandat signé" size={52} color={C.emerald} rot={-8} />
          <Chip t={t} at={197.6} until={199.8} x={760} y={230} text="Sinon : ni négociation ni engagement" color={C.red} size={36} />
          {span(t, 200.2, 202.6) > 0 && (
            <div style={{ position: "absolute", left: 0, top: 0, translate: `${blow * 900}px ${-blow * 200}px`, rotate: `${blow * 40}deg`, opacity: span(t, 200.2, 202.6, 0.25, 0.6) }}>
              <Bubble t={t} at={200.2} until={203} x={640} y={330} w={420} size={40}>
                « Accord oral »
              </Bubble>
              <div style={{ position: "absolute", left: 790, top: 250 }}>
                <Mark t={t} at={200.8} kind="cross" size={80} />
              </div>
            </div>
          )}
          <Keyword t={t} at={201.3} until={202.6} x={960} y={190} text="JAMAIS SUFFISANT" size={72} color={C.red} underline={C.amber} />
        </>
      }
    />
  );
};

// S14 — the three keys of the truck
export const S14: React.FC = () => {
  const m = meta("S14-camion");
  const t = useT();
  const keys: [string, number, string][] = [
    ["Carte", 204.3, C.navy],
    ["Habilitation", 204.9, C.emerald],
    ["Mandat", 205.9, C.gold],
  ];
  const sputter = t > 210 && t < 211.4;
  const running = t > 213.6;
  const rumble = sputter ? Math.sin(t * 70) * 5 : running ? Math.sin(t * 50) * 1.6 : 0;
  const missing = t > 209.4 && t < 213.3; // the mandate key is missing during the failed start
  return (
    <SceneShell
      start={m.startSec}
      enter={m.transitionIn}
      backdrop="truck"
      camera={[[202.5, 1, 0, 0], [207.4, 1, 0, 0], [209.0, 1.12, 160, 40], [213, 1.12, 160, 40], [216, 1.02, 40, 10]]}
      world={
        <>
          <Truck x={720} y={985} s={0.95} rumble={rumble} lights={running ? ramp(t, 213.6, 214.2) : 0} puff={sputter ? (t - 210) / 1.4 : running ? ((t - 213.6) % 1.2) / 1.2 : 0} />
          <Character who="HUGO" t={t} x={1340} y={1000} h={540} pose={[{ at: 202.5, pose: "explain" }, { at: 207.4, pose: "holdR" }, { at: 209.4, pose: "offerL" }, { at: 211.6, pose: "shrug" }, { at: 213.4, pose: "cheer" }]} look={-0.5} mood={[{ at: 202.5, mood: "smile" }, { at: 210.2, mood: "worried" }, { at: 213.6, mood: "happy" }]} rightItem={t > 207.4 && t < 209.4 ? <KeyItem /> : undefined} />
          <Character who="LEA" t={t} x={1640} y={1000} h={520} pose={[{ at: 202.5, pose: "rest" }, { at: 211.9, pose: "explain" }, { at: 213.6, pose: "open" }]} look={-0.6} mood={[{ at: 202.5, mood: "smile" }, { at: 213.6, mood: "happy" }]} />
        </>
      }
      ui={
        <>
          <Keyword t={t} at={203.0} until={204.2} x={960} y={170} text="TRIPLE VÉRIFICATION" size={80} />
          {keys.map(([label, at, col], i) => {
            const isMissing = missing && i === 2;
            return (
              <Pop key={label} t={t} at={at} until={216.2} x={620 + i * 340} y={200}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: isMissing ? 0.25 : 1, filter: isMissing ? "grayscale(1)" : undefined }}>
                  <svg width={90} height={110} viewBox="-50 -70 100 120" style={{ overflow: "visible" }}>
                    <KeyItem color={col} />
                  </svg>
                  <div style={{ background: C.paper, border: `4px solid ${C.ink}`, borderRadius: 14, padding: "6px 18px", fontFamily: fonts.body, fontWeight: 800, fontSize: 36, color: col, boxShadow: shadow }}>{label}</div>
                </div>
                {isMissing && (
                  <div style={{ position: "absolute", left: "50%", top: -30 }}>
                    <Mark t={t} at={209.6} kind="question" size={60} />
                  </div>
                )}
              </Pop>
            );
          })}
          <Chip t={t} at={207.6} until={209.2} x={960} y={330} text="… comme les clés d'un camion" color={C.navy} size={40} />
          <Chip t={t} at={210.0} until={213.0} x={960} y={330} text="Une clé manque : le moteur ne démarre pas" color={C.red} size={40} />
          <Keyword t={t} at={213.6} until={216.1} x={960} y={360} text="TOUTES LES CLÉS" size={80} color={C.emerald} sub="sans tous ces éléments, on ne démarre rien" />
        </>
      }
    />
  );
};
