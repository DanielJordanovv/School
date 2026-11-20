# BEBCHO – Christmas billboard spot (Remotion)

16:9, 1920×1080, 30 fps, 10 s. Composition id: `BebchoChristmas`.

| Time | Scene |
|---|---|
| 0–2 s | Royal-purple present pops in, gold stars orbit, the box shakes and light leaks from the lid |
| 2–5 s | Golden burst: the lid flies off and the toys fly out (squishies, fashion doll + dream house, stud bricks that build a stack, die-cast cars racing an orange loop track) |
| 5–8 s | Group shot with presents and stars, headline „КОЛЕДАТА ЗАПОЧВА В БЕБЧО!“ |
| 8–10 s | Headline moves up, the BEBCHO logo pops in at the centre with light rays and a shine sweep |

## Commands

```bash
npm i
npm run dev                       # Remotion Studio preview
./render.sh                       # -> out/bebcho-christmas-1920x1080.mp4
# If Remotion can't download its browser (offline machine):
REMOTION_BROWSER=/path/to/chrome-headless-shell ./render.sh
```

## Official product photos (Mattel/Barbie, LEGO, Hot Wheels, K-Pop Demon Hunters, squishies)

The 3D toys are made in code and carry no trademarks. To show the real licensed products,
put official transparent cut-outs (PNG/WebP from the distributor or brand asset portal) in
`public/products/` and list them in the `products` prop (Studio sidebar, or `--props`):

```bash
./render.sh --props='{"products":["products/barbie.png","products/lego.png","products/hotwheels.png","products/kpop-demon-hunters.png","products/squishy.png"]}'
```

Up to 6 photos fly out of the present at the burst and settle around the composition
(`src/overlay/ProductPhotos.tsx`, `SLOTS`).

## Assets
- `public/bebcho-logo-original.png`: the logo as supplied. `public/bebcho-logo.png`: the same artwork cut out onto a transparent background.
- `public/fonts/`: Rubik Black, SIL Open Font License.
