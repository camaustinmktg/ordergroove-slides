#!/bin/bash
# Install all Figtree font weights for use by pptxgenjs / LibreOffice
SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
FONT_DIR="$SKILL_DIR/assets/brand/fonts"
DEST="$HOME/.fonts"

mkdir -p "$DEST"

for ttf in "$FONT_DIR"/*.ttf; do
  cp "$ttf" "$DEST/"
  echo "Installed $(basename "$ttf")"
done

# Rebuild font cache if fc-cache is available
if command -v fc-cache &>/dev/null; then
  fc-cache -f "$DEST" 2>/dev/null
  echo "Font cache updated."
fi

echo "All Figtree weights installed to $DEST"
