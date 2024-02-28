// refreshes custom elements on preferences change
chrome.storage.onChanged.addListener((changes, namespace) => {
  // if popup is not open, do not refresh components
  if (chrome.extension.getViews({ type: "popup" }).length == 0) return;

  document
    .querySelectorAll('[data-element="custom"]')
    .forEach((el) => el.replaceWith(el));
});