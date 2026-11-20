import React from 'react';
import {AbsoluteFill, Img, Interactive, staticFile} from 'remotion';

/** Round face watermark, visible for the whole spot */
export const Watermark: React.FC = () => (
	<AbsoluteFill style={{pointerEvents: 'none'}}>
		<Interactive.Div
			name="Face watermark"
			style={{
				position: 'absolute',
				right: 44,
				bottom: 44,
				width: 170,
				height: 170,
				borderRadius: '50%',
				border: '5px solid rgba(255,255,255,0.9)',
				boxShadow: '0 8px 24px rgba(10,0,35,0.55), 0 0 0 3px rgba(255,214,10,0.7)',
				overflow: 'hidden',
				opacity: 0.8,
			}}
		>
			<Img src={staticFile('watermark-face.png')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
		</Interactive.Div>
	</AbsoluteFill>
);
