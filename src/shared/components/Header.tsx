import { Logo } from "@src/shared/components/Logo";
import { OptionsButton } from "@root/src/shared/components/OptionsButton";
import { ThemeButton } from "./ThemeButton";
import { LocalMode } from "./LocalMode";

export const Header = () => {
  const isPopupPage = location.href.includes("popup");
  return (
    <header className="fixed z-50 flex h-14 w-full items-center justify-center border-b border-grey-mid bg-inherit px-5 sm:h-28 sm:p-8">
      <div className="flex w-full max-w-4xl items-center justify-between">
        <Logo />

        <div className="flex items-center gap-x-3 sm:gap-x-4">
          <LocalMode />
          {isPopupPage ? <OptionsButton /> : <ThemeButton />}
        </div>
      </div>
    </header>
  );
};
