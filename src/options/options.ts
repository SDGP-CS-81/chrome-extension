// refreshes custom elements on preferences change
chrome.storage.onChanged.addListener((_changes, _namespace) => {
  // if popup is not open, do not refresh components
  if (chrome.extension.getViews({ type: "popup" }).length == 0) return;

  document
    .querySelectorAll('[data-element="custom"]')
    .forEach((el) => el.replaceWith(el));
});

document.getElementById("submit-btn").addEventListener("click", () => {
  const category = document.getElementById("large-input").value;
  const tags = Array.from(document.querySelectorAll("input-tag")).map(tag => tag.text);
  const submission = { category, keywords: tags };
  
  console.log(submission); // For now logging the keywords

  
  document.getElementById("large-input").value = ''; 
  document.getElementById("large-input").placeholder = "Enter category name";

  const inputBar = document.querySelector("input-bar");
  inputBar.tagCount = 0; 
  inputBar.querySelector("ul").innerHTML = ''; 

  const input = document.getElementById("default-input");
  input.disabled = false; 
  input.placeholder = "Add relevant keywords";

  // Send the submission to the background script
});



