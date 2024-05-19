import { FiWifi, FiWifiOff } from "react-icons/fi";
import useStorage from "../hooks/useStorage";
import featurePreferenceStorage from "../storages/featurePreferenceStorage";

export const LocalMode = () => {
  const featurePreferences = useStorage(featurePreferenceStorage);
  const localMode = featurePreferences.localMode;

  return (
    <button
      onClick={featurePreferenceStorage.toggleLocalMode}
      className="flex cursor-pointer items-center gap-x-2 rounded-full border-solid border-grey-mid sm:border-2 sm:p-3"
    >
      <p className="hidden cursor-pointer text-lg sm:block">Local Mode</p>
      {localMode ? (
        <FiWifiOff className="mb-1 h-6 w-6 text-black dark:text-white" />
      ) : (
        <FiWifi className="mb-1 h-6 w-6 text-black dark:text-white" />
      )}
    </button>
  );
};
