import {
  categories,
  defaultCategoryPreference
} from "@src/shared/constants/constants";
import {
  BaseStorage,
  createStorage,
  StorageType
} from "@src/shared/storages/base";

type CategoryP = {
  min: string;
  max: string;
  audioOnly: boolean;
};

export type CategoryPreference = Record<keyof typeof categories, CategoryP>;

type CategoryPreferenceStorage = BaseStorage<CategoryPreference>;

const storage = createStorage<CategoryPreference>(
  "category-preference",
  defaultCategoryPreference,
  {
    storageType: StorageType.Local,
    liveUpdate: true
  }
);

const categoryPreferenceStorage: CategoryPreferenceStorage = {
  ...storage
};

export default categoryPreferenceStorage;
