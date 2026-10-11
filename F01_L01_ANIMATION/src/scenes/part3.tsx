import React from "react";
import { interpolate } from "remotion";
import { C, fonts, shadow } from "../theme";
import { pop, ramp, span, useT } from "../lib/timeline";
import { SceneShell } from "../components/SceneShell";
import { Character } from "../components/characters/Character";
import { FolderItem, Icon, Truck } from "../components/props";
import { CheckLine, Chip, Keyword, Label, Mark, PaperCard, Pop, Sign } from "../components/ui";
import { GROUND, HOST_H, meta, Medallion, QuoteText } from "./common";

// S15 — negotiate ≠ commit
export const S15: React.FC = () => {
  const m = meta("S15-negocier");
  const t = useT();
  const fly = ramp(t, 240.6, 242.2);
  // the envelope travels from the mandate to the client medallion
  return (
    <SceneShell
      start={m.startSec}
      enter={m.transitionIn}
      backdrop="office"
      world={
        <>
          <Character who="LEA" t={t} x={170} y={GROUND} h={HOST_H} pose={[{ at: 216, pose: "rest" }, { at: 220.5, pose: "explain" }, { at: 228.2, pose: "fingerUp" }, { at: 230.8, pose: "rest" }, { at: 236.8, pose: "explain" }, { at: 240.4, pose: "pointR" }, { at: 243.4, pose: "rest" }, { at: 248.9, pose: "fingerUp" }]} look={0.7} mood={[{ at: 216, mood: "smile" }, { at: 228.2, mood: "focused" }, { at: 249, mood: "smile" }]} />
          <Character who="HUGO" t={t} x={1760} y={GROUND} h={HOST_H} pose={[{ at: 216, pose: "explain" }, { at: 220.4, pose: "rest" }, { at: 231.9, pose: "explain" }, { at: 236.8, pose: "rest" }, { at: 244.2, pose: "shrug" }, { at: 248, pose: "rest" }]} look={-0.7} mood={[{ at: 216, mood: "focused" }, { at: 244.2, mood: "worried" }, { at: 248.6, mood: "smile" }]} />
        </>
      }
      ui={
        <>
          <Keyword t={t} at={217.2} until={220.5} x={960} y={200} text="NÉGOCIER ≠ ENGAGER" size={100} sub="une confusion fréquente" />
          <PaperCard t={t} at={220.5} until={237.0} from="left" x={690} y={470} w={640} title="Négocier" band={C.emerald}>
            <CheckLine t={t} at={221.8} text="Discuter le prix" size={36} />
            <CheckLine t={t} at={223.0} text="Présenter une offre" size={36} />
            <CheckLine t={t} at={224.6} text="Faire des contre-propositions au nom du client" size={36} />
            <CheckLine t={t} at={228.4} kind="cross" text="Accepter l'offre finale" size={36} strike />
          </PaperCard>
          <PaperCard t={t} at={232.0} until={237.0} from="right" x={1290} y={470} w={600} title="Accepter = engager" band={C.navy}>
            <CheckLine t={t} at={233.6} text="Engager le client" size={36} />
            <CheckLine t={t} at={235.7} text="Signer un accord en son nom" size={36} />
          </PaperCard>
          <PaperCard t={t} at={237.2} until={246.4} from="bottom" x={800} y={450} w={720} title="Mandat" band={C.gold}>
            {[0, 1].map((i) => (
              <div key={i} style={{ height: 12, borderRadius: 6, background: "#d8cfbf", margin: "10px 0", width: `${90 - i * 20}%` }} />
            ))}
            <div style={{ position: "relative", display: "inline-block", margin: "10px 0" }}>
              <div style={{ position: "absolute", left: -8, right: -8, top: "15%", bottom: "5%", background: C.amber, opacity: 0.5, borderRadius: 8, transformOrigin: "left", scale: `${ramp(t, 238.4, 239.4)} 1` }} />
              <Label size={40} color={C.navy} style={{ position: "relative" }}>
                Pouvoir exprès d'accepter et de signer
              </Label>
            </div>
            {[0, 1].map((i) => (
              <div key={i} style={{ height: 12, borderRadius: 6, background: "#d8cfbf", margin: "10px 0", width: `${70 + i * 15}%` }} />
            ))}
          </PaperCard>
          {span(t, 240.4, 244.4) > 0 && (
            <div style={{ position: "absolute", left: interpolate(fly, [0, 1], [800, 1420]), top: interpolate(fly, [0, 0.5, 1], [430, 260, 400]), translate: "-50% -50%", rotate: `${fly * 360}deg`, opacity: span(t, 240.4, 244.4, 0.2, 0.4) }}>
              <Icon kind="envelope" size={130} />
            </div>
          )}
          <Medallion who="DELMAS" t={t} x={1420} y={430} r={120} at={240.8} until={246.4} label="Le client décide" />
          <Chip t={t} at={240.6} until={243.6} x={760} y={820} text="Sinon : l'agent transmet l'offre au client" color={C.navy} size={36} />
          <Pop t={t} x={960} y={420} at={244.6} until={248.6} s={1.8}>
            <div style={{ position: "relative" }}>
              <Icon kind="signature" size={140} />
              <div style={{ position: "absolute", right: -30, top: -30 }}>
                <Mark t={t} at={245.4} kind="cross" size={70} />
              </div>
            </div>
          </Pop>
          <Chip t={t} at={245.0} until={248.6} x={960} y={720} text="Signer sans en avoir le droit = mauvaise surprise" color={C.red} size={36} />
          <Pop t={t} x={960} y={400} at={248.9} until={251.2} s={1.5}>
            <Icon kind="shield" size={150} />
          </Pop>
          <Keyword t={t} at={249.2} until={251.2} x={960} y={640} text="SÉCURITÉ JURIDIQUE" size={88} />
        </>
      }
    />
  );
};

// S16 — M. Delmas wants to sell fast: no visit before the frame is in place
export const S16: React.FC = () => {
  const m = meta("S16-delmas");
  const t = useT();
  return (
    <SceneShell
      start={m.startSec}
      enter={m.transitionIn}
      backdrop="garden"
      camera={[[251, 1.0, 0, 0], [262, 1.0, 0, 0], [264, 1.06, -60, 20], [269, 1.0, 0, 0]]}
      world={
        <>
          <Character who="BUYER" t={t} x={[[263.4, 1640], [266.4, 2200]]} walk={[[263.4, 266.4]]} y={905} h={440} opacity={ramp(t, 256.4, 257.2)} pose={[{ at: 256.4, pose: "wave" }, { at: 258.4, pose: "handsHips" }, { at: 262.8, pose: "shrug" }, { at: 263.4, pose: "rest" }]} look={[[256, -0.6], [263.2, 0.6]]} mood={[{ at: 256, mood: "happy" }, { at: 262.8, mood: "surprised" }]} />
          <Character who="DELMAS" t={t} x={[[251.2, -200], [253.8, 360]]} walk={[[251.2, 253.8]]} y={1010} h={520} pose={[{ at: 251, pose: "rest" }, { at: 254, pose: "pointR" }, { at: 256.4, pose: "open" }, { at: 262.4, pose: "rest" }, { at: 269.6, pose: "think" }]} look={0.6} mood={[{ at: 251, mood: "happy" }, { at: 262.6, mood: "surprised" }, { at: 270, mood: "smile" }]} />
          <Character who="HUGO" t={t} x={660} y={1010} h={560} pose={[{ at: 251, pose: "explain" }, { at: 262.6, pose: "open" }, { at: 266, pose: "holdR" }]} look={[[251, 0.4], [262.4, -0.5]]} mood={[{ at: 251, mood: "smile" }, { at: 259, mood: "worried" }, { at: 269.6, mood: "smile" }]} rightItem={t > 266 ? <FolderItem /> : undefined} />
        </>
      }
      ui={
        <>
          <Keyword t={t} at={251.6} until={254.0} x={1100} y={170} text="LE CAS DE M. DELMAS" size={84} />
          <Sign t={t} at={254.2} x={1300} y={640} text="À vendre" w={260} size={40} rot={-4} post color="#fbe3c6" />
          <Chip t={t} at={254.8} until={259.0} x={1300} y={500} text="… vite !" color={C.amber} size={36} />
          <Chip t={t} at={256.8} until={262.0} x={1640} y={380} text="Acheteur déjà intéressé" color={C.navy} size={30} />
          <Chip t={t} at={259.3} until={262.4} x={700} y={230} text="Pas encore de mandat écrit" color={C.red} size={38} icon={<Mark t={t} at={259.3} kind="cross" size={40} />} />
          <Chip t={t} at={260.5} until={262.4} x={1240} y={230} text="Carte expirée" color={C.amber} size={38} icon={<Mark t={t} at={260.5} kind="question" size={40} />} />
          <Keyword t={t} at={262.6} until={269.4} x={960} y={170} text="PAS DE VISITE NI DE NÉGOCIATION" size={66} color={C.red} underline={C.amber} sub="avant la mission formalisée et un titre professionnel valable" />
          <PaperCard t={t} at={269.7} until={274.6} x={1300} y={360} w={640} title="Ce qu'on fait" band={C.emerald}>
            <CheckLine t={t} at={270.0} text="Expliquer au client" size={38} />
            <CheckLine t={t} at={271.0} text="Préparer le dossier" size={38} />
            <CheckLine t={t} at={272.6} kind="cross" text="Lancer la visite" size={38} strike />
          </PaperCard>
          {span(t, 274.6, 277.6) > 0 && (
            <div style={{ position: "absolute", left: 0, top: 0, opacity: span(t, 274.6, 277.6, 0.3, 0.3) }}>
              <Truck x={1300} y={420} s={0.36} />
              <div style={{ position: "absolute", left: 1300, top: 240, scale: String(pop(t, 275.2)) }}>
                <Mark t={t} at={275.2} kind="cross" size={70} />
              </div>
              <div style={{ position: "absolute", left: 1210, top: 440, whiteSpace: "nowrap", fontFamily: fonts.body, fontWeight: 800, fontSize: 30, color: C.paper, textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}>sans les clés</div>
            </div>
          )}
        </>
      }
    />
  );
};

// S17 — Delmas changes his mind: start again from zero
export const S17: React.FC = () => {
  const m = meta("S17-changement");
  const t = useT();
  const flip = ramp(t, 279.0, 279.8);
  const steps: [string, number][] = [
    ["① Qualifier la nouvelle demande", 285.6],
    ["② Carte : mention « gestion immobilière »", 288.3],
    ["③ Contrôler l'habilitation des collaborateurs", 291.0],
    ["④ Formaliser un nouveau mandat adapté", 293.6],
  ];
  return (
    <SceneShell
      start={m.startSec}
      enter={m.transitionIn}
      backdrop="garden"
      camera={[[277.5, 1, 0, 0], [279, 1.1, -120, 30], [282.5, 1.1, -120, 30], [285, 1, 0, 0]]}
      world={
        <>
          <Character who="DELMAS" t={t} x={360} y={1010} h={520} pose={[{ at: 277.5, pose: "think" }, { at: 279.4, pose: "pointR" }, { at: 282, pose: "rest" }]} look={0.6} mood={[{ at: 277.5, mood: "smile" }, { at: 279.4, mood: "happy" }]} />
          <Character who="HUGO" t={t} x={660} y={1010} h={560} pose={[{ at: 277.5, pose: "explain" }, { at: 282, pose: "holdR" }]} look={[[277.5, -0.5], [283, 0.6]]} mood="smile" rightItem={<FolderItem />} />
          <Character who="LEA" t={t} x={[[277.6, 2150], [280.8, 1745]]} walk={[[277.6, 280.8]]} y={1010} h={540} pose={[{ at: 281.6, pose: "fingerUp" }, { at: 284.6, pose: "explain" }, { at: 301.8, pose: "fingerUp" }]} look={-0.6} mood={[{ at: 277.6, mood: "smile" }, { at: 301.8, mood: "focused" }]} />
        </>
      }
      ui={
        <>
          <div style={{ position: "absolute", left: 1300, top: 640, translate: "-50% -50%", scale: `${Math.abs(Math.cos(flip * Math.PI))} 1`, opacity: span(t, 277.0, 285.2, 0.01, 0.4) }}>
            <Sign t={t} at={276} x={0} y={0} text={flip < 0.5 ? "À vendre" : "À louer"} w={260} size={40} rot={-4} post color={flip < 0.5 ? "#fbe3c6" : "#d9f0dd"} />
          </div>
          <Pop t={t} x={1300} y={450} at={280.8} until={285.0}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Icon kind="ledger" size={110} />
              <Label size={32} color={C.paper} style={{ textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}>
                + gestion des loyers
              </Label>
            </div>
          </Pop>
          <Keyword t={t} at={283.0} until={285.4} x={1190} y={170} text="ON REPART À ZÉRO" size={100} color={C.navy} />
          <PaperCard t={t} at={285.2} until={301.6} x={1190} y={440} w={760} title="Nouvelle vérification" band={C.navy}>
            {steps.map(([s, at]) => (
              <CheckLine key={s} t={t} at={at} text={s} size={33} />
            ))}
            <div style={{ marginTop: 14, opacity: ramp(t, 295.8, 296.3) }}>
              <Label size={32} color={C.red}>… avant de commencer quoi que ce soit.</Label>
            </div>
          </PaperCard>
          <Chip t={t} at={298.4} until={301.6} x={1190} y={770} text="Chaque changement = nouvelle vérification rigoureuse" color={C.emerald} size={28} />
          <Keyword t={t} at={302.4} until={306.4} x={1190} y={180} text="VENTE ≠ GESTION" size={110} color={C.red} underline={C.amber} sub="ne jamais présumer" />
        </>
      }
    />
  );
};

// S18 — RCP vs financial guarantee
export const S18: React.FC = () => {
  const m = meta("S18-assurances");
  const t = useT();
  const blot = ramp(t, 320.6, 321.2);
  const chestDim = ramp(t, 339.0, 339.8);
  const shieldGlow = ramp(t, 341.8, 342.4);
  const coin = (i: number, a: number, from: [number, number], to: [number, number]) => {
    const k = ramp(t, a + i * 0.25, a + 0.9 + i * 0.25);
    if (k <= 0 || k >= 1) return null;
    return (
      <div key={`${a}-${i}`} style={{ position: "absolute", left: interpolate(k, [0, 1], [from[0], to[0]]), top: interpolate(k, [0, 0.5, 1], [from[1], Math.min(from[1], to[1]) - 120, to[1]]), translate: "-50% -50%" }}>
        <Icon kind="coin" size={56} />
      </div>
    );
  };
  return (
    <SceneShell
      start={m.startSec}
      enter={m.transitionIn}
      backdrop="tower"
      world={
        <>
          <Character who="HUGO" t={t} x={230} y={1010} h={540} pose={[{ at: 306, pose: "explain" }, { at: 312.4, pose: "rest" }, { at: 324.4, pose: "explain" }, { at: 334.2, pose: "rest" }]} look={0.6} mood={[{ at: 306, mood: "smile" }, { at: 324.4, mood: "focused" }]} />
          <Character who="LEA" t={t} x={1720} y={1010} h={520} pose={[{ at: 306, pose: "rest" }, { at: 312.8, pose: "explain" }, { at: 320.4, pose: "pointL" }, { at: 324, pose: "rest" }, { at: 334.7, pose: "explain" }, { at: 341.8, pose: "fingerUp" }]} look={-0.6} mood={[{ at: 306, mood: "smile" }, { at: 341.8, mood: "focused" }]} />
        </>
      }
      ui={
        <>
          <Keyword t={t} at={307.4} until={310.0} x={960} y={200} text="RCP ≠ GARANTIE FINANCIÈRE" size={76} />
          {/* RCP shield */}
          <Pop t={t} x={600} y={430} at={310.0} until={345.1} s={1 + shieldGlow * 0.25}>
            <div style={{ textAlign: "center" }}>
              <div style={{ filter: shieldGlow > 0 ? `drop-shadow(0 0 ${30 * shieldGlow}px rgba(255,230,140,0.95))` : undefined }}>
                <Icon kind="shield" size={210} />
              </div>
              <div style={{ marginTop: 6, background: C.paper, border: `4px solid ${C.ink}`, borderRadius: 14, padding: "6px 18px", fontFamily: fonts.body, fontWeight: 800, fontSize: 40, color: C.emerald, boxShadow: shadow }}>RCP</div>
            </div>
          </Pop>
          {/* financial-guarantee chest */}
          <Pop t={t} x={1300} y={430} at={310.9} until={345.1}>
            <div style={{ textAlign: "center", opacity: 1 - chestDim * 0.6, filter: chestDim > 0.5 ? "grayscale(0.8)" : undefined }}>
              <Icon kind="chest" size={210} />
              <div style={{ marginTop: 6, background: C.paper, border: `4px solid ${C.ink}`, borderRadius: 14, padding: "6px 18px", fontFamily: fonts.body, fontWeight: 800, fontSize: 36, color: C.wood, boxShadow: shadow }}>Garantie financière</div>
            </div>
          </Pop>
          <Chip t={t} at={316.0} until={324.0} x={650} y={720} text="Responsabilité civile professionnelle" color={C.emerald} size={30} />
          {span(t, 320.4, 322.6) > 0 && (
            <div style={{ position: "absolute", left: 600 + (1 - blot) * -260 + (blot > 0.99 ? (t - 321.2) * 300 : 0), top: interpolate(blot, [0, 1], [120, 330]) + (blot > 0.99 ? -(t - 321.2) * 200 : 0), translate: "-50% -50%", opacity: span(t, 320.4, 322.6, 0.2, 0.6) }}>
              <svg width={110} height={110} viewBox="-55 -55 110 110">
                <path d="M 0 -40 C 26 -40 44 -20 38 6 C 50 20 30 46 6 40 C -16 52 -46 32 -38 8 C -52 -12 -26 -42 0 -40 Z" fill="#2b2233" />
              </svg>
              <div style={{ fontFamily: fonts.body, fontWeight: 800, fontSize: 24, color: C.paper, textAlign: "center", textShadow: "0 2px 4px #000" }}>faute</div>
            </div>
          )}
          <Chip t={t} at={321.4} until={324.2} x={650} y={800} text="Fautes du pro → conséquences financières" color={C.navy} size={30} />
          {[0, 1, 2, 3].map((i) => coin(i, 325.2, [900, 820], [1300, 430]))}
          {[0, 1, 2, 3].map((i) => coin(i, 328.4, [1300, 430], [1680, 300]))}
          <Pop t={t} x={1700} y={280} at={328.2} until={334.6}>
            <div style={{ textAlign: "center" }}>
              <Icon kind="house" size={110} />
              <Label size={26} color={C.paper} style={{ textShadow: "0 2px 6px rgba(0,0,0,0.7)" }}>
                propriétaire
              </Label>
            </div>
          </Pop>
          <Chip t={t} at={325.4} until={334.4} x={1300} y={720} text="Fonds reçus pour le compte des clients" color={C.wood} size={30} />
          <Chip t={t} at={328.6} until={334.4} x={1300} y={790} text="ex. loyers encaissés avant reversement" color={C.inkSoft} size={28} />
          <Chip t={t} at={331.9} until={334.6} x={1300} y={860} text="Obligatoire surtout en gestion et syndic" color={C.red} size={30} />
          <Chip t={t} at={335.4} until={341.6} x={1300} y={720} text="Agence qui déclare ne pas détenir de fonds" color={C.navy} size={30} />
          <Chip t={t} at={339.2} until={345.1} x={1300} y={800} text="Garantie financière : pas toujours requise" color={C.inkSoft} size={30} />
          <Keyword t={t} at={341.9} until={345.1} x={960} y={200} text="RCP : TOUJOURS OBLIGATOIRE" size={80} color={C.emerald} underline={C.gold} />
        </>
      }
    />
  );
};

// S19 — the operational checklist
export const S19: React.FC = () => {
  const m = meta("S19-checklist");
  const t = useT();
  const items: [string, number][] = [
    ["La demande", 350.9],
    ["La carte professionnelle", 351.9],
    ["L'attestation d'habilitation", 353.3],
    ["Le mandat écrit", 355.0],
    ["Les pouvoirs exprès", 356.6],
    ["Les assurances obligatoires", 357.8],
  ];
  return (
    <SceneShell
      start={m.startSec}
      enter={m.transitionIn}
      backdrop="office"
      world={
        <>
          <Character who="LEA" t={t} x={250} y={GROUND} h={HOST_H} pose={[{ at: 345, pose: "rest" }, { at: 359.5, pose: "explain" }, { at: 366, pose: "rest" }, { at: 370.4, pose: "cheer" }]} look={0.7} mood={[{ at: 345, mood: "smile" }, { at: 370.4, mood: "happy" }]} />
          <Character who="HUGO" t={t} x={1680} y={GROUND} h={HOST_H} pose={[{ at: 345, pose: "open" }, { at: 346.6, pose: "explain" }, { at: 359, pose: "rest" }, { at: 366.6, pose: "explain" }, { at: 370.4, pose: "cheer" }]} look={-0.7} mood={[{ at: 345, mood: "happy" }, { at: 359, mood: "smile" }, { at: 370.4, mood: "happy" }]} />
        </>
      }
      ui={
        <>
          <Keyword t={t} at={346.8} until={350.0} x={960} y={260} text="AVANT TOUTE ACTION" size={96} sub="engageant un client, toujours vérifier :" />
          <PaperCard t={t} at={349.9} until={359.4} x={960} y={470} w={900} title="Check-list" band={C.emerald}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 30 }}>
              {items.map(([s, at]) => (
                <CheckLine key={s} t={t} at={at} text={s} size={34} />
              ))}
            </div>
          </PaperCard>
          <PaperCard t={t} at={359.5} until={366.4} x={960} y={460} w={900} title="Quand un document manque" band={C.red} from="right">
            <CheckLine t={t} at={361.0} text="① Demander la preuve" size={40} />
            <CheckLine t={t} at={362.6} text="② Informer le client" size={40} />
            <CheckLine t={t} at={364.4} text="③ Différer l'action jusqu'à régularisation" size={40} />
          </PaperCard>
          <Pop t={t} x={960} y={380} at={366.8} until={373.6} s={1.8}>
            <Icon kind="handshake" size={140} />
          </Pop>
          <Chip t={t} at={368.4} until={373.6} x={720} y={560} text="Le professionnel protégé" color={C.emerald} size={36} />
          <Chip t={t} at={369.6} until={373.6} x={1200} y={560} text="Le client protégé" color={C.navy} size={36} />
          <Keyword t={t} at={370.5} until={373.7} x={960} y={190} text="QUALITÉ DE LA TRANSACTION" size={76} color={C.navy} underline={C.gold} />
        </>
      }
    />
  );
};

// S20 — conclusion at sunset
export const S20: React.FC = () => {
  const m = meta("S20-conclusion");
  const t = useT();
  const steps = ["Demande", "Carte", "Habilitation", "Mandat", "Assurances"];
  const pathK = ramp(t, 380.8, 383.6);
  return (
    <SceneShell
      start={m.startSec}
      enter={m.transitionIn}
      backdrop="sunset"
      warmth={0.14}
      camera={[[373.5, 1.1, 0, -30], [392.1, 1.0, 0, 0]]}
      world={
        <>
          <Character who="LEA" t={t} x={850} y={880} h={360} pose={[{ at: 373.5, pose: "explain" }, { at: 380, pose: "rest" }, { at: 385.7, pose: "pointUpR" }, { at: 389, pose: "rest" }, { at: 390.9, pose: "cheer" }]} look={0.5} mood={[{ at: 373.5, mood: "smile" }, { at: 390.9, mood: "happy" }]} />
          <Character who="HUGO" t={t} x={1080} y={880} h={372} pose={[{ at: 373.5, pose: "rest" }, { at: 380.6, pose: "explain" }, { at: 385, pose: "rest" }, { at: 389.6, pose: "fingerUp" }, { at: 391.2, pose: "cheer" }]} look={-0.5} mood={[{ at: 373.5, mood: "smile" }, { at: 389.6, mood: "happy" }]} />
        </>
      }
      ui={
        <>
          <div style={{ position: "absolute", left: 960, top: 200, translate: "-50% -50%", width: 1300, textAlign: "center", opacity: span(t, 374.6, 380.4, 0.4, 0.6) }}>
            <div style={{ background: "rgba(251,247,238,0.92)", borderRadius: 24, padding: "18px 30px", boxShadow: shadow, display: "inline-block" }}>
              <QuoteText t={t} a={375.3} b={377.4} text="« Occupez-vous de mon appartement »" size={56} />
              <div style={{ fontFamily: fonts.body, fontWeight: 800, fontSize: 34, color: C.red, marginTop: 6, opacity: ramp(t, 378.0, 378.6) }}>cache beaucoup plus qu'il n'y paraît</div>
            </div>
          </div>
          {span(t, 380.6, 386.0) > 0 && (
            <div style={{ position: "absolute", inset: 0, opacity: span(t, 380.6, 386.0, 0.3, 0.5) }}>
              <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
                <path d="M 260 470 C 560 330 760 520 960 380 S 1400 300 1660 420" fill="none" stroke={C.gold} strokeWidth={10} strokeDasharray="4 22" strokeLinecap="round" opacity={0.9 * pathK} />
              </svg>
              {steps.map((s, i) => {
                const pts = [[260, 470], [610, 400], [960, 380], [1310, 330], [1660, 420]];
                return (
                  <Pop key={s} t={t} at={381.0 + i * 0.6} x={pts[i][0]} y={pts[i][1]}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ width: 54, height: 54, borderRadius: 999, background: `radial-gradient(circle, #fff6c8, ${C.gold})`, border: `4px solid ${C.ink}`, margin: "0 auto", boxShadow: "0 0 24px rgba(255,220,120,0.9)" }} />
                      <div style={{ fontFamily: fonts.body, fontWeight: 800, fontSize: 30, color: C.paper, textShadow: "0 2px 6px rgba(0,0,0,0.7)", marginTop: 6 }}>{s}</div>
                    </div>
                  </Pop>
                );
              })}
              <Chip t={t} at={383.4} until={386.0} x={960} y={150} text="Un vrai parcours organisé, sérieux à chaque étape" color={C.navy} size={34} />
            </div>
          )}
          <Keyword t={t} at={386.2} until={392.2} x={960} y={300} text="AGIR EN TOUTE SÉCURITÉ JURIDIQUE" size={78} color={C.navy} ribbon="#fff6dc" underline={C.gold} />
          <Pop t={t} x={960} y={410} at={390.9} until={392.2}>
            <Label serif size={46} color={C.paper} style={{ textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>
              Important à retenir ? Complètement.
            </Label>
          </Pop>
        </>
      }
    />
  );
};

