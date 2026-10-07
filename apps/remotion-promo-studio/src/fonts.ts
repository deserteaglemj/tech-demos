import {loadFont as loadSyne} from '@remotion/google-fonts/Syne';
import {loadFont as loadDMSans} from '@remotion/google-fonts/DMSans';

const syne = loadSyne('normal', {
	weights: ['700', '800'],
	subsets: ['latin'],
});

const dmSans = loadDMSans('normal', {
	weights: ['400', '500', '700'],
	subsets: ['latin'],
});

export const fontDisplay = syne.fontFamily;
export const fontBody = dmSans.fontFamily;
