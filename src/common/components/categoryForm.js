class categoryKeywordForm extends HTMLElement {
  constructor() {
    super();
  }

  generateTemplate() {
    const template = document.createElement("template");
    template.innerHTML = `
      <div class="flex flex-col items-center container px-8 h-50vh mt-5">
      <form id="category-keyword" class="mb-6 w-full sm:w-[600px] flex flex-row gap-0">
          <div class="flex flex-col w-1/2">
            <label for="category-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
            <input type="text" id="category-input" name="category" class="block w-full p-4 border rounded-l-lg rounded-r-none dark:bg-grey-high dark:border-gray-600 dark:placeholder-gray-400" placeholder="Enter category name">
          </div>
          <div class="flex flex-col w-full">
            <label for="keywords-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Keywords</label>
            <input type="text" id="keywords-input" name="keywords" class="block w-full p-4 border rounded-l-none rounded-r-lg bg-gray-50 dark:bg-grey-high dark:border-gray-600 dark:placeholder-gray-400" placeholder="Add relevant keywords" disabled>
          </div>
          <button type="submit" class="self-end bg-gray-high  text-black dark:text-white text-3xl py-2 pr-3 pl-2 rounded ml-3 my-1"> + </button>
        </form>
        <div id="category-keywords-container">
        </div>
      </div>
    `;
    return template;
  }

  async connectedCallback() {
    this.appendChild(this.generateTemplate().content.cloneNode(true));
    this.setUpEventListeners();

    const categoryInput = this.querySelector("#category-input");
    const keywordsInput = this.querySelector("#keywords-input");

    categoryInput.addEventListener("input", () => {
      if (categoryInput.value.trim()) {
        keywordsInput.disabled = false;
      } else {
        keywordsInput.disabled = true;
      }
    });
  }

  setUpEventListeners() {
    const form = this.querySelector("#category-keyword");

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const categoryData = formData.get("category");
        let keywordData = formData.get("keywords");

        keywordData = keywordData.split(',').map(keyword => keyword.trim());

        let initialKeywords = localStorage.getItem(categoryData);

        if (initialKeywords != null) {
          initialKeywords = JSON.stringify([
            ...JSON.parse(initialKeywords),
            ...keywordData,
          ]);
        } else {
          initialKeywords = keywordData;
        }

        localStorage.setItem(categoryData, JSON.stringify(initialKeywords));

        e.target.reset();

        const categoryKeywordsContainer = this.querySelector("#category-keywords-container");

        const newRow = document.createElement("form");
        newRow.classList.add("mb-6", "w-full", "sm:w-[600px]", "flex", "flex-row", "gap-0");

        const categoryElement = document.createElement("div");
        categoryElement.classList.add("flex", "flex-col", "w-1/2", "p-4", "border", "rounded-l-lg", "rounded-r-none", "dark:bg-grey-high", "dark:border-gray-600");
        categoryElement.textContent = categoryData;

        const keywordsElement = document.createElement("div");
        keywordsElement.classList.add("flex", "flex-col", "w-full", "p-4", "border", "rounded-l-none", "rounded-r-lg", "bg-gray-50", "dark:bg-grey-high", "dark:border-gray-600");
        keywordsElement.textContent = keywordData;

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("self-end", "text-black","dark:text-white", "text-lg", "py-2", "pl-3","pr-1","mb-2","mr-2" ,"rounded");
        deleteButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>`;

        deleteButton.addEventListener("click", () => {
          categoryKeywordsContainer.removeChild(newRow);
          localStorage.removeItem(categoryData);
        });

        newRow.appendChild(categoryElement);
        newRow.appendChild(keywordsElement);
        newRow.appendChild(deleteButton);

        categoryKeywordsContainer.appendChild(newRow);
      });
    }
  }
}

customElements.define("category-keyword-form", categoryKeywordForm);
