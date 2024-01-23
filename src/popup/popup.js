// localStorage.setItem(
//   "preferences",
//   JSON.stringify({
//     audioOnly: false,
//   })
// );

// chrome.storage.local.set({ preferences: { audioOnly: false } }).then(() => {
//   console.log("Value is set to " + false);
// });

document.querySelector("#logoBtn").addEventListener("click", (event) => {
  event.preventDefault();

  chrome.runtime.openOptionsPage();
});
