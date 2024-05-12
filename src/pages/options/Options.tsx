import { Header } from "@root/src/shared/components/Header";
import useStorage from "@root/src/shared/hooks/useStorage";
import themeStorage from "@root/src/shared/storages/themeStorage";
import { Categories } from "@src/pages/options/components/Categories";
import { Features } from "./components/Features";

const Options = () => {
  const theme = useStorage(themeStorage);
  document.documentElement.setAttribute("data-mode", theme);

  return (
    <div className="flex flex-col items-center bg-secondary-light font-dmsans text-black dark:bg-secondary-dark dark:text-white">
      <Header />

      <div className="flex w-full max-w-[600px] flex-col items-center gap-y-12 px-8 py-40">
        <div className="flex w-full justify-between">
          <p className="text-xl">Default</p>
          <p className="text-lg">Default video quality settings</p>
        </div>

        <Features />
        <Categories />
      </div>
    </div>
  );
};

export default Options;
