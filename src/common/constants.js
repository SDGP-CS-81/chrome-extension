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

export const categoryKeywords = {
  music: ["music", "song", "lyrics","feat"],
  podcast: ["podcast","conversation","interview","Episode","roundtable","disscussion","interview","talkshow"],
  gaming:["gameplay","walkthrough","PC","PS","game","fortnite","xbox","4K","fortnite","gta"],
  news:["news","update","breaking","headlines","politics","world","today","reports","latest"],
  coding:["python","programming","tutorial","code","software","develop","java","web","learn","beginners"],
  sports:["football","score","highlights","match","vs","sports","cup","race","league","match"],
  graphics:["design","animation","graphics","art","digital","creative","drawing","2D","3D","illustration","sketch"],
  food:["cook","ingredients","baking","muckbang","food","recipe","baking","homemade","healthy","make"],
  nature:["wild","animals","survival","Scenic","nature","ocean","rainforest","camping","outdoor","tropical","earth","coastal"],
  demo:["repair","guide","how","instructions"]
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
