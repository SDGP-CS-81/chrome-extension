import { CategoryInfo } from "../constants/categories";
import { CategoryPreference } from "../storages/categoryPreferenceStorage";
import { CategoryInfoPopup } from "./CategoryInfoPopup";

type CategoryProps = {
  categoryKey: string;
  info: CategoryInfo;
  preference: CategoryPreference;
};

export const Category = ({ categoryKey, info, preference }: CategoryProps) => {
  categoryKey;
  preference;
  return (
    <div className="relative flex items-center gap-x-4">
      <div className="relative flex h-24 w-full items-center justify-between rounded-lg border border-grey-low bg-secondary-light px-2.5 py-1.5 text-left text-base shadow-sm dark:border-grey-high dark:bg-grey-high md:h-16 md:px-[18px]">
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
      </div>
      <CategoryInfoPopup
        description={info.description}
        exampleImage={info.exampleImage}
      />
    </div>
  );
};
