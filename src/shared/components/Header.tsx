import { Logo } from "@src/shared/components/Logo";
import { OfflineButton } from "@src/shared/components/OfflineButton";
import { OptionsButton } from "@root/src/shared/components/OptionsButton";
import { ThemeButton } from "./ThemeButton";

export const Header = () => {
  const isPopupPage = location.href.includes("popup");
  return (
    <header className="border-grey-mid flex h-14 items-center justify-between border-b px-5 sm:h-28 sm:px-8">
      <Logo />

      <div className="flex gap-x-3">
        <OfflineButton />
        {isPopupPage ? <OptionsButton /> : <ThemeButton />}
      </div>
    </header>
  );
};
