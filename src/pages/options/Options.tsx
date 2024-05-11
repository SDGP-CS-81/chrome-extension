import { Header } from "@root/src/shared/components/Header";
import useStorage from "@root/src/shared/hooks/useStorage";
import themeStorage from "@root/src/shared/storages/themeStorage";

const Options = () => {
  const theme = useStorage(themeStorage);
  document.documentElement.setAttribute("data-mode", theme);

  return (
    <div className="bg-secondary-light font-dmsans dark:bg-secondary-dark text-black dark:text-white">
      <Header />
    </div>
  );
};

export default Options;
