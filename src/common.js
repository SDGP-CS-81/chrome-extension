export const setPreferences = async (preferences) => {
  await chrome.storage.local.set({ preferences: preferences });
};

export const getPreferences = async () => {
  const defaultPreferences = {
    audioOnly: false,
  };

  const preferences = await chrome.storage.local.get({
    preferences: defaultPreferences,
  });
  return preferences;
};

export const html = (staticText, ...values) => {
  const fullText = staticText.reduce((acc, text, index) => {
    return acc + text + (values[index] ?? "");
  }, "");

  return fullText;
};
