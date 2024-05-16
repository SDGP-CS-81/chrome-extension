import useStorage from "@src/shared/hooks/useStorage";
import categoryPreferenceStorage from "@src/shared/storages/categoryPreferenceStorage";
import { CategoryInfoPopup } from "@src/shared/components/CategoryInfoPopup";
import { categories } from "../constants/categories";

type CategoryProps = {
  categoryKey: string;
  isGlobalAudioMode?: boolean;
};

export const Category = ({ categoryKey, isGlobalAudioMode }: CategoryProps) => {
  const categoryPreferences = useStorage(categoryPreferenceStorage);

  const preference = categoryPreferences[categoryKey];
  preference;
  const info = categories[categoryKey];

  if (isGlobalAudioMode) {
    // pass true into toggle, put this line in jsx
  }
  return (
    <div className="group/category relative flex h-24 w-full items-center justify-between rounded-lg border border-grey-low bg-secondary-light px-2.5 py-1.5 text-left text-base shadow-sm dark:border-grey-high dark:bg-grey-high md:h-16 md:px-[18px]">
      <p className="grid h-full text-xl md:place-items-center md:text-base">
        {info.categoryName}
      </p>
      <div>
        {/* <Slider
            label="Select a value"
            color="danger"
            size="sm"
            step={10}
            marks={[
              {
                value: 20,
                label: "20%"
              },
              {
                value: 50,
                label: "50%"
              },
              {
                value: 80,
                label: "80%"
              }
            ]}
            defaultValue={20}
            className="max-w-md"
          />*/}
      </div>

      <CategoryInfoPopup
        description={info.description}
        exampleImage={info.exampleImage}
      />
    </div>
  );
};
