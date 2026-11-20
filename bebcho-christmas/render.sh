#!/usr/bin/env bash
# Renders the billboard video. Uses a local Chromium if REMOTION_BROWSER is set.
set -euo pipefail
cd "$(dirname "$0")"
EXTRA=()
if [[ -n "${REMOTION_BROWSER:-}" ]]; then EXTRA+=(--browser-executable="$REMOTION_BROWSER"); fi
npx remotion render BebchoChristmas out/bebcho-christmas-1920x1080.mp4 \
  --codec=h264 --crf=14 --pixel-format=yuv420p --gl=angle "${EXTRA[@]}" "$@"
