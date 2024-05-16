import useStorage from "../hooks/useStorage";
import themeStorage from "../storages/themeStorage";
import { FiMoon, FiSun } from "react-icons/fi";

export const ThemeButton = () => {
  const theme = useStorage(themeStorage);

  return (
    <button
      onClick={themeStorage.toggle}
      className="relative flex cursor-pointer items-center"
    >
      {theme === "light" ? (
        <FiMoon className="h-6 w-6 scale-110" />
      ) : (
        <FiSun className="h-6 w-6 scale-110" />
      )}
    </button>
  );
};
