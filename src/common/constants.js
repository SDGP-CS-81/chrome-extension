export const backendUrl = "http://localhost:5000";
export const qualities = [4320, 2160, 1440, 1080, 720, 480, 360, 240, 144];
export const closestQualityToScreen = qualities.find(
  (quality) => quality <= screen.height
);

export const defaultPreferences = {
  audioOnly: false,
  something: false,
  another: false,
  idek: true,
  offlineMode: false,
};

export const categoryKeywords = {
  music: ["music", "song", "lyrics"],
  podcast: ["podcast"],
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
