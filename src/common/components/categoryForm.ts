import { html } from "../helpers.js";

class categoryKeywordForm extends HTMLElement {
  constructor() {
    super();
  }

  generateTemplate() {
    const template = document.createElement("template");
    template.innerHTML = html`
      <form id="category-keyword" class="mb-6 flex flex-row gap-0">
        <div class="flex w-1/3 flex-col">
          <label
            for="category-input"
            class="mb-2 block text-base font-medium text-gray-900 dark:text-white"
            >Category</label
          >
          <input
            type="text"
            id="category-input"
            name="category"
            class="block w-full rounded-l-lg rounded-r-none border border-grey-low bg-gray-50  p-4 dark:border-gray-600 dark:bg-grey-high dark:placeholder-gray-400"
            autocomplete="off"
            placeholder="Enter category name"
          />
        </div>
        <div class="flex w-2/3 flex-col">
          <label
            for="keywords-input"
            class="mb-2 block bg-red-600 text-base font-medium text-gray-900 dark:text-white"
            >Keywords</label
          >
          <input
            type="text"
            id="keywords-input"
            name="keywords"
            class="z-10 block w-full rounded-l-none rounded-r-lg border border-grey-low bg-gray-50 p-4 dark:border-gray-600 dark:bg-grey-high dark:placeholder-gray-400"
            spellcheck="false"
            autocomplete="off"
            placeholder="Add relevant keywords"
            disabled
          />
        </div>
        <button
          type="submit"
          class="bg-gray-high my-1  ml-2 self-end rounded py-2 pl-2 pr-4 text-3xl text-black dark:text-white"
        >
          +
        </button>
      </form>
      <div id="category-keywords-container"></div>
    `;
    return template;
  }

  async connectedCallback() {
    this.appendChild(this.generateTemplate().content.cloneNode(true));
    await this.setUpEventListeners();
    await this.loadDataFromLocalStorage();
  }

  async setUpEventListeners() {
    const form = this.querySelector("#category-keyword");
    const categoryInput = this.querySelector(
      "#category-input"
    ) as HTMLInputElement;
    const keywordsInput = this.querySelector(
      "#keywords-input"
    ) as HTMLInputElement;

    categoryInput.addEventListener("input", () => {
      if (categoryInput.value.trim()) {
        keywordsInput.disabled = false;
      } else {
        keywordsInput.disabled = true;
      }
    });

    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        let categoryData = formData.get("category") as string;
        const keywords = formData.get("keywords") as string;

        categoryData = categoryData.toLowerCase();
        const keywordData = keywords
          .split(",")
          .map((keyword) => keyword.trim().toLowerCase());

        // Get the existing data from chrome storage
        const customCategories = await getCustomCategories();

        // If the category already exists, append the new keywords
        if (customCategories[categoryData]) {
          customCategories[categoryData] = [
            ...new Set([...customCategories[categoryData], ...keywordData]),
          ];
        } else {
          customCategories[categoryData] = keywordData;
        }

        await setCustomCategories(customCategories);
        console.log("Value is set to " + JSON.stringify(customCategories));

        (e.target as HTMLFormElement).reset();
        (this.querySelector("#keywords-input") as HTMLInputElement).disabled =
          true;

        // Clear the current display and load the updated data from chrome storage
        this.querySelector("#category-keywords-container").innerHTML = "";
        this.loadDataFromLocalStorage();
      });
    }
  }
  disconnectedCallback() {
    this.replaceChildren();
    this.replaceWith(this.cloneNode(true));
  }
  async loadDataFromLocalStorage() {
    const categoryKeywordsContainer = this.querySelector(
      "#category-keywords-container"
    );

    const customCategories = await getCustomCategories();
    for (const categoryData in customCategories) {
      // const keywordDataArray = customCategories[categoryData];
      const newRow = document.createElement("category-input");
      newRow.setAttribute("category-id", categoryData);
      categoryKeywordsContainer.appendChild(newRow);
    }
  }
}

// Get the data from chrome storage and log it to the console
chrome.storage.local.get(null, function (items) {
  console.log(items);
});

customElements.define("category-keyword-form", categoryKeywordForm);

export const setCustomCategories = async (
  customCategories: CustomCategories
) => {
  await chrome.storage.local.set({ customCategories: customCategories });
};

export const getCustomCategories = async () => {
  const customCategories: CustomCategories = (
    await chrome.storage.local.get({
      customCategories: {},
    })
  ).customCategories;
  return customCategories;
};

export type CustomCategories = {
  [key: string]: string[];
};
