// refreshes custom elements on preferences change
chrome.storage.onChanged.addListener((_changes, _namespace) => {
  // if popup is not open, do not refresh components
  if (chrome.extension.getViews({ type: "popup" }).length == 0) return;

  document
    .querySelectorAll('[data-element="custom"]')
    .forEach((el) => el.replaceWith(el));
});

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', (event) => {
  // Wait for the input-bar to be defined
  customElements.whenDefined('input-bar').then(() => {
    const inputBar = document.querySelector("input-bar");
    const keywordInput = document.getElementById("default-input");

    // Ensure that inputBar and input are found
    if (inputBar && keywordInput) {
      inputBar.setInput(keywordInput);
    } else {
      console.error('input-bar or default-input is not found.');
      return;
    }

    // Add click event listener to the submit button
    document.getElementById("submit-btn").addEventListener("click", () => {
      const category = document.getElementById("large-input").value;
      const tags = Array.from(document.querySelectorAll("input-tag")).map(tag => tag.text);
      const submission = { category, keywords: tags };
      
      console.log(submission); // For now logging the keywords

      document.getElementById("large-input").value = ''; 
      document.getElementById("large-input").placeholder = "Enter category name";

      inputBar.tagCount = 0; 
      inputBar.querySelector("ul").innerHTML = ''; 

      keywordInput.disabled = false; 
      keywordInput.placeholder = "Add relevant keywords";

      // Send the submission to the background script
    });

    // Listen for the 'tag-limit-reached' event
    inputBar.addEventListener('tag-limit-reached', () => {
      keywordInput.disabled = true;
      keywordInput.placeholder = "Reached the keyword limit";
    });

    // Listen for the 'tag-removed' event
    inputBar.addEventListener('tag-removed', () => {
      keywordInput.disabled = false;
      keywordInput.placeholder = "Add relevant keywords";
    });
  });
});