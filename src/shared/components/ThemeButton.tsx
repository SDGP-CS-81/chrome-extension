import sun from "@assets/img/sun.svg";
import moon from "@assets/img/moon.svg";
import useStorage from "../hooks/useStorage";
import themeStorage from "../storages/themeStorage";

export const ThemeButton = () => {
  const theme = useStorage(themeStorage);

  return (
    <button
      onClick={themeStorage.toggle}
      className="relative flex cursor-pointer items-center"
    >
      {theme === "light" ? (
        <img src={moon} alt="Dark mode" className="h-6 w-6 scale-125" />
      ) : (
        <img src={sun} alt="Light mode" className="h-6 w-6 scale-125" />
      )}
    </button>
  );
};
