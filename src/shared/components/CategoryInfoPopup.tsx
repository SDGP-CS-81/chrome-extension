import info from "@assets/img/info.svg";

type CategoryInfoPopupProps = {
  description: string;
  exampleImage: string;
};
export const CategoryInfoPopup = ({
  description,
  exampleImage
}: CategoryInfoPopupProps) => {
  return (
    <button className="group relative items-center">
      <img src={info} alt="Dark mode" className="h-6 w-6 scale-125" />
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
