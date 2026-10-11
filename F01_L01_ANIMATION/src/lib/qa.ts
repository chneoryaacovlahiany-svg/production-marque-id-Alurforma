import { createContext, useContext } from "react";

/**
 * Layout QA: "chars" renders only the painted world (characters & props) as black silhouettes,
 * "ui" renders only the overlays (keywords, cards, chips…). scripts/qa_overlap.mjs renders both and
 * measures how much of each character an overlay covers.
 */
export type QaMode = "off" | "chars" | "ui";
export const QaContext = createContext<QaMode>("off");
export const useQa = () => useContext(QaContext);
