import { FiInfo } from "react-icons/fi";

type CategoryInfoPopupProps = {
  description: string;
  exampleImage: string;
};

export const CategoryInfoPopup = ({
  description,
  exampleImage
}: CategoryInfoPopupProps) => {
  return (
    <button className="group absolute -right-4 items-center opacity-0 transition-all duration-100 ease-in-out group-hover/category:-right-10  group-hover/category:md:opacity-100">
      <FiInfo className="h-10 w-10 p-2" />
      <div className="absolute right-7 z-10 hidden w-60 transform flex-col items-center rounded-md bg-secondary-light shadow-2xl hover:block group-hover:block dark:bg-black dark:shadow-stone-700">
        <div
          style={{ backgroundImage: `url(${exampleImage})` }}
          className="aspect-video w-full rounded-t-md bg-cover bg-center bg-no-repeat"
        ></div>
        <p className="px-4 py-3 text-sm text-black dark:text-white">
          {description}
        </p>
      </div>
    </button>
  );
};
