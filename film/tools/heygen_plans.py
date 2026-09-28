#!/usr/bin/env python3
"""Génération des plans du film « Le temps de Hugo » avec HeyGen Cinematic Avatar.

  python3 film/tools/heygen_plans.py submit 4 9        # soumet les plans
  python3 film/tools/heygen_plans.py status            # état des jobs
  python3 film/tools/heygen_plans.py wait              # attend et télécharge dans film/plans/
  python3 film/tools/heygen_plans.py quota

La clé API est lue dans HEYGEN_API_KEY (ou injectée par un proxy).
L'état des jobs est dans film/plans/jobs.json.
"""
import json, os, sys, time, pathlib, requests

ROOT = pathlib.Path(__file__).resolve().parents[2]
PLANS_DIR = ROOT / "film" / "plans"
JOBS = PLANS_DIR / "jobs.json"
BASE = "https://api.heygen.com"
HEADERS = {"Content-Type": "application/json"}
if os.environ.get("HEYGEN_API_KEY"):
    HEADERS["x-api-key"] = os.environ["HEYGEN_API_KEY"]

HUGO_LOOK = "f00f1a4be9e78e78d9fce23795894b5e"      # avatar « Hugo Alurforma »
AGENCY_REF = "27d9774fa33b44a2b90474d410ef5e99"     # image de référence (Hugo dans l'agence)

MASTER = (
    "Premium French brand film, cinematic and realistic, 16:9, 25 fps. "
    "Subject: Hugo, a 38-year-old French real estate agent — short dark brown hair combed to the side, "
    "trimmed three-day stubble, warm brown eyes, no glasses, unstructured midnight-navy blazer, white open-collar shirt, "
    "charcoal trousers, slim steel watch. Keep the same face, hair and outfit in every shot. "
    "Location: one modern real estate agency — light oak desk, glass partitions with thin black frames, one midnight-blue "
    "accent wall, brass-arm desk lamp, two green plants, a large street-facing window on the left, a glass entrance door "
    "centered at the back. Visual language: midnight navy, emerald green, discreet gold accents, ivory; glass, transparency, "
    "reflections, natural motivated light (window, lamp, screen). Slow continuous camera moves only, no handheld. "
    "Shallow depth of field on close-ups. Editorial, calm, high-end advertising look, fine film grain, soft contrast, "
    "warm highlights and navy shadows. No text overlays unless specified. No logos other than Alurforma. "
    "No exaggerated acting. He does not speak, no dialogue, no lip movement. "
)

# Plans du découpage V2 (film/DECOUPAGE_V2_HUGO.md). durée = durée HeyGen (4–15 s), avec marge.
PLANS = {
    "2": dict(duration=5, agency=False, prompt=
        "Medium three-quarter shot, 50 mm. Hugo stands in the doorway of a bright, empty, freshly painted apartment with tall "
        "windows, handing a set of keys to a young couple whose backs are partly to camera. A brief warm smile, then he glances "
        "at his steel watch. Soft daylight, warm highlights, navy shadows. Mood: momentum, a full day. Smooth, minimal camera drift."),
    "3": dict(duration=4, agency=True, prompt=
        "Close medium shot, 50 mm, shallow focus, at the agency. Hugo in focus at his desk, the laptop screen in the lower "
        "foreground edge showing a discreet ivory notification card reading \"Formation continue · à planifier\". Without looking "
        "at it he dismisses it with one swipe and picks up his phone. Morning window light. Mood: quiet avoidance."),
    "4": dict(duration=6, agency=True, prompt=
        "Evening at the agency, windows dark blue, only the brass desk lamp on. Hugo, blazer hung on the back of his chair, "
        "white shirt sleeves, opens a letter and reads; the paper is readable: \"Renouvellement de la carte professionnelle — "
        "dossier à préparer\". He sets it down, looks at the open diary, stops, breathes. Camera holds, then a slow push into a "
        "close-up, 85 mm. Behind him the lamp's reflection on the glass partition forms a thin vertical line of gold light. "
        "Mood: realization, contained worry."),
    "5": dict(duration=5, agency=True, prompt=
        "Same evening at the agency, lamp light. Hugo types; the laptop shows the Alurforma website (midnight-navy header, ivory "
        "page, emerald accents, headline \"Renouvelez votre carte professionnelle sans perdre de temps.\"). The camera arcs slowly "
        "around him and the screen, 35 mm; the ivory screen light replaces the lamp on his face. He leans in slightly. "
        "Mood: curiosity, first relief."),
    "6a": dict(duration=4, agency=True, prompt=
        "Profile shot, 50 mm, evening lamp light at the agency. Hugo watches a video lesson on the laptop, a trainer speaking in a "
        "clean navy-and-ivory interface labelled \"Leçon 2 / 3\", and writes one note in his diary. Mood: focus."),
    "6b": dict(duration=4, agency=False, prompt=
        "Daytime, passenger seat of a parked car, shot from the dashboard, 35 mm. Hugo, same navy blazer, finishes a lesson on his "
        "phone in the Alurforma interface (navy and ivory), glances out at a building across the street, then back to the screen. "
        "Soft daylight through the windshield. Mood: at his own pace."),
    "6c": dict(duration=4, agency=True, prompt=
        "Late afternoon at the agency, frontal medium shot, laptop screen in the lower foreground edge. An emerald check mark "
        "appears on the screen with the words \"Évaluation validée\". Hugo leans back into his chair, shoulders dropping, a small "
        "exhale. Mood: ease."),
    "7a": dict(duration=5, agency=True, prompt=
        "Agency, soft daylight, medium close shot over the laptop. Hugo watches a document titled \"Attestation de formation\" "
        "compose itself on an ivory page with a navy header, then a short list \"Documents utiles à votre dossier\" (attestation, "
        "programme, durée, date). He clicks. A soft emerald glass reflection with a thin gold edge sweeps across the screen. "
        "Mood: things falling into place."),
    "7b": dict(duration=4, agency=True, prompt=
        "Close shot, 50 mm, at the agency, Hugo's face visible above his hands: he takes a freshly printed attestation from a "
        "printer and slides it into a midnight-navy folder labelled \"Carte professionnelle — renouvellement\". Soft daylight. "
        "Mood: order."),
    "8": dict(duration=5, agency=True, prompt=
        "Close-up, 85 mm, warm daylight at the agency. Hugo holds his phone at chest height, screen readable in the lower "
        "foreground: a clean navy-and-ivory message \"Votre dossier de prise en charge est complet. Nous vous accompagnons pour la "
        "suite. — Votre conseillère Alurforma\". He reads, exhales slowly, a half smile, and sets the phone down. Mood: relief."),
    "9": dict(duration=6, agency=True, prompt=
        "Wide shot, slow dolly backwards, 35 mm, late-afternoon golden backlight, the agency. Hugo closes the laptop, takes his "
        "keys and blazer, walks through the agency and out through the glass entrance door, which ends up exactly centered in the "
        "frame. Outside, a client waits and they shake hands, seen through the glass. Mood: confidence, lightness."),
    "10": dict(duration=5, agency=True, prompt=
        "Static wide shot, 35 mm, the same agency completely empty, nobody in the frame, no person at all: Hugo has already left. "
        "The glass entrance door centered with warm late-afternoon light behind it, the brass lamp off, the chairs empty. Calm, "
        "still, late afternoon turning to dusk, the light slowly cooling toward blue. Mood: signature, stillness."),
}


def load_jobs():
    return json.loads(JOBS.read_text()) if JOBS.exists() else {}


def save_jobs(j):
    PLANS_DIR.mkdir(parents=True, exist_ok=True)
    JOBS.write_text(json.dumps(j, indent=2, ensure_ascii=False))


def submit(plan, tag=""):
    p = PLANS[plan]
    body = {
        "type": "cinematic_avatar",
        "prompt": MASTER + p["prompt"],
        "avatar_id": [HUGO_LOOK],
        "aspect_ratio": "16:9",
        "resolution": "1080p",
        "duration": p["duration"],
        "title": f"ALURFORMA film — plan {plan}{tag}",
    }
    if p["agency"]:
        body["references"] = [{"type": "asset_id", "asset_id": AGENCY_REF}]
    r = requests.post(f"{BASE}/v3/videos", headers=HEADERS, json=body, timeout=60)
    if r.status_code >= 300:
        print(f"plan {plan}: HTTP {r.status_code} {r.text[:500]}")
        return None
    vid = r.json()["data"]["video_id"]
    jobs = load_jobs()
    key = plan + tag
    jobs[key] = {"video_id": vid, "plan": plan, "status": "pending", "duration": p["duration"], "submitted_at": time.time()}
    save_jobs(jobs)
    print(f"plan {key}: soumis, video_id={vid}")
    return vid


def get(vid):
    return requests.get(f"{BASE}/v3/videos/{vid}", headers=HEADERS, timeout=60).json()["data"]


def status(quiet=False):
    jobs = load_jobs()
    for key, j in jobs.items():
        if j["status"] in ("completed", "failed") and j.get("file"):
            continue
        d = get(j["video_id"])
        j["status"] = d["status"]
        if d["status"] == "completed":
            j["video_url"] = d.get("video_url")
            j["duration_out"] = d.get("duration")
        if d["status"] == "failed":
            j["failure"] = d.get("failure_message") or d.get("error")
    save_jobs(jobs)
    if not quiet:
        for key, j in jobs.items():
            print(f"plan {key:4s} {j['status']:11s} {j.get('file','')}")
    return jobs


def download(key, j):
    num = j["plan"]; digits = "".join(c for c in num if c.isdigit()); suffix = num[len(digits):].upper()
    name = f"PLAN{int(digits):02d}{suffix}{key[len(num):]}_heygen_{j['duration']}s_1080p.mp4"
    dest = PLANS_DIR / name
    with requests.get(j["video_url"], stream=True, timeout=300) as r:
        r.raise_for_status()
        with open(dest, "wb") as f:
            for chunk in r.iter_content(1 << 20):
                f.write(chunk)
    j["file"] = str(dest.relative_to(ROOT))
    print(f"plan {key}: téléchargé -> {j['file']} ({dest.stat().st_size/1e6:.1f} Mo)")


def wait(poll=20):
    while True:
        jobs = status(quiet=True)
        pending = [k for k, j in jobs.items() if j["status"] not in ("completed", "failed")]
        for k, j in jobs.items():
            if j["status"] == "completed" and not j.get("file"):
                download(k, j)
                save_jobs(jobs)
            if j["status"] == "failed" and not j.get("reported"):
                print(f"plan {k}: ÉCHEC {j.get('failure')}")
                j["reported"] = True
                save_jobs(jobs)
        if not pending:
            break
        print(f"en attente : {', '.join(pending)}", flush=True)
        time.sleep(poll)
    status()


def quota():
    r = requests.get(f"{BASE}/v3/users/me", headers=HEADERS, timeout=60).json()
    q = requests.get(f"{BASE}/v2/user/remaining_quota", headers=HEADERS, timeout=60).json()
    print("wallet", r["data"].get("wallet"), "| credits", q["data"]["remaining_quota"], q["data"]["details"])


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "status"
    if cmd == "submit":
        tag = ""
        args = sys.argv[2:]
        if args and args[0].startswith("--tag="):
            tag = args[0][6:]; args = args[1:]
        for p in args:
            submit(p, tag)
    elif cmd == "status":
        status()
    elif cmd == "wait":
        wait()
    elif cmd == "quota":
        quota()
    elif cmd == "prompt":
        print(MASTER + PLANS[sys.argv[2]]["prompt"])
