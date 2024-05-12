import { Category } from "@root/src/shared/components/Category";
import { categories } from "@root/src/shared/constants/categories";
import useStorage from "@root/src/shared/hooks/useStorage";
import categoryPreferencesStorage from "@root/src/shared/storages/categoryPreferenceStorage";

export const Categories = () => {
  const categoryPreferences = useStorage(categoryPreferencesStorage);
  const categoryInfoAndPreferences = Object.keys(categories).map(
    (categoryKey) => {
      return {
        categoryKey,
        info: categories[categoryKey],
        preference: categoryPreferences[categoryKey]
      };
    }
  );

  return (
    <div className="flex w-full flex-col gap-y-2">
      <div className="mb-4 mr-10 flex items-end justify-between">
        <h1 className="text-xl">Categories</h1>
        <h6 className="text-base">Audio Only</h6>
      </div>
      {categoryInfoAndPreferences.map((category, index) => {
        return (
          <Category
            key={index}
            categoryKey={category.categoryKey}
            info={category.info}
            preference={category.preference}
          />
        );
      })}
    </div>
  );
};
