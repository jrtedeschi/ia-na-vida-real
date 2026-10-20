#!/bin/sh
# Renderiza cada pôster em 1080×1350 e grava o JPG nas imagens do Encontro 2.
# Uso: sh render.sh   (precisa do Google Chrome e de rede para as fontes)
set -e
cd "$(dirname "$0")"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT=../../src/content/slides/encontro-2/img
mkdir -p out
for name in padaria padaria-sem-skill pet costura padaria-estrela; do
	"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
		--window-size=1080,1350 --virtual-time-budget=8000 \
		--screenshot="$PWD/out/$name.png" "file://$PWD/$name.html" 2>/dev/null
	sips -s format jpeg -s formatOptions 85 "out/$name.png" --out "$OUT/poster-$name.jpg" >/dev/null
done
echo "ok: $OUT/poster-*.jpg"
