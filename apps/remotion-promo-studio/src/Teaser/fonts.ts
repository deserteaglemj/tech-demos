import {loadFont} from '@remotion/google-fonts/Syne';

const {fontFamily} = loadFont('normal', {
  weights: ['500', '700', '800'],
  subsets: ['latin'],
});

export const teaserFont = fontFamily;
