# BEBCHO – Christmas billboard spot (Remotion)

16:9, 1920×1080, 30 fps, 10 s. Composition id: `BebchoChristmas`.

| Time | Scene |
|---|---|
| 0–2 s | Royal-purple present pops in, gold stars orbit, the box shakes and light leaks from the lid |
| 2–5 s | Golden burst: the lid flies off and the real BEBCHO products fly out of the present |
| 5–8 s | Product line-up with presents and stars, headline „ПЕРНИК, ВРЕМЕ Е ЗА ПОДАРЪЦИ!“ |
| 8–10 s | Headline moves up, the BEBCHO logo pops in at the centre with light rays and a shine sweep |

## Commands

```bash
npm i
npm run dev                       # Remotion Studio preview
./render.sh                       # -> out/bebcho-christmas-1920x1080.mp4
# If Remotion can't download its browser (offline machine):
REMOTION_BROWSER=/path/to/chrome-headless-shell ./render.sh
```

## Product photos

`public/products/` holds the store's product photos with the background removed. Their
position, size, launch delay and halo colour are set in the `products` prop in `src/Root.tsx`,
which you can also edit in the Studio sidebar. To add a product (for example LEGO, Hot Wheels or
Barbie), drop a transparent PNG in `public/products/` and add an entry.

## Assets
- `public/bebcho-logo-original.png`: the logo as supplied. `public/bebcho-logo.png`: the same artwork cut out onto a transparent background.
- `public/fonts/`: M PLUS Rounded 1c Black, SIL Open Font License. Fredoka and Lilita One have no Cyrillic, so this rounded font is used instead.
