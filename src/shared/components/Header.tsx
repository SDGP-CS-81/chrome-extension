import { Logo } from "@src/shared/components/Logo";
import { OfflineMode } from "@root/src/shared/components/OfflineMode";
import { OptionsButton } from "@root/src/shared/components/OptionsButton";
import { ThemeButton } from "./ThemeButton";

export const Header = () => {
  const isPopupPage = location.href.includes("popup");
  return (
    <header className="fixed z-50 flex h-14 w-full items-center justify-between border-b border-grey-mid bg-inherit px-5 sm:h-28 sm:px-8">
      <Logo />

      <div className="flex gap-x-3">
        <OfflineMode />
        {isPopupPage ? <OptionsButton /> : <ThemeButton />}
      </div>
    </header>
  );
};
