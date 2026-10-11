#!/usr/bin/env bash
# Download the Google Fonts used by the video into public/fonts (render machines may be offline).
set -euo pipefail
cd "$(dirname "$0")/../public/fonts"
UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
get() { # family weight file
  css=$(curl -sS -A "$UA" "https://fonts.googleapis.com/css2?family=$1:wght@$2&display=block")
  # keep the latin block (first latin-ext + latin urls)
  url=$(echo "$css" | awk '/\/\* latin \*\//{f=1} f&&/src:/{print; exit}' | grep -o 'https://[^)]*')
  curl -sS -o "$3" "$url"
  echo "$3 $(stat -c %s "$3")"
}
get Fraunces 600 fraunces-600.woff2
get Fraunces 800 fraunces-800.woff2
get Nunito 600 nunito-600.woff2
get Nunito 700 nunito-700.woff2
get Nunito 800 nunito-800.woff2
get Outfit 400 outfit-400.woff2
get Outfit 600 outfit-600.woff2
