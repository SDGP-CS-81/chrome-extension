import {
  BaseStorage,
  createStorage,
  StorageType
} from "@src/shared/storages/base";

export type Temporary = "light" | "dark";

type TemporaryStorage = BaseStorage<Temporary>;

const storage = createStorage<Temporary>("temporary-storage", "dark", {
  storageType: StorageType.Local,
  liveUpdate: true
});

const temporaryStorage: TemporaryStorage = {
  ...storage
  // TODO: extends your own methods
};

export default temporaryStorage;
