export const setPreferences = async (preferences) => {
  await chrome.storage.local.set({ preferences: preferences });
};

export const getPreferences = async () => {
  const defaultPreferences = {
    audioOnly: false,
    something: false,
    another: false,
    idek: true,
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

export function replaceSlots(parent) {
  const slots = {};
  parent.querySelectorAll("[slot]").forEach((el) => {
    // convert 'nick-name' into 'nickName' for easy JS access
    // set the *DOM node* as data property value
    slots[
      el.getAttribute("slot").replace(/-(\w)/g, ($0, $1) => $1.toUpperCase())
    ] = el; // <- this is a DOM node, not a string ;-)
    el.removeAttribute("slot"); // <- remove attribute to avoid duplicates
  });
  parent.querySelectorAll("slot").forEach((slot) => {
    slot.replaceWith(slots[slot.name]);
  });
}
