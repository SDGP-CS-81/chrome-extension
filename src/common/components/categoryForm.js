class categoryKeywordForm extends HTMLElement {
  constructor() {
    super();
  }

  generateTemplate() {
    const template = document.createElement("template");
    template.innerHTML = `

      <form id="category-keyword" class="mb-6 flex flex-row sm:w-[600px] gap-0">
          <div class="flex flex-col w-1/2">
            <label for="category-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
            <input type="text" id="category-input" name="category" class="block w-full p-4 border rounded-l-lg rounded-r-none border-grey-low  bg-gray-50 dark:bg-grey-high dark:border-gray-600 dark:placeholder-gray-400"  autocomplete="off" placeholder="Enter category name">
          </div>
          <div class="flex flex-col w-full">
            <label for="keywords-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Keywords</label>
            <input type="text" id="keywords-input" name="keywords" class="block w-full p-4 border rounded-l-none rounded-r-lg border-grey-low bg-gray-50 dark:bg-grey-high dark:border-gray-600 dark:placeholder-gray-400 z-10" spellcheck="false" autocomplete="off" placeholder="Add relevant keywords" disabled>
          </div>
          <button type="submit" class="self-end bg-gray-high  text-black dark:text-white text-3xl py-2 pr-4 pl-2 rounded ml-2 my-1"> + </button>
        </form>
        <div id="category-keywords-container">

        </div>
        </div>
    `;
    return template;
  }

  generateRowTemplate(categoryData, keywordDataArray) {
    const newRow = document.createElement("form");
    newRow.classList.add("mb-6", "w-full", "flex", "flex-row", "gap-0");

    const categoryElement = document.createElement("div");
    categoryElement.classList.add("flex", "flex-col", "w-1/2", "p-4", "border", "rounded-l-lg", "rounded-r-none", "dark:bg-grey-high","border-grey-low" ,"dark:border-gray-600");
    categoryElement.style.width = "calc(50% - 10px)";
    categoryElement.textContent = categoryData;

    const keywordsElement = document.createElement("div");
    keywordsElement.classList.add("flex", "flex-col", "w-full", "p-4", "border", "rounded-l-none", "rounded-r-lg", "bg-gray-50", "dark:bg-grey-high","border-grey-low", "dark:border-gray-600");
  
    // Check if keywordDataArray is an array before calling join
    if (Array.isArray(keywordDataArray)) {
      keywordsElement.textContent = keywordDataArray.join(', ');
    } else {
      console.error(`Expected an array of keywords, but got ${typeof keywordDataArray}`);
    }

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("self-end", "text-black","dark:text-white", "text-lg", "py-2", "pl-3","pr-1","mb-2","mr-2" ,"rounded");
    deleteButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
      </svg>`;
  
    deleteButton.addEventListener("click", () => {
      newRow.remove();
      // Remove the category from chrome storage
      chrome.storage.local.get(['categories'], function(result) {
        let categories = result.categories || {};
        delete categories[categoryData];
        chrome.storage.local.set({categories: categories}, function() {
          console.log('Category ' + categoryData + ' is removed from storage.');
        });
      });
    });
  
    newRow.appendChild(categoryElement);
    newRow.appendChild(keywordsElement);
    newRow.appendChild(deleteButton);
  
    return newRow;
  }

  async connectedCallback() {
    this.appendChild(this.generateTemplate().content.cloneNode(true));
    this.setUpEventListeners();
    this.loadDataFromLocalStorage();
  }
  
  setUpEventListeners() {
    const form = this.querySelector("#category-keyword");
    const categoryInput = this.querySelector("#category-input");
    const keywordsInput = this.querySelector("#keywords-input");
  
    categoryInput.addEventListener("input", () => {
      if (categoryInput.value.trim()) {
        keywordsInput.disabled = false;
      } else {
        keywordsInput.disabled = true;
      }
    });
  
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
  
        const formData = new FormData(e.target);
        let categoryData = formData.get("category");
        let keywordData = formData.get("keywords");
  
        categoryData = categoryData.toLowerCase();
        keywordData = keywordData.split(',').map(keyword => keyword.trim().toLowerCase());
  
        // Get the existing data from chrome storage
        chrome.storage.local.get(['categories'], function(result) {
          let categories = result.categories || {};
  
          // If the category already exists, append the new keywords
          if (categories[categoryData]) {
            categories[categoryData] = [...new Set([...categories[categoryData], ...keywordData])];
          } else {
            categories[categoryData] = keywordData;
          }
  
          // Save the updated data back to chrome storage
          chrome.storage.local.set({categories: categories}, function() {
            console.log('Value is set to ' + JSON.stringify(categories));
          });
  
          e.target.reset();
          this.querySelector("#keywords-input").disabled = true;
  
          // Clear the current display and load the updated data from chrome storage
          this.querySelector("#category-keywords-container").innerHTML = '';
          this.loadDataFromLocalStorage();
        }.bind(this));
      });
    }
  }
  
  loadDataFromLocalStorage() {
    const categoryKeywordsContainer = this.querySelector("#category-keywords-container");
    
    chrome.storage.local.get(['categories'], function(result) {
      let categories = result.categories || {};
  
      for (let categoryData in categories) {
        const keywordDataArray = categories[categoryData];
        const newRow = this.generateRowTemplate(categoryData, keywordDataArray);
        categoryKeywordsContainer.appendChild(newRow);
      }
    }.bind(this));
  }
  
}

// Get the data from chrome storage and log it to the console
chrome.storage.local.get(null, function(items) {
  console.log(items);
});
  
customElements.define("category-keyword-form", categoryKeywordForm);