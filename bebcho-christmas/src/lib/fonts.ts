import {continueRender, delayRender, staticFile} from 'remotion';

// M PLUS Rounded 1c Black (SIL OFL): rounded, playful, with Cyrillic. Bundled locally.
export const fontFamily = 'MPLUS Rounded';

const faces = [
	{file: 'fonts/m-plus-rounded-1c-cyrillic-900-normal.woff2', range: 'U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116'},
	{
		file: 'fonts/m-plus-rounded-1c-latin-900-normal.woff2',
		range: 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
	},
];

if (typeof document !== 'undefined') {
	const handle = delayRender('Loading MPLUS Rounded font');
	Promise.all(
		faces.map(async (f) => {
			const face = new FontFace(fontFamily, `url(${staticFile(f.file)}) format('woff2')`, {weight: '900', unicodeRange: f.range});
			await face.load();
			document.fonts.add(face);
		}),
	)
		.then(() => continueRender(handle))
		.catch((err) => {
			console.error(err);
			continueRender(handle);
		});
}
