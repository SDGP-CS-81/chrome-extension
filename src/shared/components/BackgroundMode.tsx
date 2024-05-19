import { Switch } from "@nextui-org/react";
import { features } from "@src/shared/constants/constants";
import featurePreferenceStorage from "@src/shared/storages/featurePreferenceStorage";
import useStorage from "@src/shared/hooks/useStorage";

export const BackgroundMode = () => {
  const info = features.backgroundMode;
  const featurePreferences = useStorage(featurePreferenceStorage);

  return (
    <div className="flex h-14 w-full items-center justify-between rounded-lg border border-grey-low bg-secondary-light px-[18px] dark:border-grey-high dark:bg-grey-high sm:h-20 sm:px-[22px]">
      <div className="flex flex-col">
        <p className="text-base">{info.featureName}</p>
        <p className="hidden text-sm text-grey-mid dark:text-grey-low sm:block">
          {info.description}
        </p>
      </div>
      <Switch
        isSelected={featurePreferences.backgroundMode}
        onValueChange={handleChange}
        color="secondary"
        className="bg-blue-500"
      />
    </div>
  );
};

function handleChange(isSelected: boolean) {
  featurePreferenceStorage.setBackgroundMode(isSelected);
}
