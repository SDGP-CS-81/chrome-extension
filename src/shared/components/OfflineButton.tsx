import wifiOn from "@assets/img/wifiOn.svg";
import wifiOff from "@assets/img/wifiOff.svg";
import useStorage from "../hooks/useStorage";
import featurePreferenceStorage from "../storages/featurePreferenceStorage";

export const OfflineButton = () => {
  const featurePreference = useStorage(featurePreferenceStorage);
  const offlineMode = featurePreference.offlineMode;

  return (
    <button
      onClick={featurePreferenceStorage.toggleOfflineMode}
      className="border-grey-mid flex cursor-pointer gap-x-3 rounded-full border-solid sm:border-2 sm:p-2.5"
    >
      <p className="hidden cursor-pointer text-lg sm:block">Offline Mode</p>
      <div className="relative flex cursor-pointer items-center stroke-black dark:stroke-white ">
        {offlineMode ? (
          <img
            src={wifiOff}
            alt="Wifi Off"
            className="h-6 w-6 scale-125 fill-transparent stroke-inherit peer-checked/toggle:hidden"
          />
        ) : (
          <img
            src={wifiOn}
            alt="Wifi On"
            className="h-6 w-6 scale-125 fill-transparent stroke-inherit peer-checked/toggle:hidden"
          />
        )}
      </div>
    </button>
  );
};
