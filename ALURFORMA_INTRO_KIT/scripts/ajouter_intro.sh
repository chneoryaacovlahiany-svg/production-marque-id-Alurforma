#!/usr/bin/env bash
# Colle l'intro ALURFORMA devant une vidéo de formation (n'importe quelle source : Remotion, HeyGen, Descript, OBS…).
# Les deux vidéos sont remises au même format (1920×1080, 30 i/s, son stéréo 48 kHz) avant d'être enchaînées.
# Usage : scripts/ajouter_intro.sh out/intros/F01L01_intro.mp4 ma_lecon.mp4 ma_lecon_avec_intro.mp4
set -euo pipefail
INTRO="$1"; VIDEO="$2"; OUT="$3"
norm="scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0xfbf8f1,fps=30,format=yuv420p,setsar=1"
aud="aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo"
if ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$VIDEO" | grep -q .; then
  INPUTS=(-i "$INTRO" -i "$VIDEO"); A1="[1:a]${aud}[a1]"
else
  # vidéo sans son : on lui ajoute une piste silencieuse de la même durée
  DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$VIDEO")
  INPUTS=(-i "$INTRO" -i "$VIDEO" -f lavfi -t "$DUR" -i anullsrc=r=48000:cl=stereo); A1="[2:a]${aud}[a1]"
fi
ffmpeg -y -v error "${INPUTS[@]}" -filter_complex \
  "[0:v]${norm}[v0];[1:v]${norm}[v1];[0:a]${aud}[a0];${A1};[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]" \
  -map "[v]" -map "[a]" -c:v libx264 -crf 18 -preset medium -c:a aac -b:a 192k -movflags +faststart "$OUT"
echo "✓ $OUT"
