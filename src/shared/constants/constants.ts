export const defaultFeaturePreference = {
  theme: true, // true for dark
  offlineMode: false,
  audioOnly: false,
  audioOnlyBackground: false,
  audioOnlyBackgroundTimeout: 6
} as const;

export const defaultCategoryPreference = {
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
  },
  defaultQuality: {
    min: "144",
    max: "480",
    audioOnly: false
  }
} as const;

export const categories = {
  music: {
    categoryName: "Music",
    descImg: "../assets/categories/music.jpg",
    desc: "Music includes music videos and live performances",
    selectionConditions: {
      backendCategories: [],
      textThreshold: 1
    }
  },
  podcast: {
    categoryName: "Podcast",
    descImg: "../assets/categories/podcast.jpg",
    desc: "Podcast is about all podcast content including interviews and panel discussions",
    selectionConditions: {
      backendCategories: ["person"],
      textThreshold: 1
    }
  },
  gaming: {
    categoryName: "Gaming",
    descImg: "../assets/categories/game.jpg",
    desc: "Gaming focuses on in-game content, including gameplays and walkthroughs",
    selectionConditions: {
      backendCategories: ["person"],
      textThreshold: 1
    }
  },
  news: {
    categoryName: "News",
    descImg: "../assets/categories/news.jpg",
    desc: "News focuses on news headlines and videos that include worldwide updates",
    selectionConditions: {
      backendCategories: ["news"],
      textThreshold: 1
    }
  },
  coding: {
    categoryName: "Coding",
    descImg: "../assets/categories/coding.Jpg",
    desc: "Coding includes programming and coding content, such as coding tutorials",
    selectionConditions: {
      backendCategories: ["textHeavy"],
      textThreshold: 1
    }
  },
  sports: {
    categoryName: "Sports",
    descImg: "../assets/categories/sports.jpg",
    desc: "Sports is for all sports-related content, such as match highlights and in-game moments",
    selectionConditions: {
      backendCategories: ["sports"],
      textThreshold: 1
    }
  },
  graphics: {
    categoryName: "Graphics",
    descImg: "../assets/categories/graphics.jpg",
    desc: "Graphics covers animations and a variety of visually creative videos",
    selectionConditions: {
      backendCategories: ["graphics"],
      textThreshold: 1
    }
  },
  lifestyle: {
    categoryName: "Lifestyle",
    descImg: "../assets/categories/lifestyle.jpg",
    desc: "Lifetyle covers vlogs and a variety of content where people are the subject",
    selectionConditions: {
      backendCategories: ["person"],
      textThreshold: 1
    }
  },
  nature: {
    categoryName: "Nature",
    descImg: "../assets/categories/nature.jpg",
    desc: "Nature is for wildlife documentaries, scenic travel vlogs, and nature exploration videos",
    selectionConditions: {
      backendCategories: ["nature"],
      textThreshold: 1
    }
  },
  demo: {
    categoryName: "Demo",
    descImg: "../assets/categories/demo.jpg",
    desc: "Demo covers all types of demonstration videos, such as product unboxings and practical guides",
    selectionConditions: {
      backendCategories: [],
      textThreshold: 1
    }
  },
  defaultQuality: {
    categoryName: "Default Quality",
    descImg: "../assets/categories/default.jpg",
    desc: "If the video category is unclear, or if the extension cannot communicate with the server, this setting ensures videos continue to play in your preferred default quality",
    selectionConditions: {
      backendCategories: [],
      textThreshold: 1
    }
  }
} as const;

export type VideoScores = {
  _id: string;
  textScores: Record<keyof typeof categories, number>;
};
