import { defaultCategoryPreferences } from "@src/shared/constants/constants";
import {
  BaseStorage,
  createStorage,
  StorageType
} from "@src/shared/storages/base";
import { categories } from "@src/shared/constants/categories";

export type CategoryPreference = {
  min: string;
  max: string;
  audioOnly: boolean;
};

export type CategoryPreferences = Record<
  keyof typeof categories,
  CategoryPreference
>;

type CategoryPreferenceStorage = BaseStorage<CategoryPreferences>;

const storage = createStorage<CategoryPreferences>(
  "category-preference",
  defaultCategoryPreferences,
  {
    storageType: StorageType.Local,
    liveUpdate: true
  }
);

const categoryPreferenceStorage: CategoryPreferenceStorage = {
  ...storage
};

export default categoryPreferenceStorage;
