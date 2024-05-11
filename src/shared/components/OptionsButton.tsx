import settings from "@assets/img/settings.svg";

function clickHandler() {
  chrome.runtime.openOptionsPage();
}

export const OptionsButton = () => {
  return (
    <button onClick={clickHandler} className="stroke-red-700 text-blue-600">
      <img
        src={settings}
        alt="Settings Button"
        className="mt-px h-6 w-6 cursor-pointer stroke-black text-blue-600 dark:stroke-red-700"
      />
    </button>
  );
};
