import { categories } from "@src/shared/constants/categories";

export const defaultVideo = {
  description:
    "If the video category is unclear, or if the extension cannot communicate with the server, this setting ensures videos continue to play in your preferred default quality"
};

export const defaultFeaturePreferences = {
  defaultVideo: { quality: "480" },
  offlineMode: false,
  audioMode: false,
  backgroundMode: true,
  backgroundModeTimeout: 6
} as const;

export const defaultCategoryPreferences = {
  music: {
    min: "144",
    max: "144",
    audioOnly: true
  },
  podcast: {
    min: "144",
    max: "144",
    audioOnly: true
  },
  gaming: {
    min: "1080",
    max: "1080",
    audioOnly: false
  },
  news: {
    min: "480",
    max: "480",
    audioOnly: false
  },
  coding: {
    min: "1080",
    max: "1080",
    audioOnly: false
  },
  sports: {
    min: "720",
    max: "720",
    audioOnly: false
  },
  graphics: {
    min: "240",
    max: "240",
    audioOnly: false
  },
  lifestyle: {
    min: "480",
    max: "480",
    audioOnly: false
  },
  nature: {
    min: "720",
    max: "720",
    audioOnly: false
  },
  demo: {
    min: "480",
    max: "480",
    audioOnly: false
  }
} as const;

export type VideoScores = {
  _id: string;
  textScores: Record<keyof typeof categories, number>;
};

// export type FeatureInfo = { featureName: string; description: string };

export const features = {
  audioMode: {
    featureName: "Audio Mode",
    description: "Disable video stream, enabling playback of only the audio"
  },
  backgroundMode: {
    featureName: "Background Mode",
    description:
      "Disable video stream when the video is playing in the background"
  }
} as const;
