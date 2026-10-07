import {Config} from '@remotion/cli/config';

// Keep the config minimal — this is a small demo, not a render farm.
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
