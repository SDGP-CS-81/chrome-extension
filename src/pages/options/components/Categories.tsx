import { Switch } from "@nextui-org/react";
import { Category } from "@root/src/shared/components/Category";
import { categories } from "@root/src/shared/constants/categories";
import useStorage from "@root/src/shared/hooks/useStorage";
import featurePreferenceStorage from "@root/src/shared/storages/featurePreferenceStorage";

export const Categories = () => {
  const categoryKeys = Object.keys(categories);
  const featurePreferences = useStorage(featurePreferenceStorage);

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-end justify-between">
        <h2 className="text-xl">Categories</h2>
        <h4 className="text-base">Audio Only</h4>
      </div>
      <div className="mb-4 flex justify-end">
        <Switch
          isSelected={featurePreferences.audioMode}
          onValueChange={handleChange}
          color="secondary"
          className="bg-blue-500"
        />
      </div>

      <div className="flex flex-col gap-y-2">
        {categoryKeys.map((categoryKey, index) => {
          return (
            <Category
              key={index}
              categoryKey={categoryKey}
              isGlobalAudioMode={featurePreferences.audioMode}
            />
          );
        })}
      </div>
    </div>
  );
};

function handleChange(isSelected: boolean) {
  featurePreferenceStorage.setAudioMode(isSelected);
}
