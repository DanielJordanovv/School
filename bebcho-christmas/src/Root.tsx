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
			defaultProps={{products: [] as string[]}}
		/>
	);
};
