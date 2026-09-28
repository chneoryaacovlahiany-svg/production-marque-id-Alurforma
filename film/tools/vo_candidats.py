#!/usr/bin/env python3
"""Génère la voix off du film avec plusieurs voix HeyGen (Starfish) pour comparaison.
Sortie : film/vo/candidats/<nom>.wav + <nom>_mots.json (timestamps des mots)."""
import json, pathlib, sys, requests

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / "film" / "vo" / "candidats"
BASE = "https://api.heygen.com"

SCRIPT = (
    "Hugo n'a jamais le temps. <break time=\"0.7s\"/> "
    "Des visites, des mandats, des clients… <break time=\"0.3s\"/> et une formation qu'il remet à plus tard. <break time=\"0.7s\"/> "
    "Jusqu'au jour où l'échéance de sa carte professionnelle approche. <break time=\"0.7s\"/> "
    "Alors, il découvre Alurforma. <break time=\"0.3s\"/> "
    "Une formation claire, qu'il suit à son rythme… <break time=\"0.2s\"/> et qu'il valide. <break time=\"0.3s\"/> "
    "Son attestation est prête. Les documents utiles à son dossier, aussi. <break time=\"0.3s\"/> "
    "Pour les démarches administratives, il est accompagné. <break time=\"0.7s\"/> "
    "Hugo peut retourner à son métier. <break time=\"0.7s\"/> "
    "Continuez votre métier. <break time=\"0.3s\"/> Alurforma simplifie le reste."
)

VOICES = {
    "B_storyteller_v100": "5JKDsTFJdLTm5nwOMtDy",   # Refined French Storyteller (voix B), vitesse 1,0
    "A_expert_v100": "bws1WSRtqbQjaCBVWWci",         # French Expert Narrator (voix A), vitesse 1,0
    "maren_v100": "cab32d1c39c9431e8a334cff33d1bb8c",  # Maren - Calm & Gentle
    "audrey_v100": "7459d7aa599b4f97908600896a0e7ef4",
    "chloe_v100": "4b1de1582d2c477485ad2e0c2717f0ff",
    "mamicha_v100": "19034eae6fb84f8b81461d0fe2326be4",
    "harper_v100": "4829d1907f1e48f3b7a7a1d0594abd7d",
}


def gen(name, voice_id, speed=1.0, text=SCRIPT):
    r = requests.post(f"{BASE}/v3/voices/speech", json={"text": text, "voice_id": voice_id, "speed": speed, "language": "fr"}, timeout=300)
    if r.status_code >= 300:
        print(name, "HTTP", r.status_code, r.text[:300]); return
    d = r.json()["data"]
    OUT.mkdir(parents=True, exist_ok=True)
    audio = requests.get(d["audio_url"], timeout=300).content
    ext = ".wav" if d["audio_url"].split("?")[0].endswith(".wav") else ".mp3"
    (OUT / f"{name}{ext}").write_bytes(audio)
    (OUT / f"{name}_mots.json").write_text(json.dumps(d.get("word_timestamps"), ensure_ascii=False))
    words = [w for w in d.get("word_timestamps", []) if not w["word"].startswith("<")]
    print(f"{name:22s} {d['duration']:.2f} s  dernier mot à {words[-1]['end']:.2f} s" if words else name)


if __name__ == "__main__":
    names = sys.argv[1:] or list(VOICES)
    for n in names:
        speed = 1.0
        if ":" in n:
            n, speed = n.split(":"); speed = float(speed)
        gen(n if speed == 1.0 else f"{n}_v{int(speed*100)}", VOICES[n], speed)
