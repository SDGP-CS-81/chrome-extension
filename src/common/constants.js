export const vidQuality1 = "144p";

export const qualities = [4320, 2160, 1440, 1080, 720, 480, 360, 240, 144];
export const qualityClosest = qualities.find(
  (quality) => quality <= screen.height
);

export const defaultPreferences = {
  audioOnly: false,
  something: false,
  another: false,
  idek: true,
  offlineMode: false,
};
