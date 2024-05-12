import {
  BaseStorage,
  createStorage,
  StorageType
} from "@src/shared/storages/base";
import { defaultFeaturePreferences } from "@src/shared/constants/constants";

export type FeaturePreferences = {
  defaultVideo: { quality: string };
  offlineMode: boolean;
  audioMode: boolean;
  backgroundMode: boolean;
  backgroundModeTimeout: number;
};

type FeaturePreferenceStorage = BaseStorage<FeaturePreferences> & {
  toggleOfflineMode: () => Promise<void>;
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
  toggleOfflineMode: async () => {
    await storage.set((current) => {
      current.offlineMode = !current.offlineMode;
      return current;
    });
  }
};

export default featurePreferenceStorage;
