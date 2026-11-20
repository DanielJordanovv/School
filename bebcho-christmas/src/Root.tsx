import React from 'react';
import {Composition} from 'remotion';
import {BebchoChristmas} from './BebchoChristmas';

export const RemotionRoot: React.FC = () => {
	return (
		<Composition
			id="BebchoChristmas"
			component={BebchoChristmas}
			durationInFrames={300}
			fps={30}
			width={1920}
			height={1080}
			defaultProps={{
				products: [
					{src: 'products/kpop-demon-hunters-rumi.png', x: 225, y: 690, h: 700, delay: 2, halo: 'lime' as const},
					{src: 'products/spidey.png', x: 1700, y: 650, h: 470, delay: 4, halo: 'yellow' as const},
					{src: 'products/squishy-dumplings.png', x: 255, y: 175, h: 230, delay: 0, halo: 'yellow' as const},
					{src: 'products/squishmallow.png', x: 1720, y: 190, h: 270, delay: 6, halo: 'lime' as const},
					{src: 'products/pikachu-mega.png', x: 480, y: 905, h: 330, delay: 8, halo: 'yellow' as const},
					{src: 'products/peppa-bike.png', x: 1450, y: 905, h: 330, delay: 10, halo: 'lime' as const},
					{src: 'products/fire-brigade.png', x: 960, y: 985, h: 175, delay: 12, halo: 'yellow' as const},
				],
			}}
		/>
	);
};
