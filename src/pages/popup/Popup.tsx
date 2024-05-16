import withSuspense from "@src/shared/hoc/withSuspense";
import withErrorBoundary from "@src/shared/hoc/withErrorBoundary";
import { Header } from "@root/src/shared/components/Header";
import useStorage from "@root/src/shared/hooks/useStorage";
import themeStorage from "@root/src/shared/storages/themeStorage";
import { BackgroundMode } from "@root/src/shared/components/BackgroundMode";
import { CurrentCategory } from "./CurrentCategory";

const Popup = () => {
  const theme = useStorage(themeStorage);
  document.documentElement.setAttribute("data-mode", theme);

  return (
    <div className="flex w-80 flex-col overflow-hidden bg-secondary-light font-dmsans text-black shadow-sm dark:bg-secondary-dark dark:text-white">
      <Header />

      <div className="mt-14 flex flex-col gap-5 p-5">
        <div>
          <h2 className="mb-3 text-base font-medium">Current Category</h2>
          <CurrentCategory />
        </div>

        <div>
          <h2 className="mb-3 text-base font-medium">Current Channel</h2>
          <BackgroundMode />
        </div>

        <div>
          <h2 className="mb-3 text-base font-medium">Preferences</h2>
          <BackgroundMode />
        </div>
      </div>
    </div>
  );
};

export default withErrorBoundary(
  withSuspense(Popup, <div> Loading ... </div>),
  <div> Error Occur </div>
);
