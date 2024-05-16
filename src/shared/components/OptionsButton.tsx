import { FiSettings } from "react-icons/fi";
function clickHandler() {
  chrome.runtime.openOptionsPage();
}

export const OptionsButton = () => {
  return (
    <FiSettings
      onClick={clickHandler}
      className="h-5 w-5 scale-110 cursor-pointer text-black dark:text-white"
    />
  );
};
