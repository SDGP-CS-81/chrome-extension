import categoryPreferenceStorage from "@root/src/shared/storages/categoryPreferenceStorage";
import featurePreferenceStorage from "@root/src/shared/storages/featurePreferenceStorage";

function handleClick() {
  categoryPreferenceStorage.resetToDefault();
  featurePreferenceStorage.resetToDefault();
}

export const ResetDefault = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p>Reset Settings</p>
        <p className="text-sm text-grey-mid dark:text-grey-low">
          Resets preferences to the default
        </p>
      </div>
      {/* use button component */}
      <button
        onClick={handleClick}
        className="rounded-md bg-grey-high px-4 py-2"
      >
        Reset
      </button>
    </div>
  );
};
