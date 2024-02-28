export const apiURL = "http://localhost:5000";
export const qualities = [144, 240, 360, 480, 720, 1080, 1440, 2160, 4320];

export type PreferenceFeatures = {
  theme: boolean; // true for dark
  offlineMode: boolean;
  audioOnly: boolean;
  lowBackgroundResolution: boolean;
};

export type Preferences = {
  categories: {
    [key: string]: string;
  };
  features: PreferenceFeatures;
};

export const defaultPreferences = {
  categories: {
    music: "144",
    podcast: "144",
    gaming: "1080",
    news: "480",
    coding: "1080",
    sports: "720",
    graphics: "240",
    lifestyle: "480",
    nature: "720",
    demo: "480",
    defaultQuality: "480",
  },
  features: {
    theme: true, // true for dark
    offlineMode: false,
    audioOnly: false,
    lowBackgroundResolution: true,
  },
};

export type Category = {
  categoryName: string;
  descImg: string;
  desc: string;
  selectionConditions: {
    backendCategories: string[];
    analysisScores: (detailScore: number, diffScore: number) => boolean;
    keywordThreshold: number;
  };
};

export const categories: { [key: string]: Category } = {
  music: {
    categoryName: "Music",
    descImg: "../assets/categories/music.jpg",
    desc: "Music includes music videos and live performances",

    selectionConditions: {
      backendCategories: [],
      analysisScores: (_detailScore, _diffScore) => false,
      keywordThreshold: 1,
    },
  },
  podcast: {
    categoryName: "Podcast",
    descImg: "../assets/categories/podcast.jpg",
    desc: "Podcast is about all podcast content including interviews and panel discussions",

    selectionConditions: {
      backendCategories: ["person"],
      analysisScores: (_detailScore, diffScore) => diffScore <= 1000000,
      keywordThreshold: 1,
    },
  },
  gaming: {
    categoryName: "Gaming",
    descImg: "../assets/categories/game.jpg",
    desc: "Gaming focuses on in-game content, including gameplays and walkthroughs",

    selectionConditions: {
      backendCategories: ["person"],
      analysisScores: (detailScore, diffScore) =>
        detailScore >= 1200 && diffScore >= 1800000,
      keywordThreshold: 1,
    },
  },
  news: {
    categoryName: "News",
    descImg: "../assets/categories/news.jpg",
    desc: "News focuses on news headlines and videos that include worldwide updates",

    selectionConditions: {
      backendCategories: ["news"],
      analysisScores: (detailScore, _diffScore) => detailScore >= 1000,
      keywordThreshold: 1,
    },
  },
  coding: {
    categoryName: "Coding",
    descImg: "../assets/categories/coding.png",
    desc: "Coding includes programming and coding content, such as coding tutorials",

    selectionConditions: {
      backendCategories: ["textHeavy"],
      analysisScores: (detailScore, diffScore) =>
        detailScore >= 1000 && diffScore <= 1600000,
      keywordThreshold: 1,
    },
  },
  sports: {
    categoryName: "Sports",
    descImg: "../assets/categories/sports.jpg",
    desc: "Sports is for all sports-related content, such as match highlights and in-game moments",

    selectionConditions: {
      backendCategories: ["sports"],
      analysisScores: (detailScore, diffScore) =>
        detailScore >= 1200 && diffScore >= 1200000,
      keywordThreshold: 1,
    },
  },
  graphics: {
    categoryName: "Graphics",
    descImg: "../assets/categories/graphics.jpg",
    desc: "Graphics covers animations and a variety of visually creative videos",

    selectionConditions: {
      backendCategories: ["lowGraphics"],
      analysisScores: (detailScore, diffScore) =>
        detailScore <= 1000 && diffScore <= 1200000,
      keywordThreshold: 1,
    },
  },
  lifestyle: {
    categoryName: "Lifestyle",
    descImg: "../assets/categories/podcast.jpg",
    desc: "Lifetyle covers vlogs and a variety of content where people are the subject",

    selectionConditions: {
      backendCategories: ["person"],
      analysisScores: (detailScore, diffScore) =>
        detailScore <= 1000 && diffScore <= 1200000,
      keywordThreshold: 1,
    },
  },
  nature: {
    categoryName: "Nature",
    descImg: "../assets/categories/nature.jpg",
    desc: "Nature is for wildlife documentaries, scenic travel vlogs, and nature exploration videos",

    selectionConditions: {
      backendCategories: ["nature"],
      analysisScores: (detailScore, diffScore) =>
        detailScore >= 1200 && diffScore >= 1000000,
      keywordThreshold: 1,
    },
  },
  demo: {
    categoryName: "Demo",
    descImg: "../assets/categories/demo.jpg",
    desc: "Demo covers all types of demonstration videos, such as product unboxings and practical guides",
    selectionConditions: {
      backendCategories: [],
      analysisScores: (_detailScore, _diffScore) => false,
      keywordThreshold: 1,
    },
  },
  defaultQuality: {
    categoryName: "Default Quality",
    descImg: "../assets/categories/default.jpg",
    desc: "Default quality for all video categories",
    selectionConditions: {
      backendCategories: [],
      analysisScores: (_detailScore, _diffScore) => false,
      keywordThreshold: 1,
    },
  },
};

export type Feature = { featureName: string; description: string };

export const features: { [key: string]: Feature } = {
  audioOnly: {
    featureName: "Audio Only Video",
    description: "Enables playback of only the audio stream of the video",
  },
  lowBackgroundResolution: {
    featureName: "Lower Quality for Background Playback",
    description:
      "Drops video quality when the video is playing in the background",
  },
  userInitiatedPlayback: {
    featureName: "User-initiated Playback",
    description: "Stops videos from loading until you start playing the video",
  },
  thumbnailHoverBlocking: {
    featureName: "Block Thumbnail Hover",
    description:
      "Prevents video previews from playing when hovering over a thumbnail",
  },
  blockThumbnailLoad: {
    featureName: "Block Thumbnail Load",
    description: "Stops the loading of video thumbnails",
  },
  blockHomePageLoad: {
    featureName: "Block Home Page Loading",
    description: " Stops automatic loading of the YouTube home page",
  },
};

// taken from https://github.com/sameernyaupane/simple-auto-hd/
export const qualityTitles = [
  "Quality",
  "Gehalte",
  "Keyfiyyət",
  "Kualitas",
  "Kualiti",
  "Kvalitet",
  "Qualitat",
  "Kvalita",
  "Qualität",
  "Kvaliteet",
  "Calidad",
  "Kalitatea",
  "Kalidad",
  "Qualité",
  "Calidade",
  "Kvaliteta",
  "Ikhwalithi",
  "Gæði",
  "Ubora",
  "Kvalitāte",
  "Kokybė",
  "Minőség",
  "Kwaliteit",
  "Sifati",
  "Qualidade",
  "Calitate",
  "Cilësia",
  "Kakovost",
  "Laatu",
  "Chất lượng",
  "Kalite",
  "Якасць",
  "Сапаты",
  "Квалитет",
  "Качество",
  "Якість",
  "Ποιότητα",
  "Որակ",
  "איכות",
  "معیار",
  "الجودة",
  "کیفیت",
  "गुण",
  "गुणवत्ता",
  "क्वालिटी",
  "গুণাগুণ",
  "গুণমান",
  "ਗੁਣਵੱਤਾ",
  "ક્વૉલિટી",
  "ଗୁଣବତ୍ତା",
  "தரம்",
  "క్వాలిటీ",
  "ಗುಣಮಟ್ಟ",
  "നിലവാരം",
  "ගුණත්වය",
  "คุณภาพ",
  "ຄຸນນະພາບ",
  "အရည်အသွေး",
  "ხარისხი",
  "ጥራት",
  "គុណភាព​",
  "画质",
  "畫質",
  "画質",
  "화질",
];
