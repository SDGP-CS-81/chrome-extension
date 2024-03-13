export const apiURL =
  "https://ec2-13-233-179-121.ap-south-1.compute.amazonaws.com";
export const qualities = [144, 240, 360, 480, 720, 1080, 1440, 2160, 4320];
export const categoriesList = ["Music", "Coding", "Nature", "Gaming", "News", "Podcast", "Sports", "Graphics", "Lifestyle", "Demo"];

export type PreferenceFeatures = {
  theme: boolean; // true for dark
  offlineMode: boolean;
  audioOnly: boolean;
  audioOnlyBackground: boolean;
  audioOnlyBackgroundTimeout: number;
};

export type Preferences = {
  categories: {
    [key: string]: { min: string; max: string; audioOnly: boolean };
  };
  features: PreferenceFeatures;
  channelCategories: {
    [key: string]: string;
  };
  channelPreferences: {
    [channelName: string]: string;
  }
  currentChannelName: string;
};

export const defaultPreferences = {
  categories: {
    music: {
      min: "144",
      max: "144",
      audioOnly: true,
    },
    podcast: {
      min: "144",
      max: "144",
      audioOnly: true,
    },
    gaming: {
      min: "1080",
      max: "1080",
      audioOnly: false,
    },
    news: {
      min: "480",
      max: "480",
      audioOnly: false,
    },
    coding: {
      min: "1080",
      max: "1080",
      audioOnly: false,
    },
    sports: {
      min: "720",
      max: "720",
      audioOnly: false,
    },
    graphics: {
      min: "240",
      max: "240",
      audioOnly: false,
    },
    lifestyle: {
      min: "480",
      max: "480",
      audioOnly: false,
    },
    nature: {
      min: "720",
      max: "720",
      audioOnly: false,
    },
    demo: {
      min: "480",
      max: "480",
      audioOnly: false,
    },
    defaultQuality: {
      min: "480",
      max: "480",
      audioOnly: false,
    },
  },
  features: {
    theme: true, // true for dark
    offlineMode: false,
    audioOnly: false,
    audioOnlyBackground: false,
    audioOnlyBackgroundTimeout: 5,
  },
  channelCategories: {
    music: "Music",
    podcast: "Podcast",
    gaming: "Gaming",
    news: "News",
    coding: "Coding",
    sports: "Sports",
    graphics: "Graphics",
    lifestyle: "Lifestyle",
    nature: "Nature",
    demo: "Demo",
  },
  currentChannelName: "Alex Lee",
  channelPreferences: {
    "Alex Lee": ""
  }
};

export type Category = {
  categoryName: string;
  descImg: string;
  desc: string;
  selectionConditions: {
    backendCategories: string[];
    textThreshold: number;
  };
};

export const categories: { [key: string]: Category } = {
  music: {
    categoryName: "Music",
    descImg: "../assets/categories/music.jpg",
    desc: "Music includes music videos and live performances",
    selectionConditions: {
      backendCategories: [],
      textThreshold: 1,
    },
  },
  podcast: {
    categoryName: "Podcast",
    descImg: "../assets/categories/podcast.jpg",
    desc: "Podcast is about all podcast content including interviews and panel discussions",
    selectionConditions: {
      backendCategories: ["person"],
      textThreshold: 1,
    },
  },
  gaming: {
    categoryName: "Gaming",
    descImg: "../assets/categories/game.jpg",
    desc: "Gaming focuses on in-game content, including gameplays and walkthroughs",
    selectionConditions: {
      backendCategories: ["person"],
      textThreshold: 1,
    },
  },
  news: {
    categoryName: "News",
    descImg: "../assets/categories/news.jpg",
    desc: "News focuses on news headlines and videos that include worldwide updates",
    selectionConditions: {
      backendCategories: ["news"],
      textThreshold: 1,
    },
  },
  coding: {
    categoryName: "Coding",
    descImg: "../assets/categories/coding.Jpg",
    desc: "Coding includes programming and coding content, such as coding tutorials",
    selectionConditions: {
      backendCategories: ["textHeavy"],
      textThreshold: 1,
    },
  },
  sports: {
    categoryName: "Sports",
    descImg: "../assets/categories/sports.jpg",
    desc: "Sports is for all sports-related content, such as match highlights and in-game moments",
    selectionConditions: {
      backendCategories: ["sports"],
      textThreshold: 1,
    },
  },
  graphics: {
    categoryName: "Graphics",
    descImg: "../assets/categories/graphics.jpg",
    desc: "Graphics covers animations and a variety of visually creative videos",
    selectionConditions: {
      backendCategories: ["graphics"],
      textThreshold: 1,
    },
  },
  lifestyle: {
    categoryName: "Lifestyle",
    descImg: "../assets/categories/lifestyle.jpg",
    desc: "Lifetyle covers vlogs and a variety of content where people are the subject",
    selectionConditions: {
      backendCategories: ["person"],
      textThreshold: 1,
    },
  },
  nature: {
    categoryName: "Nature",
    descImg: "../assets/categories/nature.jpg",
    desc: "Nature is for wildlife documentaries, scenic travel vlogs, and nature exploration videos",
    selectionConditions: {
      backendCategories: ["nature"],
      textThreshold: 1,
    },
  },
  demo: {
    categoryName: "Demo",
    descImg: "../assets/categories/demo.jpg",
    desc: "Demo covers all types of demonstration videos, such as product unboxings and practical guides",
    selectionConditions: {
      backendCategories: [],
      textThreshold: 1,
    },
  },
  defaultQuality: {
    categoryName: "Default Quality",
    descImg: "../assets/categories/default.jpg",
    desc: "If the video category is unclear, or if the extension cannot communicate with the server, this setting ensures videos continue to play in your preferred default quality",
    selectionConditions: {
      backendCategories: [],
      textThreshold: 1,
    },
  },
};

export type Feature = { featureName: string; description: string };

export const features: { [key: string]: Feature } = {
  audioOnly: {
    featureName: "Audio Only Video",
    description: "Enables playback of only the audio stream of the video",
  },
  audioOnlyBackground: {
    featureName: "Disable Video for Background Playback",
    description:
      "Disables video stream when the video is playing in the background",
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
