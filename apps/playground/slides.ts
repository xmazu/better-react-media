const breakpoints = [3840, 1920, 1080, 640, 384, 256, 128];

function unsplashUrl(photoId: string, width: number) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=80`;
}

export const slides = [
  {
    alt: 'Snow-covered mountain peaks rising above a sea of clouds at sunrise',
    description: 'Alpine sunrise',
    height: 2667,
    photoId: 'photo-1506905925346-21bda4d32df4',
    width: 4000,
  },
  {
    alt: 'Turquoise waves rolling onto a sandy tropical beach under a clear sky',
    description: 'Tropical beach',
    height: 2667,
    photoId: 'photo-1507525428034-b723cf961d3e',
    width: 4000,
  },
  {
    alt: 'Sunbeams filtering through tall trees in a dense green forest',
    description: 'Forest trail',
    height: 2667,
    photoId: 'photo-1441974231531-c6227db76b6e',
    width: 4000,
  },
  {
    alt: 'Rolling sand dunes in the Sahara desert at golden hour',
    height: 2667,
    photoId: 'photo-1509316785289-025f5b846b35',
    width: 4000,
  },

  {
    alt: 'Golden retriever sitting in a field of wildflowers',
    height: 2667,
    photoId: 'photo-1587300003388-59208cc962cb',
    width: 4000,
  },
].map(({ photoId, width, height, ...rest }) => ({
  height,
  src: unsplashUrl(photoId, width),
  srcSet: breakpoints.map((breakpoint) => ({
    height: Math.round((height / width) * breakpoint),
    src: unsplashUrl(photoId, breakpoint),
    width: breakpoint,
  })),
  width,
  ...rest,
}));

export default slides;
