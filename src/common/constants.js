export const apiURL = "http://localhost:5000";
export const qualities = [144, 240, 360, 480, 720, 1080, 1440, 2160, 4320];
export const closestQualityToScreen =
  qualities[
    qualities.indexOf(
      qualities.find((quality) => quality >= window.screen.height)
    ) - 1
  ];

export const defaultPreferences = {
  categories: {
    music: "144",
    podcast: "144",
    gaming: "1080",
    news: "480",
    coding: "1080",
    sports: "720",
    graphics: "240",
    food: "144",
    nature: "720",
    demo: "480",
    defaultQuality: "144",
  },
  audioOnly: false,
  lowBackgroundResolution: false,
  userInitiatedPlayback: false,
  thumbnailHoverBlocking: false,
  blockThumbnailLoad: true,
  blockHomePageLoad: false,
};

export const categories = {
  music: {
    categoryName: "Music",
    decscImg: "../assets/userface_categories/music.png",
    desc: "Music includes music videos and live performances",
    keyWords: ["music", "song", "lyrics"],
  },
  podcast: {
    categoryName: "Podcast",
    decscImg: "../assets/userface_categories/podcast.png",
    desc: "Podcast is about all podcast content including interviews and panel discussions",
    keywords: ["podcast", "conversation", "interview", "Episode"],
  },
  gaming: {
    categoryName: "Gaming",
    decscImg: "../assets/userface_categories/game.png",
    desc: "Gaming focuses on in-game content, including gameplays and walkthroughs",
    keywords: ["gameplay", "walkthrough", "PC", "PS", "game", "live"],
  },
  news: {
    categoryName: "News",
    decscImg: "../assets/userface_categories/news.png",
    desc: "News focuses on news headlines and videos that include worldwide updates",
    keywords: ["news", "update", "breaking", "headlines", "politics", "world"],
  },
  coding: {
    categoryName: "Coding",
    decscImg: "../assets/userface_categories/coding.png",
    desc: "Coding includes programming and coding content, such as coding tutorials",
    keywords: ["python", "programming", "tutorial", "software", "develop"],
  },
  sports: {
    categoryName: "Sports",
    decscImg: "../assets/userface_categories/sports.png",
    desc: "Sports is for all sports-related content, such as match highlights and in-game moments",
    keywords: ["football", "score", "highlights", "match", "vs"],
  },
  graphics: {
    categoryName: "Graphics",
    decscImg: "../assets/userface_categories/graphics.png",
    desc: "Graphics covers animations and a variety of visually creative videos",
    keywords: ["design", "animation", "art", "digital", "creative"],
  },
  food: {
    categoryName: "Food",
    decscImg: "../assets/userface_categories/food.png",
    desc: "Food includes cooking tutorials, muckbangs and food reviews",
    keywords: ["cook", "ingredients", "baking", "muckbang", "food"],
  },
  nature: {
    categoryName: "Nature",
    decscImg: "../assets/userface_categories/nature.png",
    desc: "Nature is for wildlife documentaries, scenic travel vlogs, and nature exploration videos",
    keywords: ["wild", "animals", "survival", "Scenic", "nature", "ocean"],
  },
  demo: {
    categoryName: "Demo",
    decscImg: "../assets/userface_categories/demo.png",
    desc: "Demo covers all types of demonstration videos, such as product unboxings and practical guides",
    keywords: ["repair", "guide", "how", "instructions"],
  },
  defaultQuality: {
    categoryName: "Default Quality",
    decscImg: "../assets/userface_categories/default.png",
    desc: "Default quality for all video categories",
    keywords: [],
  },
};

export const features = {
  audioOnly: {
    featureName: "Audio Only Video",
    description: "Enables playback of only the audio stream of the video",
  },
  lowBackgroundResolution: {
    featureName: "Low Background",
    description:
      "Reduces video quality to the lowest when the video is playing in the background",
  },
  userInitiatedPlayback: {
    featureName: "User-initiated Playback",
    description: "Stops videos from loading until you start playing the video",
  },
  thumbnailHoverBlocking: {
    featureName: "Block Thumbnail Hover",
    description:
      " Prevents video previews from playing when hovering over a thumbnail",
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

export const defaultCurrentVideoCategory = "coding";

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
