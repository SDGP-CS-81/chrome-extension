import { html } from "../helpers.js";

class categoryKeywordForm extends HTMLElement {
  constructor() {
    super();
  }

  generateTemplate() {
    const template = document.createElement("template");
    template.innerHTML = html`
      <div class="flex pb-5 pr-10">
        <h5
          for="category-input"
          class="w-1/3 border border-transparent text-base text-gray-900 dark:text-white"
        >
          Category
        </h5>
        <h5
          for="keywords-input"
          class="w-2/3 border border-transparent text-base text-gray-900 dark:text-white"
        >
          Keywords
        </h5>
      </div>
      <form class="flex flex-col gap-y-6 text-base">
        <div class="flex gap-x-0.5">
          <input
            name="category"
            id="category-input"
            class="flex w-1/3 flex-col rounded-l-lg rounded-r-none bg-gray-100 p-4 outline outline-1 outline-slate-300 dark:bg-grey-high dark:shadow-stone-500 dark:outline-none"
            placeholder="Enter category name"
          />
          <input
            name="keywords"
            id="keywords-input"
            class="flex w-2/3 flex-col rounded-l-none rounded-r-lg bg-gray-100 p-4 outline outline-1 outline-slate-300 dark:bg-grey-high dark:shadow-stone-500 dark:outline-none"
            placeholder="Add relevant keywords"
            disabled
          />
          <button type="submit" class="grid w-10 place-items-center">
            <span class="text-3xl text-black dark:text-white">+</span>
          </button>
        </div>
        <div
          id="category-keywords-container"
          class="flex flex-col gap-y-6"
        ></div>
      </form>
    `;
    return template;
  }

  async connectedCallback() {
    this.setAttribute("data-element", "custom");
    this.appendChild(this.generateTemplate().content.cloneNode(true));
    await this.setUpEventListeners();
    await this.loadDataFromLocalStorage();
  }

  async setUpEventListeners() {
    const form = this.querySelector("form");
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

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(e.target as HTMLFormElement);
      const categoryData = (formData.get("category") as string).toLowerCase();
      const keywords = formData.get("keywords") as string;

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
