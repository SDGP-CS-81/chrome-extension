import {
  BaseStorage,
  createStorage,
  StorageType
} from "@src/shared/storages/base";
import { defaultFeaturePreferences } from "@src/shared/constants/constants";

export type FeaturePreferences = {
  defaultVideo: { quality: string };
  localMode: boolean;
  audioMode: boolean;
  backgroundMode: boolean;
  backgroundModeTimeout: number;
};

type FeaturePreferenceStorage = BaseStorage<FeaturePreferences> & {
  toggleLocalMode: () => void;
  setBackgroundMode: (value: boolean) => void;
  setAudioMode: (value: boolean) => void;
};

const storage = createStorage<FeaturePreferences>(
  "feature-preference",
  defaultFeaturePreferences,
  {
    storageType: StorageType.Local,
    liveUpdate: true
  }
);

const featurePreferenceStorage: FeaturePreferenceStorage = {
  ...storage,
  toggleLocalMode: () => {
    storage.set((current) => {
      return { ...current, localMode: !current.localMode };
    });
  },
  setBackgroundMode: (value: boolean) => {
    featurePreferenceStorage.set((current) => {
      return { ...current, backgroundMode: value };
    });
  },
  setAudioMode: (value: boolean) => {
    featurePreferenceStorage.set((current) => {
      return { ...current, audioMode: value };
    });
  }
};

export default featurePreferenceStorage;
