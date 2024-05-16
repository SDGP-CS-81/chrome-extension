import { Category } from "@root/src/shared/components/Category";

function useCurrentCategory() {
  return "podcast";
}

export const CurrentCategory = () => {
  const currentCategory = useCurrentCategory();
  return <Category categoryKey={currentCategory} />;
};
