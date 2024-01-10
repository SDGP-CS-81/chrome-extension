(() => {
  const setQuality = (quality) => {
    const vidSettingsButton = document.querySelectorAll(
      ".ytp-settings-button"
    )[0];
    vidSettingsButton.click();

    const settingsMenuBtns = document.querySelectorAll(".ytp-menuitem-label");
    for (const btn of settingsMenuBtns) {
      if (btn.innerText === "Quality") {
        btn.click();
        break;
      }
    }

    const targetItems = document.querySelectorAll(
      ".ytp-quality-menu .ytp-menuitem-label"
    );

    console.log(targetItems);
    for (const item of targetItems) {
      console.log(item.innerText);
      if (item.innerText === quality) {
        item.click();
        break;
      }
    }
  };
  setTimeout(() => {
    setQuality("720p");
  }, 3000);
})();
