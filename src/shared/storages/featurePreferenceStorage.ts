import {
  BaseStorage,
  createStorage,
  StorageType
} from "@src/shared/storages/base";
import { defaultFeaturePreference } from "@src/shared/constants/constants";

export type FeaturePreference = {
  theme: boolean; // true for dark
  offlineMode: boolean;
  audioOnly: boolean;
  audioOnlyBackground: boolean;
  audioOnlyBackgroundTimeout: number;
};

type FeaturePreferenceStorage = BaseStorage<FeaturePreference>;

const storage = createStorage<FeaturePreference>(
  "feature-preference",
  defaultFeaturePreference,
  {
    storageType: StorageType.Local,
    liveUpdate: true
  }
);

const featurePreferenceStorage: FeaturePreferenceStorage = {
  ...storage
};

export default featurePreferenceStorage;
