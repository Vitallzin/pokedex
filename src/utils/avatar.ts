import type { SyntheticEvent } from 'react';

export const getDefaultAvatar = (seed: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed || 'Treinador')}`;

export const getImageFallbackHandler =
  (fallbackSrc: string) => (event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;

    if (image.src !== fallbackSrc) {
      image.src = fallbackSrc;
    }
  };
