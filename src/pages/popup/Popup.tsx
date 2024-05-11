import React from "react";
import withSuspense from "@src/shared/hoc/withSuspense";
import withErrorBoundary from "@src/shared/hoc/withErrorBoundary";
import { Header } from "@root/src/shared/components/Header";
import useStorage from "@root/src/shared/hooks/useStorage";
import themeStorage from "@root/src/shared/storages/themeStorage";

const Popup = () => {
  const theme = useStorage(themeStorage);
  document.documentElement.setAttribute("data-mode", theme);

  return (
    <div className="font-dmsans bg-secondary-light dark:bg-secondary-dark flex h-[260px] w-80  flex-col overflow-hidden text-black shadow-sm dark:text-white">
      <Header />
    </div>
  );
};

export default withErrorBoundary(
  withSuspense(Popup, <div> Loading ... </div>),
  <div> Error Occur </div>
);
